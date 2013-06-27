var Ui = require('includes/ui');

Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;

var tableView = Ti.UI.createTableView({
	/*@formatter:off*/
	data: [
		{leftImage: '/img/icon_settings.png', title: I('more.settings.title'), hasChild: true, path: 'subviews/options/options.js', header: I('more.preferences')},
		{leftImage: '/img/icon_help.png',title: I('more.help.title'), hasChild: true, path: 'subviews/help/help.js'},
		{leftImage: '/img/icon_website.png',title: I('more.website'), hasChild: true, path: 'subviews/website.js', thisUrl: 'http://dev.outadoc.fr', isWebsite: true, header: I('more.about')}, 
		{leftImage: '/img/icon_info.png',title: I('more.twitter'), hasChild: true, path: 'subviews/website.js', thisUrl: 'http://mobile.twitter.com/outadev', isWebsite: true},
		{leftImage: '/img/icon_contact.png',title: I('more.contact'), hasChild: true, email: 'outadev@outadoc.fr'},
		{leftImage: '/img/icon_bug.png',title: I('more.bugReport.title'), hasChild: true, email: 'bug-report@outadoc.fr', bug: true},
		{leftImage: '/img/icon_heart.png',title: I('more.credits.title'), hasChild: true, path: 'subviews/credits.js', header: '', isCredits: true}
	],
	/*@formatter:on*/
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY
});

tableView.addEventListener('click', function(e) {
	if(e.rowData.path !== undefined) {
		var win;

		if(e.rowData.isWebsite) {
			win = Ti.UI.createWindow({
				url: e.rowData.path,
				thisUrl: e.rowData.thisUrl,
				title: e.rowData.title,
				tabBarHidden: true,
				backgroundColor: '#fff',
				barColor: Ui.getBarColor(),
				isModalWin: false
			});
		} else {
			win = Ti.UI.createWindow({
				url: e.rowData.path,
				title: e.rowData.title,
				barColor: Ui.getBarColor(),
				backgroundColor: Ui.getDefaultBackground()
			});
		}
		Ti.UI.currentTab.open(win, {
			animated: true
		});
	} else if(e.rowData.email !== undefined) {
		var email = Ti.UI.createEmailDialog({
			toRecipients: [e.rowData.email],
			barColor: Ui.getBarColor()
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
