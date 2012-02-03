Ti.include('../includes/ui.js');
Ti.include('../includes/enums.js');
Ti.include('../includes/utils.js');
Ti.include('../includes/lib/json.i18n.js')

//page used when through the help process, to determine the user's freebox model
var win = Ti.UI.currentWindow;;
win.backgroundColor = getDefaultBackground();

var data = [
	{title:getModelString(Model.FREEBOX_HD), hasChild:true, model:Model.FREEBOX_HD},
	{title:getModelString(Model.FREEBOX_PLAYER), hasChild:true, model:Model.FREEBOX_REVOLUTION}
];

var tableView = Ti.UI.createTableView({
	data:data,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
});

tableView.addEventListener('click', function(e)
{
	var newWin = Ti.UI.createWindow({
		model:e.rowData.model,
		helpTo:win.helpTo,
		title:e.rowData.title,
		url:'info_display.js',
		barColor:'#464646',
		backgroundColor:getDefaultBackground()
	});
	
	if(newWin.helpTo == 'config')
		newWin.backButtonTitle = I('labels.config');
	else if(newWin.helpTo == 'code')
		newWin.backButtonTitle = I('labels.code');
	else if(newWin.helpTo == 'hd')
		newWin.backButtonTitle = I('labels.box');
			
	Ti.UI.currentTab.open(newWin,{animated:true});
});

win.add(tableView);