(function() {
	var Utils = require('includes/utils');
	var Ui = require('includes/ui');
	
	Ti.include('/includes/lib/json.i18n.js');
	Ti.include('/includes/enums.js');

	var tabGroup = Ti.UI.createTabGroup({
		activeTabIconTint: '#bbbbbb',
		barColor: Ui.getBarColor(),
		orientationModes: (Utils.isiPad()) ? undefined : [Ti.UI.PORTRAIT]
	});

	//add tabs
	var tab_main = Ti.UI.createTab({
		icon: '/img/remote.png',
		title: Ti.App.name,
		window: Ti.UI.createWindow({
			url: 'views/main.js',
			backgroundColor: Ui.getDarkBackground()
		})
	});

	var tab_mosaic = Ti.UI.createTab({
		icon: '/img/planet.png',
		title: I('labels.mosaic'),
		window: Ti.UI.createWindow({
			url: 'views/mosaic.js',
			backgroundColor: (Utils.isiPad()) ? '#666666' : Ui.getDarkBackground()
		})
	});

	var tab_epg = Ti.UI.createTab({
		icon: '/img/tv.png',
		title: I('labels.epg'),
		window: Ti.UI.createWindow({
			url: 'views/epg.js',
			backgroundColor: Ui.getDefaultBackground()
		})
	});

	var tab_more = Ti.UI.createTab({
		icon: 'img/gear.png',
		title: I('labels.more'),
		window: Ti.UI.createWindow({
			title: I('labels.more'),
			url: 'views/more.js',
			backgroundColor: Ui.getDefaultBackground()
		})
	});
	
	if(!Utils.isiPad()) {
		tabGroup.addTab(tab_main);
	}
	
	tabGroup.addTab(tab_mosaic);
	tabGroup.addTab(tab_epg);
	tabGroup.addTab(tab_more);
	
	if(Utils.isiPad()) {
		var nav_win_main = Ti.UI.iPhone.createNavigationGroup({
		   window: Ti.UI.createWindow({
				url: 'views/main.js',
				backgroundColor: Ui.getDarkBackground(),
				barColor: Ui.getBarColor()
			})
		});
		 
		var splitwin = Ti.UI.iPad.createSplitWindow({
		    detailView: tabGroup,
		    masterView: nav_win_main,
		    showMasterInPortrait: true
		});
		 
		splitwin.open();
	}
	
	tabGroup.open();
})();
