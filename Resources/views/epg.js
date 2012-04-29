Ti.include('/includes/strip_tags.js');
Ti.include('/includes/utils.js');
Ti.include('/includes/enums.js');
Ti.include('/includes/ui.js');
Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;
var defaultTab = Ti.App.Properties.getInt('epg.defaultTab', EPG.NOW);

var searchBar = Titanium.UI.createSearchBar({
	hintText: I('epg.searchHint'),
	barColor: '#464646'
});

searchBar.addEventListener('return', function(e) {
	if(e.source.value.toLowerCase() == 'we do not forgive, we do not forget.') {
		var win = Ti.UI.createWindow({
			url: 'subviews/epg/easter_egg.js',
			title: 'Expect us.',
			barColor: '#464646'
		});

		win.open({
			modal: true
		});
	}
});

var tableView = Ti.UI.createTableView({
	filterAttribute: 'thisSearchFilter',
	search: searchBar
});

win.add(tableView);

//the window that will show a loading message while the epg is loading
var loadingWin = createLoadingWindow(200);

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
	loadingWin.open();
	if(e.index === EPG.NOW) {
		loadRSSFeed(EPG.NOW_URL);
	} else if(e.index == EPG.TONIGHT) {
		loadRSSFeed(EPG.TONIGHT_URL);
	}
});

win.setTitleControl(tabbedBar);

var tableHeader = Ti.UI.createView({
	backgroundColor: '#e2e7ed',
	width: 320,
	height: 60
});

tableView.setHeaderPullView(tableHeader);

var border = Ti.UI.createView({
	backgroundColor: '#576c89',
	height: 1,
	bottom: 0
});

tableHeader.add(border);

var arrow = Ti.UI.createView({
	backgroundImage: '/img/arrow.png',
	width: 23,
	height: 53,
	bottom: 10,
	left: 20
});

tableHeader.add(arrow);

var statusLabel = Ti.UI.createLabel({
	text: I('epg.refresh.pullToRefresh'),
	left: 65,
	width: 200,
	bottom: 30,
	height: Ti.UI.SIZE,
	color: '#788193',
	textAlign: 'left',
	font: {
		fontSize: 14,
		fontWeight: 'bold'
	},
	shadowColor: '#f6f8fa',
	shadowOffset: {
		x: 0,
		y: 1
	}
});

tableHeader.add(statusLabel);

var lastUpdatedLabel = Ti.UI.createLabel({
	text: I('epg.refresh.updated', getFullDate()),
	left: 65,
	width: 200,
	bottom: 15,
	height: Ti.UI.SIZE,
	color: '#788193',
	textAlign: 'left',
	font: {
		fontSize: 13
	},
	shadowColor: '#f6f8fa',
	shadowOffset: {
		x: 0,
		y: 1
	}
});

tableHeader.add(lastUpdatedLabel);

var actInd = Ti.UI.createActivityIndicator({
	left: 20,
	bottom: 13,
	width: 30,
	height: 30,
	style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
});

tableHeader.add(actInd);

var pulling = false;
var reloading = false;

function beginReloading() {
	if(tabbedBar.getIndex() === EPG.NOW) {
		loadRSSFeed(EPG.NOW_URL);
	} else {
		loadRSSFeed(EPG.TONIGHT_URL);
	}
}

function endReloading() {
	reloading = false;
	lastUpdatedLabel.setText(I('epg.refresh.updated', getFullDate()));
	statusLabel.setText(I('epg.refresh.releaseToRefresh'));
	actInd.hide();
	arrow.show();
	tableView.setContentInsets({
		top: 0
	}, {
		animated: true
	});
}

function getTonightRow(itemList, i) {
	try {
		var fullTitle = itemList.item(i).getElementsByTagName('title').item(0).text;
		var desc = itemList.item(i).getElementsByTagName('description').item(0).text;
		var fullUrl = itemList.item(i).getElementsByTagName('link').item(0).text;
		var category;

		try {
			category = itemList.item(i).getElementsByTagName('category').item(0).text;
		} catch(e) {
		}

		fullTitle = fullTitle.replace(/\n/gi, ' ');
		fullTitle = fullTitle.replace('TF 1', 'TF1');
		fullTitle = fullTitle.replace('La Chaîne Parlementaire', 'LCP');
		fullTitle = fullTitle.replace('i Télé', 'i>TELE');
		fullTitle = fullTitle.replace('NT 1', 'NT1');
		fullTitle = fullTitle.replace('NRJ 12', 'NRJ12');

		fullUrl = fullUrl.replace(/\n/gi, ' ');

		desc = desc.replace(/\n/gi, ' ');
		desc = desc.replace('&nbsp;', '');
		desc = strip_tags(desc, null);

		var itemParts = fullTitle.split(' - ');

		var channel = itemParts[0];
		var time = itemParts[1];
		var title = itemParts[2];
		var channelID = getChannelID(channel);
		var defaultImg = '/img/logo/' + channelID + '.png';
		var imgUrl;

		try {
			if(itemList.item(i).getElementsByTagName('enclosure') != null) {
				imgUrl = itemList.item(i).getElementsByTagName('enclosure').item(0).attributes.getNamedItem('url').text;
			}
		} catch(e) {
		}

		var row = Ti.UI.createTableViewRow({
			height: Ti.UI.SIZE,
			hasChild: true,
			selectedBackgroundColor: '#565656',

			thisFullTitle: fullTitle,
			thisTitle: title,
			thisDesc: desc,
			thisUrl: fullUrl,
			thisImageUrl: imgUrl,
			thisChannel: channel,
			thisTime: time,
			thisChannelID: channelID,
			thisSearchFilter: title + ' ' + channel,
			thisDefaultImg: defaultImg,
			thisCategory: category
		});

		return row;
	} catch(e) {
		return null;
	}
}

function getNowRow(itemList, i) {
	try {
		var fullTitle = itemList.item(i).getElementsByTagName('title').item(0).text;
		var desc = itemList.item(i).getElementsByTagName('description').item(0).text;
		var fullUrl = itemList.item(i).getElementsByTagName('link').item(0).text;
		var category = '';

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
			category = descParts.shift();
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

		var channelID = getChannelID(channel);

		var row = Ti.UI.createTableViewRow({
			hasChild: true,
			height: Ti.UI.SIZE,
			selectedBackgroundColor: '#565656',

			thisFullTitle: fullTitle,
			thisTitle: title,
			thisDesc: desc,
			thisUrl: fullUrl,
			thisChannel: channel,
			thisTime: time,
			thisChannelID: channelID,
			thisSearchFilter: title + ' ' + channel,
			thisCategory: category
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
		var row;

		if(tabbedBar.getIndex() === EPG.NOW) {
			row = getNowRow(itemList, i);
		} else {
			row = getTonightRow(itemList, i);
		}

		if(row != null) {
			if(lastChannelID != row.thisChannel) {
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
					image: '/img/logo/' + row.thisChannelID + '.png',
					height: 27,
					width: 27,
					left: 10
				});

				var lbl_channel = Ti.UI.createLabel({
					text: row.thisChannel,
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

				lastChannelID = row.thisChannel;
				header.add(img);
				header.add(lbl_channel);

				tableView.appendRow(header, {
					animated: true
				});
			}

			var row_time = Ti.UI.createLabel({
				text: row.thisTime,
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
				text: row.thisTitle,
				color: '#000',
				textAlign: 'left',
				left: 60,
				height: Ti.UI.SIZE,
				width: Ti.UI.SIZE,
				top: 8,
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
		loadingWin.close();
		endReloading();
		displayError(Error.NETWORK);
	} else {
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
				endReloading();
			},
			onerror: function() {
				displayError(Error.SERVER);
				loadingWin.close();
				endReloading();
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

tableView.addEventListener('scroll', function(e) {
	var offset = e.contentOffset.y;
	if(offset <= -65.0 && !pulling) {
		var t = Ti.UI.create2DMatrix();
		t = t.rotate(-180);
		pulling = true;

		arrow.animate({
			transform: t,
			duration: 180
		});

		statusLabel.setText(I('epg.refresh.releaseToRefresh'));
	} else if(pulling && offset > -65.0 && offset < 0) {
		pulling = false;
		var t = Ti.UI.create2DMatrix();

		arrow.animate({
			transform: t,
			duration: 180
		});

		statusLabel.setText(I('epg.refresh.pullToRefresh'));
	}
});

tableView.addEventListener('scrollEnd', function(e) {
	if(pulling && !reloading && e.contentOffset.y <= -65.0) {
		reloading = true;
		pulling = false;
		arrow.hide();
		actInd.show();
		statusLabel.setText(I('epg.refresh.loading'));

		tableView.setContentInsets({
			top: 60
		}, {
			animated: true
		});

		arrow.setTransform(Ti.UI.create2DMatrix());
		beginReloading();
	}
});

tableView.addEventListener('click', function(e) {
	if(!e.rowData.isHeader && e.rowData.thisTitle != null) {
		var win = Ti.UI.createWindow({
			url: 'subviews/epg/epg_details.js',
			backgroundImage: '/img/remotebg.png',
			title: I('epg.details.title'),
			backButtonTitle: I('labels.epg'),
			orientationModes: [Ti.UI.PORTRAIT],
			barColor: '#464646',

			thisTitle: e.rowData.thisTitle,
			thisChannel: e.rowData.thisChannel,
			thisTime: e.rowData.thisTime,
			thisDesc: e.rowData.thisDesc,
			thisImageUrl: e.rowData.thisImageUrl,
			thisUrl: e.rowData.thisUrl,
			thisChannelID: e.rowData.thisChannelID,
			thisCategory: e.rowData.thisCategory
		});

		Ti.UI.currentTab.open(win, {
			animated: true
		});
	}
});

loadingWin.open();

if(defaultTab == EPG.NOW) {
	loadRSSFeed(EPG.NOW_URL);
} else {
	loadRSSFeed(EPG.TONIGHT_URL);
}