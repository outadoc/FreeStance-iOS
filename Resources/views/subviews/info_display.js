//displays the help corresponding to the chosen subject(s)
Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/enums.js');

var win = Ti.UI.currentWindow,

//we're displaying the webview inside a tableview row, the rendering is a lot better
row_content = Ti.UI.createTableViewRow({
	selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
}),

tableView = Ti.UI.createTableView({
	data: [row_content],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white'
}),

webView = Ti.UI.createWebView({
	backgroundColor: 'transparent'
}),

//so much better in Helvetica <3
css = '<style>body{font-family:Helvetica;font-size:15px;}</style>';

row_content.add(webView);
win.add(tableView);


//depending on the requested help, we display the corresponding information
if(win.helpTo == 'config') {
	row_content.setHeight(I('more.help.content.config.height'));
	webView.setHtml(css + I('more.help.content.config.content', Ti.App.name, Ti.App.name));
} else if(win.model == Model.FREEBOX_HD) {
	if(win.helpTo == 'code') {
		row_content.setHeight(I('more.help.content.fbxHD.code.height'));
		webView.setHtml(css + I('more.help.content.fbxHD.code.content'));
	} else if(win.helpTo == 'hd') {
		row_content.setHeight(I('more.help.content.fbxHD.hd.height'));
		webView.setHtml(css + I('more.help.content.fbxHD.hd.content'));
	}
} else if(win.model == Model.FREEBOX_REVOLUTION) {
	if(win.helpTo == 'code') {
		row_content.setHeight(I('more.help.content.fbxRev.code.height'));
		webView.setHtml(css + I('more.help.content.fbxRev.code.content'));
	} else if(win.helpTo == 'hd') {
		row_content.setHeight(I('more.help.content.fbxRev.hd.height'));
		webView.setHtml(css + I('more.help.content.fbxRev.hd.content'));
	}
}
