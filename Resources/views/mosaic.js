var RequestHandler = require('includes/callurl');
var Ui = require('includes/ui');
var Utils = require('includes/utils');

Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;

var dataTNT = [];
var dataFree = [];

var labelsTNT = ['TF1', 'France 2', 'France 3', 'Canal+', 'France 5', 'M6', 'Arte', 'Direct 8', 'W9', 'TMC', 'NT1', 'NRJ12', 'LCP', 'France 4', 'BFM TV', 'i>TELE', 'Direct Star', 'Gulli'];
var labelsFree = ['RTL9', 'AB1', 'Disney Channel', 'TV5 Monde', 'Vivolta', 'NRJ Hits', 'Clubbing TV', 'BeBlack', 'O Five', 'BFM Business', 'Euronews', 'Bloomberg', 'Al Jazeera', 'Sky News', 'Guysen TV', 'CNBC', 'MCE', 'France 24', 'Game One', 'Game One Music', 'Lucky Jack', 'Men\'s up', 'Nolife', 'Fashion TV', 'World Fashion', 'Allocine', 'Equidia Live', 'Equidia Life', 'Renault TV', 'AB Moteurs', 'Poker Channel', 'France Ô', 'Liberty TV', 'Montagne TV', 'Luxe.TV', 'Demain TV', 'KTO', 'Wild Earth', 'TNA', 'Souvenirs from Earth', 'Penthouse', 'M6 Boutique', 'Best of Shopping', 'Astro Center', 'Radio'];

var loadingWin = Ui.createLoadingWindow();

win.addEventListener('focus', updateProps);

var tabbedBar = Ti.UI.iOS.createTabbedBar({
	labels: [I('profile.1'), I('profile.2'), I('profile.3')],
	style: Ti.UI.iPhone.SystemButtonStyle.BAR,
	bottom: 7,
	height: '30',
	width: '300',
	backgroundColor: '#787878'
});

tabbedBar.addEventListener('click', function(e) {
	Ti.App.Properties.setInt('profileToUse', e.index + 1);
	updateProps();
});

win.setToolbar([Ui.createFlexibleSpace(), tabbedBar, Ui.createFlexibleSpace()], {
	animated: false
});

var dashboardTabs = Ti.UI.iOS.createTabbedBar({
	labels: ['TNT', 'Bouquet Free'],
	style: Ti.UI.iPhone.SystemButtonStyle.BAR,
	bottom: 7,
	height: '30',
	width: '300',
	backgroundColor: '#787878',
	index: 0
});

win.setTitleControl(dashboardTabs);
loadingWin.open();

var dashboardTNT = Ti.UI.createDashboardView({
	editable: false,
	top: 0,
	height: 350
});

dashboardTNT.addEventListener('click', function(e) {
	if(e.item !== null) {
		RequestHandler.callMultiKeys(e.item.channel.toString());
	}
});

for(var i = 0; i < labelsTNT.length; i++) {
	dataTNT.push(getItem(labelsTNT[i]));
}

dashboardTNT.setData(dataTNT);
win.add(dashboardTNT);

var dashboardFree = Ti.UI.createDashboardView({
	editable: false,
	top: 0,
	height: 350,
	visible: false
});

for(var i = 0; i < labelsFree.length; i++) {
	dataFree.push(getItem(labelsFree[i]));
}

dashboardFree.setData(dataFree);
loadingWin.close();

dashboardFree.addEventListener('click', function(e) {
	if(e.item !== null) {
		RequestHandler.callMultiKeys(e.item.channel.toString());
	}
});

win.add(dashboardFree);

dashboardTabs.addEventListener('click', function(e) {
	if(e.index == 1) {
		dashboardTNT.hide();
		loadingWin.close();
		dashboardFree.show();
	} else if(e.index === 0) {
		dashboardFree.hide();
		dashboardTNT.show();
	}
});

function getItem(label) {
	var item = Ti.UI.createDashboardItem({
		label: label,
		canDelete: false,
		channel: Utils.getChannelID(label),
		height: 85,
		width: 70
	});

	var view = Ti.UI.createView({
		height: 85,
		width: 70
	});

	var img_icon = Ti.UI.createButton({
		image: '/img/dashboard.png',
		height: 65,
		width: 65,
		top: 0
	});

	var img_logo = Ti.UI.createImageView({
		image: '/img/logo/' + Utils.getChannelID(label) + '.png',
		height: 50,
		width: 50
	});

	var lbl_channel = Ti.UI.createLabel({
		text: label,
		bottom: 0,
		color: 'white',
		width: 70,
		height: 17,
		textAlign: 'center',
		font: {
			fontSize: 14
		},
		shadowColor: '#505050 ',
		shadowOffset: {
			x: 1,
			y: 2
		}
	});

	img_icon.add(img_logo);
	view.add(img_icon);
	view.add(lbl_channel);
	item.add(view);

	return item;
}

function updateProps() {
	RequestHandler.setProfile(Ti.App.Properties.getInt('profileToUse', Profile.PROFILE_1));
	RequestHandler.setHd(Ti.App.Properties.getInt('profile' + RequestHandler.getProfile() + '.hd', HD.HD_1));
	RequestHandler.setCode(Ti.App.Properties.getString('profile' + RequestHandler.getProfile() + '.code', ''));

	tabbedBar.setIndex(RequestHandler.getProfile() - 1);
}