Ti.include('/includes/lib/json.i18n.js');
var Ui = require('includes/ui');

var win = Ti.UI.currentWindow;

var data = [{
	title: I('more.help.hd.title'),
	hasChild: true,
	helpTo: 'hd',
	thisTitle: I('more.help.hd.winTitle')
}, {
	title: I('more.help.code.title'),
	hasChild: true,
	helpTo: 'code',
	thisTitle: I('more.help.code.winTitle')
}, {
	title: I('more.help.config'),
	hasChild: true,
	helpTo: 'config',
	thisTitle: I('more.help.config')
}];

var tableView = Ti.UI.createTableView({
	data: data,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY
});

tableView.addEventListener('click', function(e) {
	var win = Ti.UI.createWindow({
		title: e.rowData.thisTitle,
		helpTo: e.rowData.helpTo,
		backgroundColor: Ui.getDefaultBackground(),
		barColor: '#464646'
	});

	//if the user needs help about config, we directly go to the help content page
	if(e.rowData.helpTo == 'config') {
		win.setUrl('../info_display.js');
	}
	// else, open the model selection window
	else {
		win.setUrl('model_select.js');
	}

	Ti.UI.currentTab.open(win, {
		animated: true
	});
});

win.add(tableView); 