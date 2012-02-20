Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/ui.js');

var win = Ti.UI.currentWindow;
win.backgroundColor = getDefaultBackground();

var data = [{
	title:I('more.settings.title'),
	hasChild:true,
	path:'subviews/options/options.js',
	header:I('more.preferences')
}, {
	title:I('more.help.title'),
	hasChild:true,
	path:'subviews/help/help.js'
}, {
	title:I('more.website'),
	hasChild:true,
	path:'subviews/website.js',
	thisUrl:'http://dev.outadoc.fr',
	isWebsite:true,
	header:I('more.about')
}, {
	title:I('more.twitter'),
	hasChild:true,
	path:'subviews/website.js',
	thisUrl:'http://mobile.twitter.com/#!/outadev',
	isWebsite:true
}, {
	title:I('more.contact'),
	hasChild:true,
	email:'outadev@outadoc.fr'
}, {
	title:I('more.bugReport.title'),
	hasChild:true,
	email:'bug-report@outadoc.fr',
	bug:true
}, {
	title:I('more.legal.title'),
	hasChild:true,
	path:'subviews/info_display.js',
	header:''
}];

var tableViewOptions = {

};

var tableView = Ti.UI.createTableView({
	data:data,
	style:Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor:'transparent',
	rowBackgroundColor:'white'
});

tableView.addEventListener('click', function(e)
{
	if(e.rowData.path !== undefined) {
		var win;

		if(e.rowData.isWebsite) {
			win = Ti.UI.createWindow({
				url:e.rowData.path,
				thisUrl:e.rowData.thisUrl,
				title:e.rowData.title,
				tabBarHidden:true,
				backgroundColor:'#fff',
				barColor:'#464646',
				isModalWin:false
			});
		}
		else {
			win = Ti.UI.createWindow({
				url:e.rowData.path,
				title:e.rowData.title,
				barColor:'#464646',
				backgroundColor:getDefaultBackground(),
				helpTo:'legal'
			});
		}
		Ti.UI.currentTab.open(win, {
			animated:true
		});
	}
	else if(e.rowData.email !== undefined) {
		var email = Ti.UI.createEmailDialog({
			toRecipients:[e.rowData.email],
			barColor:'#464646'
		});

		if(e.rowData.bug !== undefined) {
			email.setSubject(I('more.bugReport.subject', Ti.App.name, Ti.App.version));
			email.setHtml(true);
			email.setMessageBody(I('more.bugReport.content', Ti.App.name, Ti.App.version, Ti.Platform.name, Ti.Platform.version, Ti.Platform.model, Ti.version));
		}
		email.open();
	}
});

win.add(tableView);
