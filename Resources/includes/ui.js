(function() {
	
	exports.Utils = require('/includes/utils');
	
	exports.getDefaultBackground = function() {
		return '#dfdfdf';
	};
	
	exports.getDarkBackground = function() {
		return '#3e3e3e';
	};
	
	exports.getBarColor = function() {
		if(exports.Utils.getMajorOsVersion() < 7) {
			return '#707070';
		} else {
			return '#555555';
		}
	};
	
	exports.createLoadingWindow = function(top) {
		if(top === undefined) { top = '38%'; }
	
		var win = Ti.UI.createWindow({
			width: Ti.UI.FILL,
			height: Ti.Platform.displayCaps.platformHeight,
			left: (Utils.isiPad()) ? 320 : 0
		}),
	
		view = Ti.UI.createView({
			height: 60,
			width: 60,
			top: top,
			borderRadius: 10,
			backgroundColor: '#000',
			opacity: 0.6
		}),
		
		spinWheel = Ti.UI.createActivityIndicator({
			style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
		});

		win.add(view);
	
		view.add(spinWheel);
		spinWheel.show();
	
		return win;
	};
	
	//just a few UI elements, so they can be used painlessly
	exports.createFlexibleSpace = function() {
		return Ti.UI.createButton({
			systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
	};
	
	exports.createFixedSpace = function(width) {
		return Ti.UI.createButton({
			systemButton: Ti.UI.iPhone.SystemButton.FIXED_SPACE,
			width: width
		});
	};
	
	exports.createDestructionView = function(title) {
		var b_destruction = Ti.UI.createButton({
			backgroundImage: '/img/big_red_button.png',
			top: 10,
			height: 45,
			width: 300
		}),
	
		lbl_title = Ti.UI.createLabel({
			text: title,
			shadowColor: '#8c2a31',
			shadowOffset: {
				x: 0,
				y: -1
			},
			font: {
				fontSize: 19,
				fontWeight: 'bold',
				fontFamily: 'Helvetica Neue'
			},
			color: 'white',
			width: 300,
			height: 45,
			textAlign: 'center'
		}),
	
		view = Ti.UI.createView({
			height: b_destruction.height + 30
		});
	
		b_destruction.add(lbl_title);
		view.add(b_destruction);
	
		return view;
	};
	
	//returns a row containing a title and a value. opens a window when clicked
	exports.createParentRow = function(title, header, rowName, configID) {
		var row = Ti.UI.createTableViewRow({
			title: title,
			hasChild: true,
			header: header
		}),
	
		//the label containing the value you want to display
		lbl = Ti.UI.createLabel({
			right: 10,
			height: 35,
			textAlign: 'right',
			width: 150,
			highlightedColor: 'white',
			color: (exports.Utils.getMajorOsVersion() < 7) ? '#336699' : '#000000'
		});
	
		row.add(lbl);
	
		row.addEventListener('click', function(e) {
			var win = Ti.UI.createWindow({
				url: 'options_select.js',
				title: title,
				rowName: rowName,
				configID: configID,
				backgroundColor: exports.getDefaultBackground()
			});
			
			Ti.UI.currentTab.open(win, {
				animated: true
			});
		});
		
		return row;
	};
	
	//returns a row containing a text field
	exports.createTextFieldRow = function(text) {
		var row = Ti.UI.createTableViewRow({
			title: text,
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		}),
	
		textfield = Ti.UI.createTextField({
			color: '#336699',
			height: 35,
			top: 4,
			right: 20,
			width: 80,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			keyboardType: Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION,
			appearance: Titanium.UI.KEYBOARD_APPEARANCE_ALERT,
			hintText: '12345678'
		});
	
		textfield.addEventListener('change', function(e) {
			//the value must be between 0 and 8(-9?) characters only
			e.source.value = e.source.value.slice(0, 9);
		});
	
		row.add(textfield);
		return row;
	};
	
})();