var RequestHandler = require('includes/callurl');
var Ui = require('includes/ui');
var Utils = require('includes/utils');

Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;

var dataTNT = [];
var dataFree = [];
var dataCanal = [];

var labelsTNT = ['TF1', 'France 2', 'France 3', 'Canal+', 'France 5', 'M6', 'Arte', 'D8', 'W9', 'TMC', 'NT1', 'NRJ12', 'LCP', 'France 4', 'BFM TV', 'i>TELE', 'D17', 'Gulli', 'France Ô', 'HD1', 'L\'Equipe 21', '6ter', 'Numéro 23', 'RMC Découverte', 'Chérie 25'];
var labelsFree = ['RTL9', 'Vivolta', 'AB1', 'Disney Channel', 'NRJ Hits', 'Clubbing TV', 'O Five', 'BeBlack', 'TV5 Monde', 'BFM Business', 'Euronews', 'Bloomberg', 'Al Jazeera', 'Sky News', 'Guysen TV', 'CNBC', 'MCE', 'France 24', 'Game One', 'Game One Music', 'Lucky Jack', 'Men\'s up', 'Nolife', 'Fashion TV', 'World Fashion', 'Allocine', 'Equidia Live', 'Equidia Life', 'Renault TV', 'AB Moteurs', 'Poker Channel', 'Liberty TV', 'Montagne TV', 'Luxe.TV', 'Demain TV', 'KTO', 'Wild Earth', 'TNA', 'Souvenirs from Earth', 'Penthouse', 'M6 Boutique', 'Best of Shopping', 'Astro Center', 'Radio'];
var labelsCanal = ['Canal+', 'C+ Cinéma', 'C+ Sport', 'C+ Décalé', 'C+ Family'];

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
	labels: ['TNT', 'Bouquet Free', 'Bouquet Canal'],
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
	height: (Ti.Platform.displayCaps.platformHeight < 568) ? 350 : 430
});

for(var i = 0; i < labelsTNT.length; i++) {
	dataTNT.push(getItem(labelsTNT[i]));
}

dashboardTNT.setData(dataTNT);
dashboardTNT.addEventListener('click', clickHandler);
win.add(dashboardTNT);

var dashboardFree = Ti.UI.createDashboardView({
	editable: false,
	top: 0,
	height: (Ti.Platform.displayCaps.platformHeight < 568) ? 350 : 430,
	visible: false
});

for(var i = 0; i < labelsFree.length; i++) {
	dataFree.push(getItem(labelsFree[i]));
}

dashboardFree.setData(dataFree);
dashboardFree.addEventListener('click', clickHandler);
win.add(dashboardFree);

var dashboardCanal = Ti.UI.createDashboardView({
	editable: false,
	top: 0,
	height: (Ti.Platform.displayCaps.platformHeight < 568) ? 350 : 430,
	visible: false
});

for(var i = 0; i < labelsCanal.length; i++) {
	dataCanal.push(getItem(labelsCanal[i]));
}

dashboardCanal.setData(dataCanal);
loadingWin.close();
dashboardCanal.addEventListener('click', clickHandler);
win.add(dashboardCanal);

dashboardTabs.addEventListener('click', function(e) {
	if(e.index == 1) {
		dashboardTNT.hide();
		dashboardCanal.hide();
		loadingWin.close();
		dashboardFree.show();
	}  else if(e.index === 2) {
		dashboardTNT.hide();
		dashboardFree.hide();
		loadingWin.close();
		dashboardCanal.show();
	} else if(e.index === 0) {
		dashboardFree.hide();
		dashboardCanal.hide();
		dashboardTNT.show();
	}
});

function clickHandler(e) {
	if(e.item !== null) {
		RequestHandler.callMultiKeys(e.item.channel.toString());
	}
}

function getItem(label) {
	var item = Ti.UI.createDashboardItem({
		label: label,
		canDelete: false,
		channel: Utils.getChannelID(label),
		height: 90,
		width: 70
	});

	var view = Ti.UI.createView({
		height: 90,
		width: 70
	});

	var img_icon = Ti.UI.createButton({
		image: '/img/dashboard.png',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		height: 70,
		width: 70,
		top: 0
	});

	var img_logo = Ti.UI.createImageView({
		image: '/img/logo/' + Utils.getChannelID(label) + '.png',
		defaultImage: '/img/default_epg.png',
		height: 40,
		width: 40
	});

	var lbl_channel = Ti.UI.createLabel({
		text: label,
		bottom: 0,
		color: 'white',
		width: 70,
		height: 17,
		textAlign: 'center',
		font: {
			fontSize: 13
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