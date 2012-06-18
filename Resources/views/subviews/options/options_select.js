//page used to select a value in a simple tableview, like you would do with the picker element
Ti.include('/includes/enums.js');
var Utils = require('includes/utils');

var win = Ti.UI.currentWindow;
var data = [];

//getting the profile we need to modify
var profile = Ti.App.Properties.getInt('profileToModify', Profile.PROFILE_1);
var selectedRow;

//setting the selected row: the -1 thing is because the tableview index starts with 0
if(win.configID == 'profile') {
	selectedRow = profile - 1;
}
// else, we just get the value we need
else {
	selectedRow = Ti.App.Properties.getInt('profile' + profile + '.' + win.configID, Profile.PROFILE_1) - 1;
}

for(var i = 0; i <= 2; i++) {
	var row = Ti.UI.createTableViewRow();
	if(i == selectedRow) {
		row.setHasCheck(true);
	}
	if(win.configID == 'model') {
		//if we're setting the row, no need of any incrementation thing, just get the model name
		row.setTitle(Utils.getModelString(i + 1));
		//we need only two rows here
		if(i == 1) {
			i = 2;
		}
	} else {
		row.setTitle(win.rowName + (i + 1));
	}

	data[i] = row;
}

var tableView = Ti.UI.createTableView({
	data: data,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundImage: null,
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY
});

tableView.addEventListener('click', function(e) {
	//timeout so we check the row after a certain delay (more "realistic")
	setTimeout(function() {
		for(var i = 0; i < e.section.getRows().length; i++) {
			e.section.getRows()[i].setHasCheck(false);
		}
		e.section.getRows()[e.index].setHasCheck(true);

		//setting the properties
		if(win.configID == 'profile') {
			Ti.App.Properties.setInt('profileToModify', e.index + 1);
		} else {
			Ti.App.Properties.setInt('profile' + profile + '.' + win.configID, e.index + 1);
		}
	}, 150);
});

win.add(tableView);
