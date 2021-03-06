(function() {
	
	Ti.include('/includes/lib/json.i18n.js');
	Ti.include('/includes/enums.js');

	var RequestHandler = require('includes/callurl'),
		Utils = require('includes/utils'),
		Ui = require('includes/ui'),

	win = Ti.UI.currentWindow,
	view = Ti.UI.createView({
		height: '100%',
		width: '100%'
	}),

	//advanced options
	prefs = {
		volumeRepeat: null,
		volumeRepeatFrequency: null,
		progRepeat: null,
		progRepeatFrequency: null,
		longPress: null,
		longPressLength: null
	},

	timeouts = {
		repeatIntervalID: null,
		longPressTimeoutID: null
	},
	
	//a tabbed bar used to select the profile the user wants to use
	tabbedBar = Ti.UI.iOS.createTabbedBar({
		labels: [I('profile.1'), I('profile.2'), I('profile.3')],
		style: Ti.UI.iPhone.SystemButtonStyle.BAR,
		bottom: 7,
		height: '30',
		width: '300',
		backgroundColor: Ui.getBarColor()
	}),
	
	buttonList = [];
	
	win.add(view);
	
	if(!Utils.isiPad()) {
		//the buttons and their placing
		/*@formatter:off*/
		buttonList = [
			{id: 'red', height: 35, width: 35, left: 37, top: 25, canBeLong: false, isColor: true},
			{id: 'up', height: 40, width: 40, left: 77, top: 20, canBeLong: false, isArrow: true},
			{id: 'blue', height: 35, width: 35, left: 122, top: 25, canBeLong: false, isColor: true},
			{id: 'left', height: 40, width: 40, left: 32, top: 65, canBeLong: false, isArrow: true},
			{title: I('buttons.ok'), id: 'ok', height: 40, width: 40, left: 77, top: 65, canBeLong: false},
			{id: 'right', height: 40, width: 40, left: 122, top: 65, canBeLong: false, isArrow: true},
			{id: 'green', height: 35, width: 35, left: 37, top: 110, canBeLong: false, isColor: true},
			{id: 'down', height: 40, width: 40, left: 77, top: 110, canBeLong: false, isArrow: true},
			{id: 'yellow', height: 35, width: 35, left: 122, top: 110, canBeLong: false, isColor: true},
			{title: '+', id: 'vol_inc', height: 50, width: 40, left: 200, top: 23, bFontSize: 23, canRepeat: true},
			{title: '-', id: 'vol_dec', height: 50, width: 40, left: 200, top: 93, bFontSize: 28, canRepeat: true},
			{title: '+', id: 'prgm_inc', height: 50, width: 40, left: 255, top: 23, bFontSize: 23, canRepeat: false},
			{title: '-', id: 'prgm_dec', height: 50, width: 40, left: 255, top: 93, bFontSize: 28, canRepeat: false},
			{title: '1', id: '1', height: 35, width: 45, left: 20, top: 175, canBeLong: true, isDigit: true},
			{title: '2', id: '2', height: 35, width: 45, left: 75, top: 175, canBeLong: true, isDigit: true},
			{title: '3', id: '3', height: 35, width: 45, left: 130, top: 175, canBeLong: true, isDigit: true},
			{title: '4', id: '4', height: 35, width: 45, left: 20, top: 220, canBeLong: true, isDigit: true},
			{title: '5', id: '5', height: 35, width: 45, left: 75, top: 220, canBeLong: true, isDigit: true},
			{title: '6', id: '6', height: 35, width: 45, left: 130, top: 220, canBeLong: true, isDigit: true},
			{title: '7', id: '7', height: 35, width: 45, left: 20, top: 265, canBeLong: true, isDigit: true},
			{title: '8', id: '8', height: 35, width: 45, left: 75, top: 265, canBeLong: true, isDigit: true},
			{title: '9', id: '9', height: 35, width: 45, left: 130, top: 265, canBeLong: true, isDigit: true},
			{title: ' ←', id: 'back', height: 35, width: 45, left: 20, top: 310, bFontSize: 23, canBeLong: false},
			{title: '0', id: '0', height: 35, width: 45, left: 75, top: 310, canBeLong: true, isDigit: true},
			{title: '↻', id: 'swap', height: 35, width: 45, left: 130, top: 310, canBeLong: true},
			{id: 'power', height: 35, width: 95, left: 200, top: 175, canBeLong: false},
			{id: 'home', height: 35, width: 95, left: 200, top: 220, canBeLong: true},
			{title: I('buttons.mute'), id: 'mute', height: 35, width: 95, left: 200, top: 265, canBeLong: false},
			{title: '...', id: 'other', height: 35, width: 95, left: 200, top: 310, canBeLong: false}
		];
		/*@formatter:on*/
		
		if(Ti.Platform.displayCaps.platformHeight >= 568) {
			buttonList.push(
				{title: I('buttons.list'), id: 'list', height: 30, width: 85, bottom: 60, left: 20, bFontSize: 15, canBeLong: false},
				{title: I('buttons.hdd'), id: 'mail', height: 30, width: 85, bottom: 60, left: 115, bFontSize: 15, canBeLong: false, isLong: true},
				{title: I('buttons.mail'), id: 'mail', height: 30, width: 85, bottom: 60, left: 210, bFontSize: 15, canBeLong: false},
				{title: I('buttons.epg'), id: 'epg', height: 30, width: 85, bottom: 20, left: 20, bFontSize: 15, canBeLong: false},
				{title: I('buttons.pip'), id: 'pip', height: 30, width: 85, bottom: 20, left: 115, bFontSize: 15, canBeLong: false},
				{title: I('buttons.aux'), id: 'tv', height: 30, width: 85, bottom: 20, left: 210, bFontSize: 15, canBeLong: false}
			);
		}
	} else {
		buttonList = [
			{id: 'red', height: 35, width: 35, left: 37, top: 25, canBeLong: false, isColor: true},
			{id: 'up', height: 40, width: 40, left: 77, top: 20, canBeLong: false, isArrow: true},
			{id: 'blue', height: 35, width: 35, left: 122, top: 25, canBeLong: false, isColor: true},
			{id: 'left', height: 40, width: 40, left: 32, top: 65, canBeLong: false, isArrow: true},
			{title: I('buttons.ok'), id: 'ok', height: 40, width: 40, left: 77, top: 65, canBeLong: false},
			{id: 'right', height: 40, width: 40, left: 122, top: 65, canBeLong: false, isArrow: true},
			{id: 'green', height: 35, width: 35, left: 37, top: 110, canBeLong: false, isColor: true},
			{id: 'down', height: 40, width: 40, left: 77, top: 110, canBeLong: false, isArrow: true},
			{id: 'yellow', height: 35, width: 35, left: 122, top: 110, canBeLong: false, isColor: true},
			{title: '+', id: 'vol_inc', height: 50, width: 40, left: 200, top: 23, bFontSize: 23, canRepeat: true},
			{title: '-', id: 'vol_dec', height: 50, width: 40, left: 200, top: 93, bFontSize: 28, canRepeat: true},
			{title: '+', id: 'prgm_inc', height: 50, width: 40, left: 255, top: 23, bFontSize: 23, canRepeat: false},
			{title: '-', id: 'prgm_dec', height: 50, width: 40, left: 255, top: 93, bFontSize: 28, canRepeat: false},
			{title: '1', id: '1', height: 35, width: 45, left: 20, top: 330, canBeLong: true},
			{title: '2', id: '2', height: 35, width: 45, left: 75, top: 330, canBeLong: true},
			{title: '3', id: '3', height: 35, width: 45, left: 130, top: 330, canBeLong: true},
			{title: '4', id: '4', height: 35, width: 45, left: 20, top: 375, canBeLong: true},
			{title: '5', id: '5', height: 35, width: 45, left: 75, top: 375, canBeLong: true},
			{title: '6', id: '6', height: 35, width: 45, left: 130, top: 375, canBeLong: true},
			{title: '7', id: '7', height: 35, width: 45, left: 20, top: 420, canBeLong: true},
			{title: '8', id: '8', height: 35, width: 45, left: 75, top: 420, canBeLong: true},
			{title: '9', id: '9', height: 35, width: 45, left: 130, top: 420, canBeLong: true},
			{title: ' ←', id: 'back', height: 35, width: 45, left: 20, top: 465, bFontSize: 23, canBeLong: false},
			{title: '0', id: '0', height: 35, width: 45, left: 75, top: 465, canBeLong: true },
			{title: '↻', id: 'swap', height: 35, width: 45, left: 130, top: 465, canBeLong: true},
			
			{id: 'power', height: 50, width: 95, left: 200, top: 330, canBeLong: false},
			{id: 'home', height: 50, width: 95, left: 200, top: 390, canBeLong: true},
			{title: I('buttons.mute'), id: 'mute', height: 50, width: 95, left: 200, top: 450, canBeLong: false},
			
			{title: I('buttons.list'), id: 'list', height: 35, width: 133, top: 522, left: 20},
			{title: I('buttons.hdd'), id: 'mail', height: 35, width: 134, top: 522, left: 162, isLong: true},
			{title: I('buttons.epg'), id: 'epg', height: 35, width: 133, top: 563, left: 20},
			{title: I('buttons.pip'), id: 'pip', height: 35, width: 134, top: 563, left: 162},
			{title: I('buttons.mail'), id: 'mail', height: 35, width: 133, top: 604, left: 20},
			{title: I('buttons.aux'), id: 'tv', height: 35, width: 134, top: 604, left: 162},
			
			{id: 'rec', height: 30, width: 32, top: 660, left: 20},
			{title: '«', id: 'prev', height: 30, width: 32, top: 660, left: 61, bFontSize: 25},
			{title: '‹', id: 'bwd', height: 30, width: 32, top: 660, left: 102, bFontSize: 27},
			{id: 'play', height: 30, width: 32, top: 660, left: 142, bFontSize: 13},
			{id: 'stop', height: 30, width: 32, top: 660, left: 183},
			{title: '›', id: 'fwd', height: 30, width: 32, top: 660, left: 224, bFontSize: 27},
			{title: '»', id: 'next', height: 30, width: 32, top: 660, left: 264, bFontSize: 25}
		];
		
		var view_trackpad = Ti.UI.createView({
			backgroundImage: '/img/ipad_trackpad.png',
			top: 180,
			left: 20,
			right: 25,
			height: 120,
			layout: 'horizontal',
			zIndex: 5
		}),
		
		view_trackpad_vol = Ti.UI.createView({
			left: 0,
			width: '15%',
			height: Ti.UI.FILL,
			opacity: 0.4,
			borderColor: 'gray',
			borderRadius: 5
		}),
		
		view_trackpad_main = Ti.UI.createView({
			width: '70%',
			height: Ti.UI.FILL,
			opacity: 0.3
		}),
		
		view_trackpad_prgm = Ti.UI.createView({
			right: 0,
			width: '15%',
			height: Ti.UI.FILL,
			opacity: 0.4,
			borderColor: 'gray',
			borderRadius: 5
		});
		
		view_trackpad.add(view_trackpad_vol);
		view_trackpad.add(view_trackpad_main);
		view_trackpad.add(view_trackpad_prgm);

		view_trackpad_main.addEventListener('swipe', function(e) {
			if(e.direction == 'up' || e.direction == 'down' || e.direction == 'left' || e.direction == 'right') {
				RequestHandler.callKey(e.direction, false);
			}
		});
		
		view_trackpad_main.addEventListener('click', function(e) {
			RequestHandler.callKey('ok', false);
		});
		
		view_trackpad_prgm.addEventListener('swipe', function(e) {
			if(e.direction == 'up') {
				RequestHandler.callKey('prgm_inc', false);
			} else if(e.direction == 'down') {
				RequestHandler.callKey('prgm_dec', false);
			}
		});
		
		view_trackpad_vol.addEventListener('swipe', function(e) {
			if(e.direction == 'up') {
				RequestHandler.callKey('vol_inc', false);
			} else if(e.direction == 'down') {
				RequestHandler.callKey('vol_dec', false);
			}
		});
		
		view.add(view_trackpad);
	}
	
	tabbedBar.addEventListener('click', function(e) {
		//setting the new profile to use
		Ti.App.Properties.setInt('profileToUse', e.index + 1);
		
		Ti.App.fireEvent('changeProfile', {
			profile: e.index + 1
		});
		
		loadPrefs();
	});

	//setting the toolbar
	win.setTitleControl(tabbedBar);

	function on_btn_touchstart(e) {
		//if the button press can be repeated as long as the user keeps pressing it the functionnality is compatible only with the volume and program buttons
		if(e.source.canRepeat) {
			var delay = 200;

			if(e.source.id == 'vol_inc' || e.source.id == 'vol_dec') {
				//if it's one of the volume buttons, get the volume repeat frequency
				delay = prefs.volumeRepeatFrequency;
			} else if(e.source.id == 'prgm_inc' || e.source.id == 'prgm_dec') {
				// else if it's one of the program buttons, get the program repeat frequency
				delay = prefs.progRepeatFrequency;
			}

			if(RequestHandler.getModel() == Model.FREEBOX_REVOLUTION && (e.source.id == 'vol_inc' || e.source.id == 'vol_dec')) {
				//the freebox révolution volume button needs a shorter frequency than the freebox hd one
				delay *= 0.5;
			}

			//solves a bug where the interval would be called infinitely
			if(timeouts.repeatIntervalID != null) {
				clearInterval(timeouts.repeatIntervalID);
				timeouts.repeatIntervalID = null;
			}

			//set an interval so it will be repeated every *delay* repeatIntervalID milliseconds is so we can cancel the interval later
			timeouts.repeatIntervalID = setInterval(function() {
				e.source.hasBeenPressed = true;
				//calling the key!
				RequestHandler.callKey(e.source.id, false);
			}, delay);
		} else if(e.source.canBeLong) {
			//slightly more simple here, just having to use the longPressLength variable as the delay we're using a timeout here longPressTimeoutID is so we can eventually cancel the timeout
			timeouts.longPressTimeoutID = setTimeout(function() {
				e.source.hasBeenPressed = true;
				//calling the key!
				RequestHandler.callKey(e.source.id, true);
			}, prefs.longPressLength);
		}
	}

	function on_btn_click(e) {
		//if we're clicking the 'more' button, we have to open a popup window
		if(e.source.id == 'other') {
			//creating the window
			var win_more = Ti.UI.createWindow({
				url: 'subviews/more_buttons.js',
				backgroundColor: Ui.getDarkBackground(),
				navBarHidden: true,
				thisHd: RequestHandler.getHd(),
				thisCode: RequestHandler.getCode(),
				thisModel: RequestHandler.getModel(),
				thisProfile: RequestHandler.getProfile()
			});
			
			win_more.addEventListener('close', function() {
				win_more = null;
			});

			win_more.open({
				modal: true,
				modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL
			});
		} else if(e.source.canBeLong) {
			//if the button press can be long and hasn't been pressed already (by the timeout)
			if(!e.source.hasBeenPressed) {
				//clearing the timeout so it won't be pressed two times
				clearTimeout(timeouts.longPressTimeoutID);
				timeouts.longPressTimeoutID = null;
				//calling the key!
				RequestHandler.callKey(e.source.id, false);
			}
		} else if(e.source.canRepeat) {
			//if the button press can be repeated and hasn't been pressed already (by the interval)
			if(!e.source.hasBeenPressed) {
				//calling the key!
				RequestHandler.callKey(e.source.id, false);
			}

			clearInterval(timeouts.repeatIntervalID);
			timeouts.repeatIntervalID = null;
		} else if(e.source.isLong) {
			//always long if it MUST be a long press
			RequestHandler.callKey(e.source.id, true);
		} else {
			//if it's a basic button, just call the key!
			RequestHandler.callKey(e.source.id, false);
		}
		//hasn't been pressed anymore, heh ?
		e.source.hasBeenPressed = false;
	}
	
	function on_btn_cancel(e) {
		clearInterval(timeouts.repeatIntervalID);
		clearTimeout(timeouts.longPressTimeoutID);
		timeouts.longPressTimeoutID = null;
		timeouts.repeatIntervalID = null;
		e.source.hasBeenPressed = false;
	}

	//the function resets the view so we can update it (to change buttons,..)
	function updateButtons() {
		//those can't be placed above as they are not buttons but labels...
		var lbl_vol = Ti.UI.createLabel({
			text: I('labels.volume'),
			left: 207,
			height: Ti.UI.SIZE,
			top: 73,
			color: 'gray',
			font: {
				fontSize: 14
			}
		}),
		
		lbl_prgm = Ti.UI.createLabel({
			text: I('labels.program'),
			left: 257,
			height: Ti.UI.SIZE,
			top: 73,
			color: 'gray',
			font: {
				fontSize: 14
			}
		}), i;

		view.add(lbl_prgm);
		view.add(lbl_vol);

		//looping through each element of the array
		for(i = 0; i < buttonList.length; i++) {
			var button = Ti.UI.createButton(buttonList[i]);

			button.setFont({
				fontFamily: 'Helvetica Neue',
				fontSize: (button.bFontSize !== undefined) ? button.bFontSize : 19
			});
			
			button.setStyle(Ti.UI.iPhone.SystemButtonStyle.PLAIN);
			button.hasBeenPressed = false;
			
			button.setColor('gray');
			button.setBorderColor('gray');

			//if we're setting the home button, we add an image in it
			if(button.id == 'home') {
				var logo = Ti.UI.createImageView({
					image: '/img/free_logo.png',
					height: 25,
					width: 60
				});
				
				button.add(logo);
			}

			//if we're setting one of the colored buttons, we change their properties
			if(button.isColor) {
				if(button.id == 'red') {
					button.setBackgroundColor('#e20f07');
				} else if(button.id == 'yellow') {
					button.setBackgroundColor('#e7d52a');
				} else if(button.id == 'blue') {
					button.setBackgroundColor('#058cf5');
				} else if(button.id == 'green') {
					button.setBackgroundColor('#5fb40d');
				}

				var img_button = Ti.UI.createImageView({
					image: '/img/fbx_rev_overlay_' + button.id + '.png',
					height: 35,
					width: 35,
					touchEnabled: false
				});
				
				button.add(img_button);
			} else {
				//else, we change it to the default ones
				button.setBorderRadius(10);
				button.setSelectedColor('#2f2f2f');
			}
			
			if(button.isDigit || button.isArrow) {
				button.setBorderRadius(button.height / 2);
			}

			if(button.isArrow) {
				var img_button = Ti.UI.createImageView({
					image: '/img/arrow_' + button.id + '.png',
					height: 20,
					width: 20
				});
				
				button.add(img_button);
			} else if(button.id == 'play') {
				var img_button = Ti.UI.createImageView({
					image: '/img/play_pause.png',
					height: 20,
					width: 20,
					top: 6
				});
				
				button.add(img_button);
			} else if(button.id == 'rec') {
				var img_button = Ti.UI.createImageView({
					image: '/img/rec.png',
					height: 20,
					width: 20,
					top: 6
				});
				
				button.add(img_button);
			} else if(button.id == 'stop') {
				var img_button = Ti.UI.createImageView({
					image: '/img/stop.png',
					height: 20,
					width: 20,
					top: 6
				});
				
				button.add(img_button);
			}

			if(button.id == 'power') {
				var img_button = Ti.UI.createImageView({
					image: '/img/power.png',
					height: 20,
					width: 20,
					touchEnabled: false
				});
				
				button.add(img_button);
			}

			//if it's a volume/program button, we use the properties set by the user to determine if the press can be repeated as long as the user is pressing the button
			if(button.id == 'vol_inc' || button.id == 'vol_dec') {
				button.canRepeat = prefs.volumeRepeat;
			} else if(button.id == 'prgm_inc' || button.id == 'prgm_dec') {
				button.canRepeat = prefs.progRepeat;
			}

			//if the button press can be long, we use the properties to determine if the user WANTS it to be long
			if(button.canBeLong && !prefs.longPress) {
				button.canBeLong = false;
			}

			button.addEventListener('touchstart', on_btn_touchstart);
			button.addEventListener('touchend', on_btn_cancel);
			button.addEventListener('singletap', on_btn_click);
			button.addEventListener('touchcancel', on_btn_cancel);

			view.add(button);
		}
	}
	
	function loadPrefs() {
		//checking for new data the user may have modified
		prefs.volumeRepeat = Ti.App.Properties.getBool('volume.repeat', true);
		prefs.volumeRepeatFrequency = Ti.App.Properties.getInt('volume.repeat.frequency', 200);
		prefs.progRepeat = Ti.App.Properties.getBool('program.repeat', false);
		prefs.progRepeatFrequency = Ti.App.Properties.getInt('program.repeat.frequency', 300);
		prefs.longPress = Ti.App.Properties.getBool('longpress', true);
		prefs.longPressLength = Ti.App.Properties.getInt('longpress.length', 600);
		
		RequestHandler.setProfile(Ti.App.Properties.getInt('profileToUse', Profile.PROFILE_1));
		RequestHandler.setHd(Ti.App.Properties.getInt('profile' + RequestHandler.getProfile() + '.hd', HD.HD_1));
		RequestHandler.setCode(Ti.App.Properties.getString('profile' + RequestHandler.getProfile() + '.code', ''));
		RequestHandler.setModel(Ti.App.Properties.getInt('profile' + RequestHandler.getProfile() + '.model', Model.FREEBOX_HD));

		//updating the tabbed bar to reflect the new profile
		tabbedBar.index = RequestHandler.getProfile() - 1;
	}
	
	loadPrefs();
	updateButtons();
	
	win.addEventListener('focus', loadPrefs);
	
})();
