Ti.include('/includes/lib/json.i18n.js');

var RequestHandler = require('includes/callurl'),
	Ui = require('includes/ui'),
	Utils = require('includes/utils'),
	
//we're loading things
loadingWin = Ui.createLoadingWindow();
loadingWin.open();

var win = Ti.UI.currentWindow,

labelsTNT = ['TF1', 'France 2', 'France 3', 'Canal+', 'France 5', 'M6', 'Arte', 'D8', 'W9', 'TMC', 'NT1', 'NRJ12', 'LCP', 'France 4', 'BFM TV', 'i>TELE', 'D17', 'Gulli', 'France Ô', 'HD1', 'L\'Equipe 21', '6ter', 'Numéro 23', 'RMC Découverte', 'Chérie 25'],
labelsFree = ['RTL9', 'Vivolta', 'AB1', 'Disney Channel', 'NRJ Hits', 'Clubbing TV', 'O Five', 'BeBlack', 'TV5 Monde', 'BFM Business', 'Euronews', 'Bloomberg', 'Al Jazeera', 'Sky News', 'Guysen TV', 'CNBC', 'MCE', 'France 24', 'Game One', 'Game One Music', 'Lucky Jack', 'Men\'s up', 'Nolife', 'Fashion TV', 'World Fashion', 'Allocine', 'Equidia Live', 'Equidia Life', 'AB Moteurs', 'Poker Channel', 'Liberty TV', 'Montagne TV', 'Luxe.TV', 'Demain TV', 'KTO', 'Wild Earth', 'TNA', 'Souvenirs from Earth', 'Penthouse', 'M6 Boutique', 'Best of Shopping', 'Renault TV', 'Astro Center', 'Radio'],
labelsCanal = ['Canal+', 'C+ Cinéma', 'C+ Sport', 'C+ Décalé', 'C+ Family'],

tabbedBar = Ti.UI.iOS.createTabbedBar({
	labels: [I('profile.1'), I('profile.2'), I('profile.3')],
	style: Ti.UI.iPhone.SystemButtonStyle.BAR,
	height: 30,
	width: 300,
	backgroundColor: Ui.getBarColor()
}),

dashboardTabs = Ti.UI.iOS.createTabbedBar({
	labels: ['TNT', 'Bouquet Free', 'Bouquet Canal'],
	style: Ti.UI.iPhone.SystemButtonStyle.BAR,
	height: 30,
	width: 300,
	backgroundColor: Ui.getBarColor(),
	index: 0
}), i,

//get all three dashboards, one is visible, the others are not
dashboards = [getDashboard(labelsTNT, true), getDashboard(labelsFree, false), getDashboard(labelsCanal, false)];

win.addEventListener('focus', updateProps);
Ti.App.addEventListener('changeProfile', updateProps);

tabbedBar.addEventListener('click', function(e) {
	Ti.App.Properties.setInt('profileToUse', e.index + 1);
	updateProps();
});

if(Utils.isiPad()) {
	win.setTitleControl(dashboardTabs);
} else {
	win.setToolbar([Ui.createFlexibleSpace(), dashboardTabs, Ui.createFlexibleSpace()], {
		animated: false
	});
	
	win.setTitleControl(tabbedBar);
}

//add all of them to the window
for(i = 0; i < dashboards.length; i++) {
	win.add(dashboards[i]);
}

//stop loading
loadingWin.close();

//if we want to switch to another dashboard
dashboardTabs.addEventListener('click', function(e) {
	//if we actually clicked on a button
	if(e.index != null) {
		for(i = 0; i < dashboards.length; i++) {
			if(i != e.index) {
				//hide all the ones we don't want to display
				dashboards[i].hide();
			}
		}
		
		//set the opacity of the one we want to display to 0, and then fade in
		dashboards[e.index].setOpacity(0);
		dashboards[e.index].show();
		dashboards[e.index].animate({
			opacity: 1,
			duration: 400,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
		});
	}
});

//get a single dashboarditem
function getItem(label) {
	var img_icon = Ti.UI.createButton({
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		backgroundGradient: {
			type: 'linear',
			colors: [{
				color: '#f0f0f0',
				offset: 0
			}, {
				color: '#d3d3d3',
				offset: 0.5
			}, {
				color: '#c1c1c1',
				offset: 0.5
			}, {
				color: '#9a9a9a',
				offset: 1
			}]
		},
		borderRadius: 42.5,
		height: 85,
		width: 85
	}),

	img_logo = Ti.UI.createImageView({
		image: '/img/logo/' + Utils.getChannelID(label) + '.png',
		defaultImage: '/img/default_epg.png',
		height: Ti.UI.SIZE,
		width: 55
	});

	img_icon.add(img_logo);
	
	var item = Ti.UI.createDashboardItem({
		canDelete: false,
		image: img_icon.toImage(null, true),
		channel: Utils.getChannelID(label),
		height: 90,
		width: 90
	});

	return item;
}

//get a single dashboard with an array of labels to display as items
function getDashboard(labels, visible) {
	var dashboard = Ti.UI.createDashboardView({
		editable: false,
		top: 5,
		visible: visible
	}),

	data = [], i;
	
	if(Utils.isiPad()) {
		dashboard.rowCount = 5;
		dashboard.columnCount = 4;
		dashboard.top = 15;
		dashboard.height = Ti.UI.FILL;
	} else if(Ti.Platform.displayCaps.platformHeight < 568) {
		dashboard.rowCount = 3;
		dashboard.height = 350;
	} else {
		dashboard.rowCount = 4;
		dashboard.height = 430;
	}

	//iterate through the labels and add corresponding items to the dashboard
	for(i = 0; i < labels.length; i++) {
		data.push(getItem(labels[i]));
	}

	dashboard.setData(data);
	
	//when we click, this should happen
	dashboard.addEventListener('click', function(e) {
		if(e.item !== null) {
			RequestHandler.callMultiKeys(e.item.channel.toString());
		}
	});

	return dashboard;
}

//get properties
function updateProps() {
	RequestHandler.setProfile(Ti.App.Properties.getInt('profileToUse', Profile.PROFILE_1));
	RequestHandler.setHd(Ti.App.Properties.getInt('profile' + RequestHandler.getProfile() + '.hd', HD.HD_1));
	RequestHandler.setCode(Ti.App.Properties.getString('profile' + RequestHandler.getProfile() + '.code', ''));

	tabbedBar.setIndex(RequestHandler.getProfile() - 1);
}