//a window that opens when you click on a row of the EPG, giving you exta information on the program you chose
Ti.include('/includes/callurl.js');
Ti.include('/includes/normalize_url.js');
Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/utils.js');

var win = Ti.UI.currentWindow;
var hd, code, profile;

//the scrollview that will contain the program data
var scrollView = Ti.UI.createScrollView({
	height:295,
	top:0,
	contentHeight:'auto',
	showVerticalScrollIndicator:true
});

win.add(scrollView);

var progInfo = Ti.UI.createView({
	top:10,
	left:10,
	width:300,
	height:160,
	backgroundImage:'/img/prog_info.png'
});

scrollView.add(progInfo);

//the label for the program title
var lbl_title = Ti.UI.createLabel({
	text:win.thisTitle,
	color:'white',
	top:5,
	left:10,
	height:20,
	font: {
		fontSize:16,
		fontWeight:'bold'
	}
});

progInfo.add(lbl_title);

//a little image to improve it a bit
var img = Ti.UI.createImageView({
	image:win.thisImageUrl,
	height:100,
	width:128,
	top:40,
	left:20,
	borderColor:'white',
	borderWidth:1,
	defaultImage:'/img/default_epg.png'
});

progInfo.add(img);

if(win.thisImageUrl === undefined) {
	img.setImage('/img/default_epg.png');
}

var logo = Ti.UI.createImageView({
	image:'/img/logo/' + win.thisChannelID + '.png',
	top:25,
	right:45,
	width:60,
	height:60
});

progInfo.add(logo);

var lbl_time = Ti.UI.createLabel({
	text:win.thisTime,
	top:89,
	right:10,
	width:130,
	color:'white',
	textAlign:'center',
	font: {
		fontSize:15
	},
	height:20
});

progInfo.add(lbl_time);

var lbl_category = Ti.UI.createLabel({
	text:win.thisCategory.capitalize(),
	top:112,
	right:5,
	width:140,
	font: {
		fontSize:15
	},
	textAlign:'center',
	color:'white',
	height:Ti.UI.SIZE
});

progInfo.add(lbl_category);

var lbl_description_title = Ti.UI.createLabel({
	text:I('epg.details.description'),
	top:180,
	left:10,
	color:'white',
	height:20,
	width:300,
	font: {
		fontWeight:'bold'
	}
});

scrollView.add(lbl_description_title);

//the label that contains the program description
var lbl_description = Ti.UI.createLabel({
	text:win.thisDesc + '\n ',
	top:lbl_description_title.top + lbl_description_title.height,
	left:10,
	color:'white',
	height:Ti.UI.SIZE,
	width:300
});

scrollView.add(lbl_description);

//the button used to get more info about the program
var b_openweb = Ti.UI.createButton({
	title:I('epg.details.buttons.moreInfo'),
	height:50,
	width:90,
	bottom:10,
	left:10,
	font: {
		fontSize:15
	},
	backgroundImage:'/img/button.png',
	backgroundSelectedImage:'/img/button_selected.png'
});

b_openweb.addEventListener('click', function()
{
	//creating a window to display the info page
	var w = Ti.UI.createWindow({
		backgroundColor:'#336699',
		title:win.thisTitle,
		thisUrl:win.thisUrl,
		url:'../website.js',
		barColor:'#464646',
		isModalWin:true
	});

	w.open({
		modal:true
	});
});

win.add(b_openweb);

//the button used to watch the channel concerned
var b_watch = Ti.UI.createButton({
	title:I('epg.details.buttons.watch'),
	height:50,
	width:110,
	bottom:10,
	left:105,
	font: {
		fontSize:17
	},
	backgroundImage:'/img/button.png',
	backgroundSelectedImage:'/img/button_selected.png'
});

b_watch.addEventListener('click', function()
{
	//call the channel corresponding to the program
	callMultiKeys(win.thisChannelID.toString(), hd, code);
});

win.add(b_watch);

//the button used to open the IMDb post of the program
var b_imdb = Ti.UI.createButton({
	title:I('epg.details.buttons.imdb'),
	height:50,
	width:90,
	bottom:10,
	right:10,
	font: {
		fontSize:15
	},
	backgroundImage:'/img/button.png',
	backgroundSelectedImage:'/img/button_selected.png'
});

b_imdb.addEventListener('click', function()
{
	//open a window with its URL
	var w = Ti.UI.createWindow({
		backgroundColor:'#336699',
		title:I('labels.imdb'),
		thisUrl:'http://www.imdb.fr/find?s=all&q=' + win.thisTitle.normalizeUrl(),
		url:'../website.js',
		barColor:'#464646',
		isModalWin:true
	});

	w.open({
		modal:true
	});
});

win.addEventListener('focus', function(e)
{
	profile = Ti.App.Properties.getString('profileToUse', Profile.PROFILE_1);
	hd = Ti.App.Properties.getString('profile' + profile + '.hd', HD.HD_1);
	code = Ti.App.Properties.getString('profile' + profile + '.code', '');
});

win.add(b_imdb);

if(getMajorVersion() >= 5) {
	var twitterModule = require('de.marcelpociot.twitter');
	var b_tweet = Ti.UI.createButton({
		image:'/img/twitter.png'
	});
	
	win.setRightNavButton(b_tweet);
	
	b_tweet.addEventListener('click', function(e)
	{
		twitterModule.tweet({
			message:I('epg.tweet', win.thisTitle, win.thisChannel, Ti.App.name),
			urls:[win.thisUrl]
		});
	});
}