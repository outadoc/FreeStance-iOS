Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow,
	Ui = require('/includes/ui'),
	RequestHandler = require('/includes/callurl'),

tabbedBar = Ti.UI.iOS.createTabbedBar({
	labels: [I('profile.1'), I('profile.2'), I('profile.3')],
	style: Ti.UI.iPhone.SystemButtonStyle.BAR,
	height: 30,
	width: 300,
	backgroundColor: Ui.getBarColor()
}),

view_trackpad = Ti.UI.createView({
	backgroundImage: getBackground(),
	top: 10,
	left: 10,
	right: 10,
	bottom: 10,
	layout: 'vertical',
	zIndex: 5
}),

view_trackpad_prgm = Ti.UI.createView({
	top: 0,
	height: '15%',
	width: Ti.UI.FILL,
	opacity: 0.4,
	borderColor: 'gray',
	borderRadius: 5
}),

view_trackpad_main = Ti.UI.createView({
	height: '70%',
	width: Ti.UI.FILL,
	opacity: 0.3
}),

view_trackpad_vol = Ti.UI.createView({
	bottom: 0,
	height: '15%',
	width: Ti.UI.FILL,
	opacity: 0.4,
	borderColor: 'gray',
	borderRadius: 5
});

win.addEventListener('focus', updateProps);
Ti.App.addEventListener('changeProfile', updateProps);

tabbedBar.addEventListener('click', function(e) {
	Ti.App.Properties.setInt('profileToUse', e.index + 1);
	updateProps();
});

win.setTitleControl(tabbedBar);

view_trackpad.add(view_trackpad_prgm);
view_trackpad.add(view_trackpad_main);
view_trackpad.add(view_trackpad_vol);

view_trackpad_main.addEventListener('swipe', function(e) {
	if(e.direction == 'up' || e.direction == 'down' || e.direction == 'left' || e.direction == 'right') {
		RequestHandler.callKey(e.direction, false);
	}
});

view_trackpad_main.addEventListener('click', function(e) {
	RequestHandler.callKey('ok', false);
});

view_trackpad_prgm.addEventListener('swipe', function(e) {
	if(e.direction == 'right') {
		RequestHandler.callKey('prgm_inc', false);
	} else if(e.direction == 'left') {
		RequestHandler.callKey('prgm_dec', false);
	}
});

view_trackpad_vol.addEventListener('swipe', function(e) {
	if(e.direction == 'right') {
		RequestHandler.callKey('vol_inc', false);
	} else if(e.direction == 'left') {
		RequestHandler.callKey('vol_dec', false);
	}
});

win.add(view_trackpad);

function getBackground() {
	if(Ti.Platform.displayCaps.platformHeight < 568) {
		return '/img/trackpad.png';
	} else {
		return '/img/trackpad-tall.png';
	}
}

//get properties
function updateProps() {
	RequestHandler.setProfile(Ti.App.Properties.getInt('profileToUse', Profile.PROFILE_1));
	RequestHandler.setHd(Ti.App.Properties.getInt('profile' + RequestHandler.getProfile() + '.hd', HD.HD_1));
	RequestHandler.setCode(Ti.App.Properties.getString('profile' + RequestHandler.getProfile() + '.code', ''));

	tabbedBar.setIndex(RequestHandler.getProfile() - 1);
}