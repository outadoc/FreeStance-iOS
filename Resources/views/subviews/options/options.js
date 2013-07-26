//the page used to configure the application
var Utils = require('includes/utils');
var Ui = require('includes/ui');

Ti.include('/includes/enums.js');
Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;

var profileRow = Ui.createParentRow(I('more.settings.profile.title'), I('more.settings.profile.header'), I('more.settings.profile.prefix', ''), 'profile');
var codeRow = Ui.createTextFieldRow(I('more.settings.code.title'), I('more.settings.code.header'));
var hdRow = Ui.createParentRow(I('more.settings.hd.title'), null, I('more.settings.hd.prefix', ''), 'hd');
var modelRow = Ui.createParentRow(I('more.settings.model'), null, I('more.settings.model'), 'model');

var settingsSection = Ti.UI.createTableViewSection({
	headerTitle: I('more.settings.code.header'),
	rows: [codeRow, hdRow, modelRow]
});

//values to store the properties
var profile, code, hd, model;

var tableView = Ti.UI.createTableView({
	top: (Utils.isiPad()) ? 10 : undefined,
	data: [profileRow, settingsSection],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	footerView: Ui.createDestructionView(I('more.settings.reset.title')),
	rowHeight: 45,
	rowBackgroundColor: 'white',
	backgroundColor: 'transparent',
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY
});

tableView.footerView.getChildren()[0].addEventListener('click', function(e) {
	//if the user wants to reset the properties of the app asking if he's really sure
	var alert = Ti.UI.createOptionDialog({
		title: I('more.settings.reset.message', Ti.App.name),
		options: [I('more.settings.reset.yes'), I('more.settings.reset.cancel')],
		destructive: 0,
		cancel: 1
	});

	alert.show();
	alert.addEventListener('click', function(e) {
		//if we clicked the confirmation button
		if(e.index === 0) {
			var props = Ti.App.Properties.listProperties();
			//delete all properties using a loop
			for(var i = 0; i < props.length; i++) {
				var value = Titanium.App.Properties.getString(props[i]);
				Titanium.App.Properties.removeProperty(props[i]);
			}
			//get the updated values
			win.fireEvent('focus', {});
		}
	});
});

//a quick shorcut in case the user needs help
var b_help = Ti.UI.createButton({
	title: I('more.help.title')
});

b_help.addEventListener('click', function(e) {
	var win = Ti.UI.createWindow({
		url: '../help/help.js',
		title: I('more.help.title'),
		backgroundColor: Ui.getDefaultBackground()
	});
	Ti.UI.currentTab.open(win, {
		animated: true
	});
});

win.addEventListener('focus', function(e) {
	//getting the updated properties on focus
	profile = Ti.App.Properties.getInt('profileToModify', Profile.PROFILE_1);
	code = Ti.App.Properties.getString('profile' + profile + '.code', '');
	hd = Ti.App.Properties.getInt('profile' + profile + '.hd', HD.HD_1);
	model = Ti.App.Properties.getInt('profile' + profile + '.model', Model.FREEBOX_HD);

	//setting the fields with their respective values
	setFields();
});

win.addEventListener('blur', function(e) {
	//writing in the properties that the settings have been filled
	if(codeRow.getChildren()[0].getValue() !== '') {
		Ti.App.Properties.setBool('hasBeenSet', true);
	}
	//saving the code value
	Ti.App.Properties.setString('profile' + profile + '.code', codeRow.getChildren()[0].getValue());
});

win.setRightNavButton(b_help);
win.add(tableView);

//used to set all the data in their respective fields
function setFields() {
	profileRow.getChildren()[0].setText(I('more.settings.profile.prefix', profile.toString()));
	codeRow.getChildren()[0].setValue(code);
	hdRow.getChildren()[0].setText(I('more.settings.hd.prefix', hd.toString()));
	modelRow.getChildren()[0].setText(Utils.getModelString(model));
}

Ti.App.Properties.setInt('profileToModify', Profile.PROFILE_1); 