(function() {
	
	Ti.include('/includes/lib/json.i18n.js');
	Ti.include('/includes/enums.js');
	
	var Utils = require('includes/utils'),
		Ui = require('includes/ui'),	
	
	tabGroup = Ti.UI.createTabGroup({
		activeTabIconTint: (Utils.getMajorOsVersion() < 7) ? '#bbbbbb' : '#000000',
		barColor: (Utils.getMajorOsVersion() < 7) ? Ui.getBarColor() : '#cccccc',
		tintColor: '#333333',
		orientationModes: (Utils.isiPad()) ? undefined : [Ti.UI.PORTRAIT]
	}),

	//add tabs
	tab_main = Ti.UI.createTab({
		icon: '/img/remote.png',
		title: Ti.App.name,
		window: Ti.UI.createWindow({
			url: 'views/main.js',
			backgroundColor: Ui.getDarkBackground(),
			translucent: false
		})
	}),
	
	tab_trackpad = Ti.UI.createTab({
		icon: '/img/swipe.png',
		title: I('labels.trackpad'),
		window: Ti.UI.createWindow({
			url: 'views/trackpad.js',
			backgroundColor: Ui.getDarkBackground(),
			translucent: false
		})
	}),
	
	tab_mosaic = Ti.UI.createTab({
		icon: '/img/planet.png',
		title: I('labels.mosaic'),
		window: Ti.UI.createWindow({
			url: 'views/mosaic.js',
			backgroundColor: (Utils.isiPad()) ? null : Ui.getDarkBackground(),
			backgroundImage: (Utils.isiPad()) ? '/img/bg_ipad.png' : null,
			backgroundRepeat: true,
			translucent: false
		})
	}),

	tab_epg = Ti.UI.createTab({
		icon: '/img/tv.png',
		title: I('labels.epg'),
		window: Ti.UI.createWindow({
			url: 'views/epg.js',
			backgroundColor: Ui.getDefaultBackground(),
			extendEdges:[Ti.UI.EXTEND_EDGE_BOTTOM, Ti.UI.EXTEND_EDGE_TOP],
			autoAdjustScrollViewInsets: true
		})
	}),

	tab_more = Ti.UI.createTab({
		icon: 'img/gear.png',
		title: I('labels.more'),
		window: Ti.UI.createWindow({
			title: I('labels.more'),
			url: 'views/more.js',
			backgroundColor: Ui.getDefaultBackground(),
			translucent: false
		})
	});
	
	Ti.UI.backgroundColor = Ui.getDefaultBackground();
	
	if(!Utils.isiPad()) {
		tabGroup.addTab(tab_main);
		tabGroup.addTab(tab_trackpad);
	}
	
	tabGroup.addTab(tab_mosaic);
	tabGroup.addTab(tab_epg);
	tabGroup.addTab(tab_more);
	
	if(Utils.isiPad()) {
		var nav_win_main = Ti.UI.iPhone.createNavigationGroup({
		   window: Ti.UI.createWindow({
				url: 'views/main.js',
				backgroundColor: Ui.getDarkBackground(),
				barColor: (Utils.getMajorOsVersion() < 7) ? Ui.getBarColor() : '#cccccc',
				tintColor: '#333333',
				translucent: false
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
	Utils.confCheck(tabGroup);
	
})();
