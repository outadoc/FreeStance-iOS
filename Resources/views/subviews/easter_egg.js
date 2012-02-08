Ti.include('../includes/lib/json.i18n.js');

var win = Titanium.UI.currentWindow;

var movie = Titanium.Media.createVideoPlayer({
	url:'http://dev.outadoc.fr/freestance/anonymous.mp4',
	backgroundColor:'#111',
	scalingMode:Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
	fullscreen:true
});

var b_close = Ti.UI.createButton({
	title:I('buttons.close'),
	style:Ti.UI.iPhone.SystemButtonStyle.PLAIN
});

function stopAndClose() {
	if(movie != null)
		movie.stop();
	win.close();
}

b_close.addEventListener('click', stopAndClose);
movie.addEventListener('complete', stopAndClose);
movie.addEventListener('fullscreen', function(e) {
	if(!e.entering)
		stopAndClose();
});

win.setLeftNavButton(b_close);
win.add(movie)
movie.play();