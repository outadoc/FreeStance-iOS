//displays the help corresponding to the chosen subject(s)
Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/enums.js');

var win = Ti.UI.currentWindow,
	html = '<!DOCTYPE html><html><head><style type="text/css">body{margin: 0; background-color: ' + win.backgroundColor + ';} #content{margin: 25px 0 25px 0; padding: 15px; font-family: Helvetica; font-size: 15px; background-color: white;}</style></head><body><div id="content">';


//depending on the requested help, we display the corresponding information
if(win.helpTo == 'config') {
	html += I('more.help.content.config.content', Ti.App.name, Ti.App.name);
} else if(win.model == Model.FREEBOX_HD) {
	if(win.helpTo == 'code') {
		html += I('more.help.content.fbxHD.code.content');
	} else if(win.helpTo == 'hd') {
		html += I('more.help.content.fbxHD.hd.content');
	}
} else if(win.model == Model.FREEBOX_REVOLUTION) {
	if(win.helpTo == 'code') {
		html += I('more.help.content.fbxRev.code.content');
	} else if(win.helpTo == 'hd') {
		html += I('more.help.content.fbxRev.hd.content');
	}
}

html += "</div></body></html>";

webView = Ti.UI.createWebView({
	top: 0,
	bottom: 0,
	html: html,
	backgroundColor: win.backgroundColor
});

win.add(webView);