//displays the help corresponding to the chosen subject(s)
Ti.include('../includes/lib/json.i18n.js');
Ti.include('../includes/enums.js');

var win = Ti.UI.currentWindow;;

var webView = Ti.UI.createWebView({
	backgroundColor:'transparent',
	touchEnabled:false
});

//we're displaying the webview inside a tableview row, the rendering is a lot
// better
var tableViewRow = Ti.UI.createTableViewRow({
	selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
});

var tableView = Ti.UI.createTableView({
	data:data,
	style:Ti.UI.iPhone.TableViewStyle.GROUPED
});

//so much better in Helvetica <3
var css = '<style>body{font-family:Helvetica;font-size:15;}</style>';

//depending on the requested help, we display the corresponding information
if(win.helpTo == 'config') {
	tableView.minRowHeight = I('more.help.content.config.height');
	webView.html = css + I('more.help.content.config.content', Ti.App.name, Ti.App.name);
}

else if(win.helpTo == 'legal') {
	tableView.minRowHeight = I('more.legal.height');
	webView.html = css + I('more.legal.content', Ti.App.name, Ti.App.name) + '<div style="text-align:center"><img height="53" width="150" src="../../img/outadev.png" alt="outa[dev]" /></div>';
}

else if(win.model == Model.FREEBOX_HD) {
	if(win.helpTo == 'code') {
		tableView.minRowHeight = I('more.help.content.fbxHD.code.height');
		webView.html = css + I('more.help.content.fbxHD.code.content');
	}
	else if(win.helpTo == 'hd') {
		tableView.minRowHeight = I('more.help.content.fbxHD.hd.height');
		webView.html = css + I('more.help.content.fbxHD.hd.content');
	}
}

else if(win.model == Model.FREEBOX_REVOLUTION) {
	if(win.helpTo == 'code') {
		tableView.minRowHeight = I('more.help.content.fbxRev.code.height');
		webView.html = css + I('more.help.content.fbxRev.code.content');
	}
	else if(win.helpTo == 'hd') {
		tableView.minRowHeight = I('more.help.content.fbxRev.hd.height');
		webView.html = css + I('more.help.content.fbxRev.hd.content');
	}
}

tableViewRow.add(webView);
var data = [tableViewRow];
tableView.data = data;

win.add(tableView);
