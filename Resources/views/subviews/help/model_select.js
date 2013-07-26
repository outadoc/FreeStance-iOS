Ti.include('/includes/enums.js');
Ti.include('/includes/lib/json.i18n.js');

var Ui = require('includes/ui'),
	Utils = require('includes/utils'),

//page used when through the help process, to determine the user's freebox model
win = Ti.UI.currentWindow,

tableView = Ti.UI.createTableView({
	data: [{
		title: Utils.getModelString(Model.FREEBOX_HD),
		hasChild: true,
		model: Model.FREEBOX_HD
	}, {
		title: Utils.getModelString(Model.FREEBOX_PLAYER),
		hasChild: true,
		model: Model.FREEBOX_REVOLUTION
	}],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white'
});

tableView.addEventListener('click', function(e) {
	var newWin = Ti.UI.createWindow({
		model: e.rowData.model,
		helpTo: win.helpTo,
		title: e.rowData.getTitle(),
		url: '../info_display.js',
		backgroundColor: Ui.getDefaultBackground()
	});

	if(newWin.helpTo == 'config') {
		newWin.setBackButtonTitle(I('labels.config'));
	} else if(newWin.helpTo == 'code') {
		newWin.setBackButtonTitle(I('labels.code'));
	} else if(newWin.helpTo == 'hd') {
		newWin.setBackButtonTitle(I('labels.box'));
	}

	Ti.UI.currentTab.open(newWin, {
		animated: true
	});
});

win.add(tableView); 