Ti.include('/includes/enums.js');
Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/strip_tags.js');

var Utils = require('includes/utils'),
	Ui = require('includes/ui'),
	Parser = require('includes/parse'),

win = Ti.UI.currentWindow,
defaultTab = Ti.App.Properties.getInt('epg.defaultTab', EPG.TONIGHT),
cachedData = [],
initialPaddingWasSet = false,

searchBar = Titanium.UI.createSearchBar({
	hintText: I('epg.searchHint'),
	barColor: Ui.getBarColor()
}),

tableView = require('/includes/pull_to_refresh')({
	filterAttribute: 'searchFilter',
	search: searchBar
}),

//the window that will show a loading message while the epg is loading
loadingWin = Ui.createLoadingWindow('45%'),

//the tabbedbar used to select the program schedule
tabbedBar = Ti.UI.iOS.createTabbedBar({
	labels: [I('epg.now'), I('epg.tonight')],
	style: Ti.UI.iPhone.SystemButtonStyle.BAR,
	backgroundColor: Ui.getBarColor(),
	height: 30,
	width: 300,
	index: defaultTab,
	lastIndex: defaultTab
});

win.add(tableView);

tabbedBar.addEventListener('click', function(e) {
	if(e.index != null) {
		loadRSSFeed(true, true);
	}
});

win.setTitleControl(tabbedBar);

Ti.App.addEventListener('beginreload', function(e) {
	loadRSSFeed(false, false);
});

win.addEventListener('focus', function() {
	if(!initialPaddingWasSet) {
		loadRSSFeed(false, true);
		
		if(Utils.getMajorOsVersion() >= 7) {
			tableView.setContentInsets({
				top: 65,
				bottom: 50
			}, {
				animated: false
			});
			
			tableView.scrollToTop(-65, {
				animated: false
			});
		}
		
		initialPaddingWasSet = true;
	}
});

function loadRSSFeed(useCache, displayLoad) {
	if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
		Ti.App.fireEvent('endreload', null);
		displayError(Error.NETWORK);
	} else {
		if(useCache && cachedData[tabbedBar.getIndex()] != null) {
			tableView.setData(cachedData[tabbedBar.getIndex()]);
			tabbedBar.lastIndex = tabbedBar.getIndex();
			Ti.App.fireEvent('endreload', null);
		} else {
			if(displayLoad) {
				loadingWin.open();
			}
			
			var url = null;

			if(tabbedBar.getIndex() === EPG.NOW) {
				url = EPG.NOW_URL;
			} else if(tabbedBar.getIndex() == EPG.TONIGHT) {
				url = EPG.TONIGHT_URL;
			}

			var xhr = Ti.Network.createHTTPClient({
				timeout: 15000,
				onload: function() {
					var xml_txt = (this.getResponseText()).replace(/(\r\n|\n|\r)/m, ''),
					xml = Ti.XML.parseString(xml_txt),
					itemList = xml.documentElement.getElementsByTagName('item');

					tableView.setData([]);
					cachedData[tabbedBar.getIndex()] = [];

					Parser.getAllRows(itemList, function(row) {
						tableView.appendRow(row, {
							animated: true
						});
						
						cachedData[tabbedBar.getIndex()].push(row);
					});

					tabbedBar.lastIndex = tabbedBar.getIndex();
					loadingWin.close();
					
					Ti.App.fireEvent('endreload', null);
				},
				onerror: function() {
					displayError(Error.SERVER);
					loadingWin.close();
					Ti.App.fireEvent('endreload', null);
				}
			});

			xhr.open('GET', url);
			xhr.send();
		}
	}
}

function displayError(errorType) {
	tabbedBar.setIndex(tabbedBar.lastIndex);

	var alert = Ti.UI.createAlertDialog({
		title: I('network.message.title'),
		buttonNames: [I('network.buttons.ok')]
	});

	if(errorType == Error.NETWORK) {
		alert.setMessage(I('network.message.epg.connection'));
	} else if(errorType == Error.SERVER) {
		alert.setMessage(I('network.message.epg.server'));
	} else {
		errorType = Error.UNKNOWN;
	}

	alert.setMessage(alert.getMessage() + ' (E' + errorType + ')');
	alert.show();
}

tableView.addEventListener('click', function(e) {
	if(!e.rowData.isHeader && e.rowData.data.title != null) {
		var win = Ti.UI.createWindow({
			url: 'subviews/epg/epg_details.js',
			title: I('epg.details.title'),
			backButtonTitle: I('labels.epg'),
			backgroundColor: Ui.getDefaultBackground(),
			layout: 'vertical',
			data: e.rowData.data
		});
		
		win.addEventListener('close', function() {
			win = null;
		});

		Ti.UI.currentTab.open(win, {
			animated: true
		});
	}
});
