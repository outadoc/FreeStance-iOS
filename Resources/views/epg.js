var Utils = require('includes/utils');
var Ui = require('includes/ui');

Ti.include('/includes/enums.js');
Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/strip_tags.js');

var win = Ti.UI.currentWindow;
var defaultTab = Ti.App.Properties.getInt('epg.defaultTab', EPG.TONIGHT);

var searchBar = Titanium.UI.createSearchBar({
	hintText: I('epg.searchHint'),
	barColor: '#464646'
});

var tableView = require('/includes/pull_to_refresh')({
	filterAttribute: 'searchFilter',
	search: searchBar
});

win.add(tableView);

//the window that will show a loading message while the epg is loading
var loadingWin = Ui.createLoadingWindow('45%');

//the tabbedbar used to select the program schedule
var tabbedBar = Ti.UI.iOS.createTabbedBar({
	labels: [I('epg.now'), I('epg.tonight')],
	style: Ti.UI.iPhone.SystemButtonStyle.BAR,
	backgroundColor: '#787878',
	height: 30,
	width: 300,
	index: defaultTab,
	lastIndex: defaultTab
});

tabbedBar.addEventListener('click', function(e) {
	if(e.index === EPG.NOW) {
		loadRSSFeed(EPG.NOW_URL);
	} else if(e.index == EPG.TONIGHT) {
		loadRSSFeed(EPG.TONIGHT_URL);
	}
});

win.setTitleControl(tabbedBar);

Ti.App.addEventListener('beginreload', function() {
	if(tabbedBar.getIndex() === EPG.NOW) {
		loadRSSFeed(EPG.NOW_URL);
	} else {
		loadRSSFeed(EPG.TONIGHT_URL);
	}
});

function parseEPGRow(itemList, i) {
	try {
		var fullTitle = itemList.item(i).getElementsByTagName('title').item(0).text;
		var desc = itemList.item(i).getElementsByTagName('description').item(0).text;
		var fullUrl = itemList.item(i).getElementsByTagName('link').item(0).text;
		var category = 'N/A';

		fullTitle = fullTitle.replace(/\n/gi, ' ');
		fullTitle = fullTitle.replace('CANAL+', 'Canal+');
		fullTitle = fullTitle.replace('ARTE', 'Arte');

		fullUrl = fullUrl.replace(/\n/gi, ' ');

		desc = desc.replace(/\n/gi, ' ');
		desc = desc.replace('&nbsp;', '');
		desc = desc.replace('[...]', '');
		desc = strip_tags(desc, null);

		var descParts = desc.split('. ');

		if(descParts[1] != null) {
			category = Utils.capitalize(descParts.shift());
			desc = descParts.join('. ');
		}

		var itemParts = fullTitle.split(' : ');
		var channel = itemParts[0];
		itemParts = itemParts[1].split(' ');
		var time = itemParts.shift();
		time = time.replace('h', ':');
		var title = itemParts.join(' ');

		if(channel == 'i>TELE') {
			desc = desc.split('/>')[1];
		}

		var channelID = Utils.getChannelID(channel);

		var row = Ti.UI.createTableViewRow({
			hasChild: true,
			height: Ti.UI.SIZE,
			selectedBackgroundColor: '#565656',
			searchFilter: title + ' ' + channel,
			data: {
				title: title,
				description: desc,
				url: fullUrl,
				startTime: time,
				channelString: channel,
				channelID: channelID,
				category: category
			}
		});

		return row;
	} catch(e) {
		return null;
	}
}

function displayItems(itemList) {
	var lastChannelID;
	tableView.setData(null);

	for(var i = 0; i < itemList.length; i++) {
		var row = parseEPGRow(itemList, i);

		if(row != null) {
			if(lastChannelID != row.data.channelID) {
				var header = Ti.UI.createTableViewRow({
					height: 30,
					selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
					backgroundColor: '#d4d4d4',
					backgroundGradient: {
						type: 'linear',
						colors: [{
							color: '#d4d4d4',
							position: 0.0
						}, {
							color: '#c4c4c4',
							position: 0.50
						}, {
							color: '#b4b4b4',
							position: 1.0
						}]
					},
					borderColor: 'darkGray',
					borderRadius: 1,
					isHeader: true
				});

				var img = Ti.UI.createImageView({
					image: '/img/logo/' + row.data.channelID + '.png',
					defaultImage: '/img/default_epg.png',
					height: 27,
					width: 27,
					left: 10
				});

				var lbl_channel = Ti.UI.createLabel({
					text: row.data.channelString,
					left: 50,
					top: 1,
					color: '#484848',
					font: {
						fontSize: 15,
						fontFamily: 'Helvetica Neue',
						fontWeight: 'bold'
					},
					shadowColor: 'white',
					shadowOffset: {
						x: 0,
						y: 1
					},
					height: Ti.UI.FILL
				});

				lastChannelID = row.data.channelID;
				header.add(img);
				header.add(lbl_channel);

				tableView.appendRow(header, {
					animated: true
				});
			}

			var row_time = Ti.UI.createLabel({
				text: row.data.startTime,
				color: '#000',
				textAlign: 'left',
				left: 10,
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				top: 8,
				bottom: 8,
				font: {
					fontWeight: 'bold',
					fontSize: 16
				},
				highlightedColor: 'white'
			});

			var row_title = Ti.UI.createLabel({
				text: row.data.title,
				color: '#000',
				textAlign: 'left',
				left: 60,
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				top: 7,
				bottom: 8,
				font: {
					fontSize: 15
				},
				highlightedColor: 'white'
			});

			row.add(row_time);
			row.add(row_title);

			tableView.appendRow(row, {
				animated: true
			});
		}
	}
}

function loadRSSFeed(url) {
	if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
		Ti.App.fireEvent('endreload', null);
		displayError(Error.NETWORK);
	} else {
		loadingWin.open();
		var xhr = Ti.Network.createHTTPClient({
			timeout: 15000,
			onload: function() {
				var xml_txt = this.getResponseText();
				xml_txt = xml_txt.replace(/(\r\n|\n|\r)/m, '');
				var xml = Ti.XML.parseString(xml_txt);
				var itemList = xml.documentElement.getElementsByTagName('item');
				displayItems(itemList);
				
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
			backgroundColor: '#323232',
			title: I('epg.details.title'),
			backButtonTitle: I('labels.epg'),
			orientationModes: [Ti.UI.PORTRAIT],
			barColor: '#464646',
			data: e.rowData.data
		});

		Ti.UI.currentTab.open(win, {
			animated: true
		});
	}
});

if(defaultTab == EPG.NOW) {
	loadRSSFeed(EPG.NOW_URL);
} else {
	loadRSSFeed(EPG.TONIGHT_URL);
}