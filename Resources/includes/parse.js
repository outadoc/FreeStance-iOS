(function() {
	exports.parseSingleProgram = function(item) {
		try {
			var fullTitle = item.getElementsByTagName('title').item(0).text;
			var desc = item.getElementsByTagName('description').item(0).text;
			var fullUrl = item.getElementsByTagName('link').item(0).text;
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

			return {
				title: title,
				description: desc,
				url: fullUrl,
				startTime: time,
				channelString: channel,
				channelID: channelID,
				category: category
			};
		} catch(e) {
			return null;
		}
	}

	exports.getAllRows = function(itemList, callback) {
		var lastChannelID;
		
		for(var i = 0; i < itemList.length; i++) {
			var progData = exports.parseSingleProgram(itemList.item(i));
			
			var row = Ti.UI.createTableViewRow({
				hasChild: true,
				height: Ti.UI.SIZE,
				selectedBackgroundColor: '#565656',
				searchFilter: progData.title + ' ' + progData.channel,
				data: progData
			});

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
					
					//append header
					callback(header);
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

				callback(row);
			}
		}
	}
})();
