(function() {
	Ti.include('/includes/lib/json.i18n.js');
	
	var RequestHandler = require('includes/callurl'),
	win = Ti.UI.currentWindow,
	i,
	
	view = Ti.UI.createView({
		height: 250,
		width: 237,
		bottom: 80
	}),

	//another button array, for the popup this time
	/*@formatter:off*/
	buttonList = [
		{title: I('buttons.list'), id: 'list', height: 40, width: 113, top: 20, left: 0},
		{title: I('buttons.hdd'), id: 'mail', height: 40, width: 114, top: 20, left: 122, isLong: true},
		{title: I('buttons.epg'), id: 'epg', height: 40, width: 113, top: 65, left: 0},
		{title: I('buttons.pip'), id: 'pip', height: 40, width: 114, top: 65, left: 122},
		{title: I('buttons.mail'), id: 'mail', height: 40, width: 113, top: 110, left: 0},
		{title: I('buttons.aux'), id: 'tv', height: 40, width: 114, top: 110, left: 122},
		{id: 'rec', height: 30, width: 28, top: 165, left: 0, type: 'control'},
		{title: '«', id: 'prev', height: 30, width: 28, top: 165, left: 33, font: {fontSize: 25}, type: 'control'},
		{title: '‹', id: 'bwd', height: 30, width: 28, top: 165, left: 68, font: {fontSize: 27}, type: 'control'},
		{id: 'play', height: 30, width: 28, top: 165, left: 103, font: {fontSize:13}, type: 'control'},
		{id: 'stop', height: 30, width: 28, top: 165, left: 138, type: 'control'},
		{title: '›', id: 'fwd', height: 30, width: 28, top: 165, left: 173, font: {fontSize: 27}, type: 'control'},
		{title: '»', id: 'next', height: 30, width: 28, top: 165, left: 208, font: {fontSize: 25}, type: 'control'},
		{title: I('buttons.close'), id: 'close', height: 40, width: 237, bottom: 0, left: 0}
	];

	win.add(view);
	
	/*@formatter:on*/
	RequestHandler.setProfile(win.thisProfile);
	RequestHandler.setHd(win.thisHd);
	RequestHandler.setCode(win.thisCode);
	RequestHandler.setModel(win.thisModel);
	
	for(i = 0; i < buttonList.length; i++) {
		var button = Ti.UI.createButton(buttonList[i]);

		button.setStyle(Ti.UI.iPhone.SystemButtonStyle.PLAIN);
		button.setBorderRadius(10);
		button.setColor('gray');
		button.setSelectedColor('#2f2f2f');
		button.setBorderColor('gray');
		
		if(button.type === 'control') {
			button.setBorderRadius(button.height / 2);
		}
		
		if(button.id == 'play') {
			var img_button = Ti.UI.createImageView({
				image: '/img/play_pause.png',
				width: 20
			});
			
			button.add(img_button);
		} else if(button.id == 'rec') {
			var img_button = Ti.UI.createImageView({
				image: '/img/rec.png',
				height: 20,
				width: 20
			});
			
			button.add(img_button);
		} else if(button.id == 'stop') {
			var img_button = Ti.UI.createImageView({
				image: '/img/stop.png',
				height: 20,
				width: 20
			});
			
			button.add(img_button);
		}

		button.addEventListener('click', function(e) {
			//if we want to close the window
			if(e.source.id == 'close') {
				win.close();
			} else if(e.source.id != null) {
				//checking if the button press can be long
				var isLong = false;
				if(e.source.isLong) {
					isLong = true;
				}
				//calling the key!
				RequestHandler.callKey(e.source.id, isLong);
			}
		});

		view.add(button);
	}
})();
