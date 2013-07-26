//a window that opens when you click on a row of the EPG, giving you extra information on the program you chose
Ti.include('/includes/normalize_url.js');
Ti.include('/includes/lib/json.i18n.js');

var RequestHandler = require('includes/callurl'),
	Utils = require('includes/utils'),
	Ui = require('includes/ui'),
	sharekit = require("com.0x82.sharekit"),

win = Ti.UI.currentWindow,

//the label for the program title
lbl_title = Ti.UI.createLabel({
	text: win.data.title,
	color: '#505050',
	top: 10,
	left: 10,
	right: 10,
	font: {
		fontSize: 16,
		fontWeight: 'bold'
	}
}),

progInfo = Ti.UI.createView({
	top: 10,
	left: 10,
	right: 10,
	height: 70,
	backgroundColor: '#909090',
	borderColor: '#808080',
	borderRadius: 4,
}),

//a little image to improve it a bit
img = Ti.UI.createImageView({
	image: '/img/logo/' + win.data.channelID + '.png',
	height: Ti.UI.FILL,
	width: Ti.UI.FIT,
	top: 10,
	bottom: 10,
	left: 15,
	defaultImage: '/img/default_epg.png'
}),

lbl_time_title = Ti.UI.createLabel({
	text: 'Heure :',
	top: 12,
	left: 115,
	width: Ti.UI.SIZE,
	color: 'white',
	font: {
		fontSize: 15,
		fontWeight: 'bold'
	},
	height: 20
}),

lbl_time = Ti.UI.createLabel({
	text: win.data.startTime.replace(':', 'h'),
	top: 12,
	right: 10,
	width: Ti.UI.SIZE,
	color: 'white',
	textAlign: 'right',
	font: {
		fontSize: 16
	},
	height: 20
}),

lbl_category_title = Ti.UI.createLabel({
	text: 'Catégorie :',
	top: 35,
	left: 115,
	width: Ti.UI.SIZE,
	color: 'white',
	font: {
		fontSize: 15,
		fontWeight: 'bold'
	},
	height: 20
}),

lbl_category = Ti.UI.createLabel({
	text: win.data.category,
	top: 35,
	right: 10,
	width: 95,
	height: 20,
	font: {
		fontSize: 15
	},
	textAlign: 'right',
	color: 'white'
}),

//the scrollview that will contain the program description
scrollView = Ti.UI.createScrollView({
	height: (Ti.Platform.displayCaps.platformHeight >= 568) ? 250 : 190,
	top: 10,
	contentHeight: 'auto',
	showVerticalScrollIndicator: true,
	layout: 'vertical',
	verticalBounce: true
}),

lbl_description_title = Ti.UI.createLabel({
	text: I('epg.details.description'),
	top: 5,
	left: 10,
	color: '#505050',
	font: {
		fontWeight: 'bold'
	}
}),

//the label that contains the program description
lbl_description = Ti.UI.createLabel({
	text: win.data.description + '\n ',
	top: 10,
	left: 10,
	right: 10,
	color: '#505050',
	height: Ti.UI.SIZE
}),

view_btn_container = Ti.UI.createView({
	bottom: 10,
	height: 70,
	left: 10,
	right: 10
}),

//the button used to get more info about the program
b_openweb = Ti.UI.createButton({
	title: I('epg.details.buttons.moreInfo'),
	height: Ti.UI.FILL,
	width: '30%',
	left: 0,
	font: {
		fontSize: 15
	},
	backgroundColor: '#a5a5a5',
	borderColor: '#9b9b9b',
	selectedColor: '#3f3f3f',
	borderRadius: 3,
	style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
}),

//the button used to watch the channel concerned
b_watch = Ti.UI.createButton({
	title: I('epg.details.buttons.watch'),
	height: Ti.UI.FILL,
	width: '35%',
	font: {
		fontSize: 17,
		fontWeight: 'bold'
	},
	backgroundColor: '#a5a5a5',
	borderColor: '#9b9b9b',
	selectedColor: '#3f3f3f',
	borderRadius: 3,
	style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
}),

//the button used to open the IMDb post of the program
b_imdb = Ti.UI.createButton({
	title: I('epg.details.buttons.imdb'),
	height: Ti.UI.FILL,
	width: '30%',
	right: 0,
	font: {
		fontSize: 15
	},
	backgroundColor: '#a5a5a5',
	borderColor: '#9b9b9b',
	selectedColor: '#3f3f3f',
	borderRadius: 3,
	style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
}),

//share button
b_share = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ACTION
});

win.add(lbl_title);
win.add(progInfo);

progInfo.add(img);
progInfo.add(lbl_time_title);
progInfo.add(lbl_time);
progInfo.add(lbl_category_title);
progInfo.add(lbl_category);

scrollView.add(lbl_description_title);
scrollView.add(lbl_description);

win.add(scrollView);

view_btn_container.add(b_openweb);
view_btn_container.add(b_watch);
view_btn_container.add(b_imdb);

win.add(view_btn_container);

win.setRightNavButton(b_share);

b_openweb.addEventListener('click', function() {
	//creating a window to display the info page
	var w = Ti.UI.createWindow({
		backgroundColor: 'white',
		title: win.data.title,
		thisUrl: win.data.url,
		url: '../website.js',
		isModalWin: false
	});

	Ti.UI.currentTab.open(w, {
		animated: true
	});
});

b_watch.addEventListener('click', function() {
	//call the channel corresponding to the program
	RequestHandler.callMultiKeys(win.data.channelID.toString());
});

b_imdb.addEventListener('click', function() {
	//open a window with its URL
	var w = Ti.UI.createWindow({
		backgroundColor: 'white',
		title: I('labels.imdb'),
		thisUrl: 'http://www.imdb.fr/find?s=all&q=' + win.data.title.normalizeUrl(),
		url: '../website.js',
		isModalWin: false
	});

	Ti.UI.currentTab.open(w, {
		animated: true
	});
});

win.addEventListener('focus', updateProps);
Ti.App.addEventListener('changeProfile', updateProps);

sharekit.configure({
	my_app_name: 'FreeStance',
	my_app_url: 'http://dev.outadoc.fr/project/freestance/',
	share_menu_alphabetical_order: false,
	shared_with_signature: false,
	sharers_plist_name: '/Sharers.plist',
	allow_offline: false,
	allow_auto_share: true,

	twitter_consumer_key: '9c5oc1VXvcn1y7WvYfzxA',
	twitter_consumer_secret: 'enh8OJVzNhb2kYB1lYHg6slht2b2yoA8ETKDajvoCA',
	twitter_callback_url: 'http://dev.outadoc.fr/project/freestance/',
	twitter_use_xauth: false,

	bit_ly_login: '465eacd8035bacf82ac74b8037db3b6ad797b01c',
	bit_ly_key: '7db68d159f2ca39e2c1c8f7adad6e2bcb03ad7e4',

	facebook_key: '314611201964339',

	readitlater_key: '9f3T9z22gq17bX082ed4982L35pfU4aX'
});

b_share.addEventListener('click', function(e) {
	sharekit.share({
		title: I('epg.tweet', win.data.title, win.data.channelString, Ti.App.name),
		view: win,
		link: win.data.url
	});
});

function updateProps() {
	RequestHandler.setProfile(Ti.App.Properties.getInt('profileToUse', Profile.PROFILE_1));
	RequestHandler.setHd(Ti.App.Properties.getInt('profile' + RequestHandler.getProfile() + '.hd', HD.HD_1));
	RequestHandler.setCode(Ti.App.Properties.getString('profile' + RequestHandler.getProfile() + '.code', ''));
}