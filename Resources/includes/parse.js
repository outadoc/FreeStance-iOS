(function() {
	
	exports.parseSingleProgram = function(item) {
		try {
			var fullTitle = (item.getElementsByTagName('title').item(0).text).replace(/\n/gi, ' ').replace('CANAL+', 'Canal+').replace('ARTE', 'Arte'),
			desc = strip_tags(((item.getElementsByTagName('description').item(0).text).replace(/\n/gi, ' ').replace('&nbsp;', '').replace('[...]', '').split('/>'))[1], null),
			category = 'N/A',

			descParts = desc.split('. '),
			
			titleComps = fullTitle.match(/(.*) : ([0-9]{2}h[0-9]{2}) (.*)/);

			if(descParts[1] != null) {
				category = Utils.capitalize(descParts.shift());
				desc = descParts.join('. ');
			}

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
	};

	exports.getAllRows = function(itemList, callback) {
		var lastChannelID, i;
		
		for(i = 0; i < itemList.length; i++) {
			var progData = exports.parseSingleProgram(itemList.item(i)),
			
			row = Ti.UI.createTableViewRow({
				hasChild: true,
				height: Ti.UI.SIZE,
				selectedBackgroundColor: '#565656',
				searchFilter: progData.title + ' ' + progData.channelString,
				data: progData
			});

			if(row != null) {
				if(lastChannelID != row.data.channelID) {
					var header = Ti.UI.createTableViewRow({
						height: 30,
						selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
						backgroundColor: '#d0d0d0',
						borderColor: 'darkGray',
						borderRadius: 1,
						isHeader: true
					}),

					img = Ti.UI.createImageView({
						image: '/img/logo/' + row.data.channelID + '.png',
						defaultImage: '/img/default_epg.png',
						height: 27,
						width: 27,
						left: 10
					}),

					lbl_channel = Ti.UI.createLabel({
						text: row.data.channelString,
						left: 50,
						top: 1,
						color: '#606060',
						font: {
							fontSize: 15,
							fontFamily: 'Helvetica Neue',
							fontWeight: 'bold'
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
					left: 7,
					height: Ti.UI.SIZE,
					width: Ti.UI.SIZE,
					top: 8,
					bottom: 8,
					font: {
						fontWeight: 'bold',
						fontSize: 16
					},
					highlightedColor: 'white'
				}),

				row_title = Ti.UI.createLabel({
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
	};
	
})();
