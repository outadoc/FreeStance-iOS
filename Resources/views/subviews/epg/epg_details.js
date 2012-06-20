//a window that opens when you click on a row of the EPG, giving you exta information on the program you chose
var RequestHandler = require('includes/callurl');
var Utils = require('includes/utils');

Ti.include('/includes/normalize_url.js');
Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;

var sharekit = require("com.0x82.sharekit");

sharekit.configure({
	my_app_name: 'FreeStance',
	my_app_url: 'http://dev.outadoc.fr/',
	share_menu_alphabetical_order: false,
	shared_with_signature: false,
	sharers_plist_name: '/Sharers.plist',
	allow_offline: false,
	allow_auto_share: true,

	twitter_consumer_key: '9c5oc1VXvcn1y7WvYfzxA',
	twitter_consumer_secret: 'enh8OJVzNhb2kYB1lYHg6slht2b2yoA8ETKDajvoCA',
	twitter_callback_url: 'http://dev.outadoc.fr/',
	twitter_use_xauth: false,

	bit_ly_login: '465eacd8035bacf82ac74b8037db3b6ad797b01c',
	bit_ly_key: '7db68d159f2ca39e2c1c8f7adad6e2bcb03ad7e4',

	facebook_key: '314611201964339',

	readitlater_key: '9f3T9z22gq17bX082ed4982L35pfU4aX'
});

//the scrollview that will contain the program data
var scrollView = Ti.UI.createScrollView({
	height: 295,
	top: 0,
	contentHeight: 'auto',
	showVerticalScrollIndicator: true
});

win.add(scrollView);

var progInfo = Ti.UI.createView({
	top: 10,
	left: 10,
	width: 300,
	height: 165,
	backgroundImage: '/img/prog_info.png'
});

scrollView.add(progInfo);

//the label for the program title
var lbl_title = Ti.UI.createLabel({
	text: win.thisTitle,
	color: 'white',
	top: 5,
	left: 10,
	height: 20,
	font: {
		fontSize: 16,
		fontWeight: 'bold'
	}
});

progInfo.add(lbl_title);

//a little image to improve it a bit
var img = Ti.UI.createImageView({
	image: win.thisImageUrl,
	height: 100,
	width: 128,
	top: 40,
	left: 20,
	borderColor: '#404040',
	borderWidth: 2,
	backgroundColor: 'darkGray',
	borderRadius: 5,
	defaultImage: '/img/default_epg.png'
});

progInfo.add(img);

if(win.thisImageUrl === undefined) {
	var lbl_noImg = Ti.UI.createLabel({
		text: I('epg.details.noPreview'),
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		color: 'white',
		textAlign: 'center',
		font: {
			fontFamily: 'Helvetica-Oblique'
		}
	});

	img.add(lbl_noImg);
}

var logo = Ti.UI.createImageView({
	image: '/img/logo/' + win.thisChannelID + '.png',
	top: 30,
	right: 45,
	width: 60,
	height: 60
});

progInfo.add(logo);

var lbl_time = Ti.UI.createLabel({
	text: win.thisTime,
	top: 94,
	right: 10,
	width: 130,
	color: 'white',
	textAlign: 'center',
	font: {
		fontSize: 15
	},
	height: 20
});

progInfo.add(lbl_time);

var lbl_category = Ti.UI.createLabel({
	text: Utils.capitalize(win.thisCategory),
	top: 117,
	right: 5,
	width: 140,
	font: {
		fontSize: 15
	},
	textAlign: 'center',
	color: 'white',
	height: Ti.UI.SIZE
});

progInfo.add(lbl_category);

var lbl_description_title = Ti.UI.createLabel({
	text: I('epg.details.description'),
	top: 185,
	left: 10,
	color: 'white',
	height: 20,
	width: 300,
	font: {
		fontWeight: 'bold'
	}
});

scrollView.add(lbl_description_title);

//the label that contains the program description
var lbl_description = Ti.UI.createLabel({
	text: win.thisDesc + '\n ',
	top: lbl_description_title.top + lbl_description_title.height,
	left: 10,
	color: 'white',
	height: Ti.UI.SIZE,
	width: 300
});

scrollView.add(lbl_description);

//the button used to get more info about the program
var b_openweb = Ti.UI.createButton({
	title: I('epg.details.buttons.moreInfo'),
	height: 50,
	width: 90,
	bottom: 10,
	left: 10,
	font: {
		fontSize: 15
	},
	backgroundImage: '/img/button.png',
	backgroundSelectedImage: '/img/button_selected.png'
});

b_openweb.addEventListener('click', function() {
	//creating a window to display the info page
	var w = Ti.UI.createWindow({
		backgroundColor: 'white',
		title: win.thisTitle,
		thisUrl: win.thisUrl,
		url: '../website.js',
		barColor: '#464646',
		isModalWin: false
	});

	Ti.UI.currentTab.open(w, {
		animated: true
	});
});

win.add(b_openweb);

//the button used to watch the channel concerned
var b_watch = Ti.UI.createButton({
	title: I('epg.details.buttons.watch'),
	height: 50,
	width: 110,
	bottom: 10,
	left: 105,
	font: {
		fontSize: 17
	},
	backgroundImage: '/img/button.png',
	backgroundSelectedImage: '/img/button_selected.png'
});

b_watch.addEventListener('click', function() {
	//call the channel corresponding to the program
	RequestHandler.callMultiKeys(win.thisChannelID.toString());
});

win.add(b_watch);

//the button used to open the IMDb post of the program
var b_imdb = Ti.UI.createButton({
	title: I('epg.details.buttons.imdb'),
	height: 50,
	width: 90,
	bottom: 10,
	right: 10,
	font: {
		fontSize: 15
	},
	backgroundImage: '/img/button.png',
	backgroundSelectedImage: '/img/button_selected.png'
});

b_imdb.addEventListener('click', function() {
	//open a window with its URL
	var w = Ti.UI.createWindow({
		backgroundColor: 'white',
		title: I('labels.imdb'),
		thisUrl: 'http://www.imdb.fr/find?s=all&q=' + win.thisTitle.normalizeUrl(),
		url: '../website.js',
		barColor: '#464646',
		isModalWin: false
	});

	Ti.UI.currentTab.open(w, {
		animated: true
	});
});

win.addEventListener('focus', function(e) {
	RequestHandler.setProfile(Ti.App.Properties.getInt('profileToUse', Profile.PROFILE_1));
	RequestHandler.setHd(Ti.App.Properties.getInt('profile' + RequestHandler.getProfile() + '.hd', HD.HD_1));
	RequestHandler.setCode(Ti.App.Properties.getString('profile' + RequestHandler.getProfile() + '.code', ''));
});

win.add(b_imdb);

var b_share = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ACTION
});

win.setRightNavButton(b_share);

b_share.addEventListener('click', function(e) {
	sharekit.share({
		title: I('epg.tweet', win.thisTitle, win.thisChannel, Ti.App.name),
		view: win,
		link: win.thisUrl
	});
});