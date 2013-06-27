(function() {
	var Utils = require('includes/utils');
	var Ui = require('includes/ui');
	
	Ti.include('/includes/lib/json.i18n.js');
	Ti.include('/includes/enums.js');

	var tabGroup = Ti.UI.createTabGroup();

	var win1 = Ti.UI.createWindow({
		url: 'views/main.js',
		backgroundColor: '#f5f5f5',
		navBarHidden: true,
		orientationModes: [Ti.UI.PORTRAIT],
		barColor: '#464646'
	});

	var win2 = Ti.UI.createWindow({
		url: 'views/mosaic.js',
		barColor: '#464646',
		backgroundColor: '#323232',
		orientationModes: [Ti.UI.PORTRAIT]
	});

	var win3 = Ti.UI.createWindow({
		url: 'views/epg.js',
		backgroundColor: '#fff',
		barColor: '#464646',
		orientationModes: [Ti.UI.PORTRAIT]
	});

	var win4 = Ti.UI.createWindow({
		title: I('labels.more'),
		url: 'views/more.js',
		barColor: '#464646',
		backgroundColor: Ui.getDefaultBackground(),
		orientationModes: [Ti.UI.PORTRAIT]
	});

	//add tabs
	var tab1 = Ti.UI.createTab({
		icon: '/img/remote.png',
		title: Ti.App.name,
		window: win1
	});

	var tab2 = Ti.UI.createTab({
		icon: '/img/planet.png',
		title: I('labels.mosaic'),
		window: win2
	});

	var tab3 = Ti.UI.createTab({
		icon: '/img/tv.png',
		title: I('labels.epg'),
		window: win3
	});

	var tab4 = Ti.UI.createTab({
		icon: 'img/gear.png',
		title: I('labels.more'),
		window: win4
	});

	tabGroup.addTab(tab1);
	tabGroup.addTab(tab2);
	tabGroup.addTab(tab3);
	tabGroup.addTab(tab4);

	win1.tabGroup = tabGroup;
	
	Ti.UI.setOrientation(Ti.UI.PORTRAIT);
	tabGroup.open();
})();
