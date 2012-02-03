//the page used to configure the application
Ti.include('../includes/enums.js');
Ti.include('../includes/utils.js');
Ti.include('../includes/lib/json.i18n.js');
Ti.include('../includes/ui.js');

var win = Ti.UI.currentWindow;

var profileField = addParentRow(I('more.settings.profile.title'), I('more.settings.profile.header'), I('more.settings.profile.prefix', ''), 'profile');
var codeField = addTextFieldRow(I('more.settings.code.title'), I('more.settings.code.header'));
var hdField = addParentRow(I('more.settings.hd.title'), null, I('more.settings.hd.prefix', ''), 'hd');
var modelField = addParentRow(I('more.settings.model'), null, I('more.settings.model'), 'model');

//values to store the properties
var profile, code, hd, model;

//returns a row containing a title and a value. opens a window when clicked
function addParentRow(title, header, rowName, configID) {
	var row = Ti.UI.createTableViewRow({
		title:title,
		hasChild:true,
		header:header
	});

	//the label containing the value you want to display
	var lbl = Ti.UI.createLabel({
		right:10,
		textAlign:'right',
		width:150,
		highlightedColor:'white',
		color:'#336699'
	});

	row.add(lbl);

	row.addEventListener('click', function(e) {
		var win = Ti.UI.createWindow({
			url:'options_select.js',
			title:title,
			rowName:rowName,
			configID:configID,
			backgroundColor:'stripped',
			barColor:'#464646'
		});
		Ti.UI.currentTab.open(win, {
			animated:true
		});
	});
	return row;
}

//returns a row containing a text field
function addTextFieldRow(text, header) {
	var row = Ti.UI.createTableViewRow({
		title:text,
		header:header,
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});

	var textfield = Ti.UI.createTextField({
		color:'#336699',
		height:35,
		top:4,
		right:20,
		width:80,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE,
		keyboardType:Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION,
		appearance:Titanium.UI.KEYBOARD_APPEARANCE_ALERT,
		hintText:'12345678'
	});

	textfield.addEventListener('change', function(e) {
		//the value must be between 0 and 8 characters only
		e.source.value = e.source.value.slice(0, 8);
	});

	row.add(textfield);
	return row;
}

var data = [profileField, codeField, hdField, modelField];

var tableView = Ti.UI.createTableView({
	data:data,
	style:Ti.UI.iPhone.TableViewStyle.GROUPED
});

tableView.footerView = getDestructionView(I('more.settings.reset.title'));
tableView.footerView.children[0].addEventListener('click', function(e) {
	//if the user wants to reset the properties of the app
	//asking if he's really sure
	var alert = Ti.UI.createOptionDialog({
		title:I('more.settings.reset.message', Ti.App.name),
		options:[I('more.settings.reset.yes'), I('more.settings.reset.cancel')],
		destructive:0,
		cancel:1
	});

	alert.show();
	alert.addEventListener('click', function(e) {
		//if we clicked the confirmation button
		if(e.index == 0) {
			var props = Ti.App.Properties.listProperties();
			//delete all properties using a loop
			for(var i = 0; i < props.length; i++) {
				var value = Titanium.App.Properties.getString(props[i]);
				Titanium.App.Properties.removeProperty(props[i]);
			}	
			//get the updated values
			getFields();
		}
	});
});

//a quick shorcut in case the user needs help
var b_help = Ti.UI.createButton({
	title:I('more.help.title')
})

b_help.addEventListener('click', function(e) {
	var win = Ti.UI.createWindow({
		url:'help.js',
		title:I('more.help.title'),
		backgroundColor:getDefaultBackground(),
		barColor:'#464646'
	});
	Ti.UI.currentTab.open(win, {
		animated:true
	});
});

win.addEventListener('focus', function(e) {
	//getting the updated properties on focus
	profile = Ti.App.Properties.getInt('profileToModify', Profile.PROFILE_1);
	code = Ti.App.Properties.getString('profile' + profile + '.code', '');
	hd = Ti.App.Properties.getInt('profile' + profile + '.hd', HD.HD_1);
	model = Ti.App.Properties.getInt('profile' + profile + '.model', Model.FREEBOX_HD);
	
	//setting the fields with their respective values
	getFields();
});

win.addEventListener('blur', function(e) {
	//writing in the properties that the settings have been filled
	if(data[1].children[0].value != '')
		Ti.App.Properties.setBool('hasBeenSet', true);
	//saving the code value
	Ti.App.Properties.setString('profile' + profile + '.code', data[1].children[0].value);
});

win.setRightNavButton(b_help);
win.add(tableView);

//used to set all the data in their respective fields
function getFields() {
	data[0].children[0].text = I('more.settings.profile.prefix', profile.toString());
	data[1].children[0].value = code;
	data[2].children[0].text = I('more.settings.hd.prefix', hd.toString());
	data[3].children[0].text = getModelString(model);
}

Ti.App.Properties.setInt('profileToModify', Profile.PROFILE_1);