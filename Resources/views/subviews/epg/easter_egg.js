Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/enums.js');

var win = Titanium.UI.currentWindow;

if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
	var alert = Ti.UI.createAlertDialog({
		title: I('network.message.title'),
		message: 'One does not simply watch an easter egg without any connection.' + ' (E' + Error.NETWORK + ')',
		buttonNames: [I('network.buttons.ok')]
	});

	alert.show();
	alert.addEventListener('click', function(e) {
		win.close();
	});
} else {
	var movie = Titanium.Media.createVideoPlayer({
		url: 'http://apps.outadoc.fr/freestance/anonymous.mp4',
		backgroundColor: '#111',
		scalingMode: Titanium.Media.VIDEO_SCALING_ASPECT_FIT
	});

	var b_close = Ti.UI.createButton({
		title: I('buttons.close'),
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});

	function stopAndClose() {
		if(movie != null) {
			movie.stop();
		}
		win.close();
	}


	b_close.addEventListener('click', stopAndClose);
	movie.addEventListener('complete', stopAndClose);

	win.setLeftNavButton(b_close);
	win.add(movie);
	movie.play();
}