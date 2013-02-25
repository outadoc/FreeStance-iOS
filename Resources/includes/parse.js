(function() {
	exports.parseSingleProgram = function(item) {
		try {
			var fullTitle = (item.getElementsByTagName('title').item(0).text).replace(/\n/gi, ' ').replace('CANAL+', 'Canal+').replace('ARTE', 'Arte');
			var desc = strip_tags(((item.getElementsByTagName('description').item(0).text).replace(/\n/gi, ' ').replace('&nbsp;', '').replace('[...]', '').split('/>'))[1], null);
			var category = 'N/A';

			var descParts = desc.split('. ');

			if(descParts[1] != null) {
				category = Utils.capitalize(descParts.shift());
				desc = descParts.join('. ');
			}
			
			var titleComps = fullTitle.match(/(.*) : ([0-9]{2}h[0-9]{2}) (.*)/);

			return {
				title: titleComps[3],
				description: desc,
				url: (item.getElementsByTagName('link').item(0).text).replace(/\n/gi, ' '),
				startTime: titleComps[2],
				channelString: titleComps[1],
				channelID: Utils.getChannelID(titleComps[1]),
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
