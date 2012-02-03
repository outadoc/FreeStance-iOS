Ti.include('../includes/lib/json.i18n.js');

var win = Titanium.UI.currentWindow;

var movie = Titanium.Media.createVideoPlayer({
	contentURL:'http://dev.outadoc.fr/freestance/rickroll.mov',
	backgroundColor:'#111',
	movieControlMode:Titanium.Media.VIDEO_CONTROL_DEFAULT,
	scalingMode:Titanium.Media.VIDEO_SCALING_MODE_FILL
});

var b_close = Ti.UI.createButton({
	title:I('buttons.close'),
	style:Ti.UI.iPhone.SystemButtonStyle.PLAIN
});

b_close.addEventListener('click',function()
{
	movie.stop();
	win.close();
});

win.setLeftNavButton(b_close);
win.add(movie)
movie.play();