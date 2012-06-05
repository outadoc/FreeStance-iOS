//page containing a simple webview that is used to show the program dedicated page
Ti.include('/includes/ui.js');
Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;

var webView = Ti.UI.createWebView({
	url: win.thisUrl
});

if(win.isModalWin) {
	var b_close = Ti.UI.createButton({
		title: I('buttons.close'),
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});

	b_close.addEventListener('click', function() {
		win.close();
	});

	win.setLeftNavButton(b_close);
}

var b_prev = Ti.UI.createButton({
	image: '/img/arrow_left.png'
});

var b_fwd = Ti.UI.createButton({
	image: '/img/arrow_right.png'
});

var b_cancel = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.STOP
});

var b_refresh = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.REFRESH
});

var loading_wheel = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ACTIVITY
});

b_prev.addEventListener('click', function() {
	webView.goBack();
});

b_fwd.addEventListener('click', function() {
	webView.goForward();
});

b_refresh.addEventListener('click', function() {
	webView.reload();
});

b_cancel.addEventListener('click', function() {
	webView.stopLoading();
});

//add the elements to the window toolbar
win.setToolbar([b_prev, getFixedSpace(25), b_fwd, getFlexibleSpace(), b_refresh]);

webView.addEventListener('beforeload', function() {
	//set the back/forward buttons correct behavior
	if(webView.canGoBack()) {
		b_prev.enabled = true;
	} else {
		b_prev.enabled = false;
	}
	if(webView.canGoForward()) {
		b_fwd.enabled = true;
	} else {
		b_fwd.enabled = false;
	}

	win.setRightNavButton(loading_wheel);
	win.setToolbar([b_prev, getFixedSpace(25), b_fwd, getFlexibleSpace(), b_cancel]);
});

function stoppedLoading() {
	win.setRightNavButton();
	win.setToolbar([b_prev, getFixedSpace(25), b_fwd, getFlexibleSpace(), b_refresh]);
}

webView.addEventListener('load', stoppedLoading);
webView.addEventListener('error', function(e) {
	stoppedLoading();
	var errorDialog = Ti.UI.createAlertDialog({
		title: I('more.webview.error.title'),
		message: I('more.webview.error.message', webView.getUrl(), e.message.split('"')[1]),
		buttons: ['Ok']
	});
	errorDialog.show();
});

win.add(webView); 