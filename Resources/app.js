(function() {
	var Utils = require('includes/utils');
	var Ui = require('includes/ui');
	
	Ti.include('/includes/lib/json.i18n.js');
	Ti.include('/includes/enums.js');

	var tabGroup = Ti.UI.createTabGroup({
		activeTabIconTint: '#bbbbbb',
		barColor: Ui.getBarColor()
	});

	var win_main = Ti.UI.createWindow({
		url: 'views/main.js',
		backgroundColor: Ui.getDarkBackground(),
		orientationModes: [Ti.UI.PORTRAIT]
	});

	var win_mosaic = Ti.UI.createWindow({
		url: 'views/mosaic.js',
		backgroundColor: Ui.getDarkBackground(),
		orientationModes: [Ti.UI.PORTRAIT]
	});

	var win_epg = Ti.UI.createWindow({
		url: 'views/epg.js',
		backgroundColor: Ui.getDefaultBackground(),
		orientationModes: [Ti.UI.PORTRAIT]
	});

	var win_more = Ti.UI.createWindow({
		title: I('labels.more'),
		url: 'views/more.js',
		backgroundColor: Ui.getDefaultBackground(),
		orientationModes: [Ti.UI.PORTRAIT]
	});

	//add tabs
	var tab_main = Ti.UI.createTab({
		icon: '/img/remote.png',
		title: Ti.App.name,
		window: win_main
	});

	var tab_mosaic = Ti.UI.createTab({
		icon: '/img/planet.png',
		title: I('labels.mosaic'),
		window: win_mosaic
	});

	var tab_epg = Ti.UI.createTab({
		icon: '/img/tv.png',
		title: I('labels.epg'),
		window: win_epg
	});

	var tab_more = Ti.UI.createTab({
		icon: 'img/gear.png',
		title: I('labels.more'),
		window: win_more
	});

	tabGroup.addTab(tab_main);
	tabGroup.addTab(tab_mosaic);
	tabGroup.addTab(tab_epg);
	tabGroup.addTab(tab_more);

	win_main.tabGroup = tabGroup;
	
	Ti.UI.setOrientation(Ti.UI.PORTRAIT);
	tabGroup.open();
})();
