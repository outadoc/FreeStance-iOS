Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/callurl.js');

var win = Ti.UI.currentWindow;

var view = Ti.UI.createView({
	backgroundImage: '/img/remotebg.png',
	borderWidth: 5,
	borderColor: '#999',
	height: 260,
	width: 252,
	top: 60,
	borderRadius: 10
});

win.add(view);

//another button array, for the popup this time
var buttonList = [{
	title: I('buttons.list'),
	id: 'list',
	height: 40,
	width: 102,
	top: 20,
	left: 20
}, {
	title: I('buttons.hdd'),
	id: 'mail',
	height: 40,
	width: 102,
	top: 20,
	left: 131,
	isLong: true
}, {
	title: I('buttons.epg'),
	id: 'epg',
	height: 40,
	width: 102,
	top: 65,
	left: 20
}, {
	title: I('buttons.pip'),
	id: 'pip',
	height: 40,
	width: 102,
	top: 65,
	left: 131
}, {
	title: I('buttons.mail'),
	id: 'mail',
	height: 40,
	width: 102,
	top: 110,
	left: 20
}, {
	title: I('buttons.aux'),
	id: 'tv',
	height: 40,
	width: 102,
	top: 110,
	left: 131
}, {
	title: '⚫',
	id: 'rec',
	height: 30,
	width: 26,
	top: 165,
	left: 20,
	color: 'red',
	font: {
		fontSize: 25
	}
}, {
	title: '«',
	id: 'prev',
	height: 30,
	width: 26,
	top: 165,
	left: 51,
	font: {
		fontSize: 25
	}
}, {
	title: '‹',
	id: 'bwd',
	height: 30,
	width: 26,
	top: 165,
	left: 82,
	font: {
		fontSize: 27
	}
}, {
	id: 'play',
	height: 30,
	width: 26,
	top: 165,
	left: 113,
	font: {
		fontSize: 13
	}
}, {
	title: '◼',
	id: 'stop',
	height: 30,
	width: 26,
	top: 165,
	left: 144,
	font: {
		fontSize: 15
	}
}, {
	title: '›',
	id: 'fwd',
	height: 30,
	width: 26,
	top: 165,
	left: 175,
	font: {
		fontSize: 27
	}
}, {
	title: '»',
	id: 'next',
	height: 30,
	width: 26,
	top: 165,
	left: 206,
	font: {
		fontSize: 25
	}
}, {
	title: I('buttons.close'),
	id: 'close',
	height: 30,
	width: 213,
	bottom: 20,
	left: 20
}];

for(var i = 0; i < buttonList.length; i++) {
	var button = Ti.UI.createButton(buttonList[i]);
	button.setBackgroundImage('/img/button.png');
	button.setBackgroundSelectedImage('/img/button_selected.png');
	button.setBorderColor('gray');

	if(button.id == 'play') {
		var img_button = Ti.UI.createImageView({
			image: '/img/play_pause.png',
			height: 20,
			width: 20,
			top: 6
		});

		button.add(img_button);
	}

	button.addEventListener('click', function(e) {
		//if we want to close the window
		if(e.source.id == 'close') {
			win.close({
				opacity: 0,
				duration: 500
			});
		} else if(e.source.id != null) {
			//checking if the button press can be long
			var isLong = false;
			if(e.source.isLong) {
				isLong = true;
			}
			//calling the key!
			callKey(e.source.id, isLong, win.thisHd, win.thisCode, win.thisModel, win.thisProfile);
		}
	});

	view.add(button);
}