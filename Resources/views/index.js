Ti.include('includes/callurl.js');
Ti.include('includes/lib/json.i18n.js');
Ti.include('includes/ui.js');

//the properties for the current profile
var profile, model, hd, code;
//advanced options
var volumeRepeat, volumeRepeatFrequency, progRepeat, progRepeatFrequency, longPress, longPressLength;

var win = Ti.UI.currentWindow;
var loadingWin = createLoadingWindow(100);
loadingWin.open();

//a tabbed bar used to select the profile the user wants to use
var tabbedBar = Ti.UI.iOS.createTabbedBar({
	labels:[I('profile.1'), I('profile.2'), I('profile.3')],
	style:Ti.UI.iPhone.SystemButtonStyle.BAR,
	bottom:7,
	height:'30',
	width:'300',
	backgroundColor:'#787878'
});

tabbedBar.addEventListener('click', function(e)
{
	//setting the new profile to use
	Ti.App.Properties.setInt('profileToUse', e.index + 1);
	//updating the buttons so they can adapt themselves to the new profile
	updateButtons();
});

//setting the toolbar
win.setToolbar([getFlexibleSpace(), tabbedBar, getFlexibleSpace()], {animated:false});

//creating the window
var win_more = Ti.UI.createWindow({
	url:'subviews/more_buttons.js',
	height:480,
	width:320,
	orientationModes:[Ti.UI.PORTRAIT],
	thisHd:hd,
	thisCode:code,
	thisModel:model,
	thisProfile:profile,
	shadowController:win.shadowController
});

/*
//make the window as small as possible
var t = Ti.UI.create2DMatrix();
t = t.scale(0);

//then scale it to 1.1 times its original size
var t1 = Ti.UI.create2DMatrix();
t1 = t1.scale(1.1);

//create an animation with that that will last 0.1 second
var a = Ti.UI.createAnimation({
	transform:t1,
	duration:100
});

a.addEventListener('complete', function() {
	//when scaled to 1.1, scale it back to its original size
	var t2 = Ti.UI.create2DMatrix();
	t2 = t2.scale(1.0);

	win_more.animate({
		transform:t2,
		duration:100
	});
});
*/

//the function resets the view so we can update it (to change buttons,..)
function updateButtons()
{
	//resetting the view
	view = Ti.UI.createView();
	
	//getting fresh values for the properties each time we're calling the function
	profile = Ti.App.Properties.getInt('profileToUse', Profile.PROFILE_1);
	hd = Ti.App.Properties.getString('profile' + profile + '.hd', HD.HD_1);
	code = Ti.App.Properties.getString('profile' + profile + '.code', '');
	model = Ti.App.Properties.getInt('profile' + profile + '.model', Model.FREEBOX_HD);
	
	//the buttons and their placing
	var buttonList = [
		{id:'red', height:35, width:35, left:37, top:25, canBeLong:false, isColor:true},
		{id:'up', height:40, width:40, left:77, top:20, canBeLong:false, isArrow:true},
		{id:'blue', height:35, width:35, left:122, top:25, canBeLong:false, isColor:true},
		{id:'left', height:40, width:40, left:32, top:65, canBeLong:false, isArrow:true},
		{title:I('buttons.ok'), id:'ok', height:40, width:40, left:77, top:65, canBeLong:false},
		{id:'right', height:40, width:40, left:122, top:65, canBeLong:false, isArrow:true},
		{id:'green', height:35, width:35, left:37, top:110, canBeLong:false, isColor:true},
		{id:'down', height:40, width:40, left:77, top:110, canBeLong:false, isArrow:true},
		{id:'yellow', height:35, width:35, left:122, top:110, canBeLong:false, isColor:true},
		
		{title:'+', id:'vol_inc', height:50, width:40, left:200, top:23, font:{fontSize:22}, canRepeat:true},
		{title:'-', id:'vol_dec', height:50, width:40, left:200, top:93, font:{fontSize:28}, canRepeat:true},
		{title:'+', id:'prgm_inc', height:50, width:40, left:255, top:23, font:{fontSize:22}, canRepeat:false},
		{title:'-', id:'prgm_dec', height:50, width:40, left:255, top:93, font:{fontSize:28}, canRepeat:false},
		
		{title:'1', id:'1', height:35, width:45, left:20, top:175, canBeLong:true},
		{title:'2', id:'2', height:35, width:45, left:75, top:175, canBeLong:true},
		{title:'3', id:'3', height:35, width:45, left:130, top:175, canBeLong:true},
		{title:'4', id:'4', height:35, width:45, left:20, top:220, canBeLong:true},
		{title:'5', id:'5', height:35, width:45, left:75, top:220, canBeLong:true},
		{title:'6', id:'6', height:35, width:45, left:130, top:220, canBeLong:true},
		{title:'7', id:'7', height:35, width:45, left:20, top:265, canBeLong:true},
		{title:'8', id:'8', height:35, width:45, left:75, top:265, canBeLong:true},
		{title:'9', id:'9', height:35, width:45, left:130, top:265, canBeLong:true},
		{title:' ←', id:'back', height:35, width:45, left:20, top:310, font:{fontSize:23}, canBeLong:false},
		{title:'0', id:'0', height:35, width:45, left:75, top:310, canBeLong:true},
		{title:'↻', id:'swap', height:35, width:45, left:130, top:310, canBeLong:true},
		
		{id:'power', height:35, width:95, left:200, top:175, canBeLong:false},
		{id:'home', height:35, width:95, left:200, top:220, canBeLong:true},
		{title:I('buttons.mute'), id:'mute', height:35, width:95, left:200, top:265, canBeLong:false},
		{title:'...', id:'other', height:35, width:95, left:200, top:310, canBeLong:false}
	];
	
	//those can't be placed above as they are not buttons but labels...
	var lbl_vol = Ti.UI.createLabel({text:I('labels.volume'), left:207, height:'auto', top:73, color:'white', font:{fontSize:14}});
	var lbl_prgm = Ti.UI.createLabel({text:I('labels.program'), left:257, height:'auto', top:73, color:'white', font:{fontSize:14}});
	
	view.add(lbl_prgm);
	view.add(lbl_vol);
	
	//looping through each element of the array
	for(var i=0; i<buttonList.length; i++)
	{
		var hasBeenPressed;
		var repeatIntervalID;
		var longPressTimeoutID;
		
		var button = Ti.UI.createButton(buttonList[i]);
		
		//if we're setting the home button, we add an image in it
		if(button.id == 'home')
		{
			var logo = Ti.UI.createImageView({
				image:'../img/free_logo.png',
				height:25
			});
			button.add(logo);
		}

		//if we're setting one of the colored buttons, we change their properties
		if(button.isColor) {
			button.setBackgroundImage('../img/button_' + button.id + '.png');
			button.setBackgroundSelectedImage('../img/button_' + button.id + '_selected.png');
			
			if(button.id == 'red') {
				button.setBorderColor('#e20f07');
			} else if(button.id == 'yellow') {
				button.setBorderColor('#e1c400');
			} else if(button.id == 'blue') {
				button.setBorderColor('#058cf5');
			} else if(button.id == 'green') {
				button.setBorderColor('#5fb40d');
			}
			
			//if it's a freebox hd, we just change the button title to the corresponding letter
			if(model == Model.FREEBOX_HD)
			{
				if(button.id == 'red') {
					button.setTitle('B');
				} else if(button.id == 'yellow') {
					button.setTitle('Y');
				} else if(button.id == 'blue') {
					button.setTitle('X');
				} else if(button.id == 'green') {
					button.setTitle('A');
				}
			} else if(model == Model.FREEBOX_REVOLUTION) {//...and if it's a freebox révolution, we add an image in it
				var img_button = Ti.UI.createImageView({
					image:'../img/fbx_rev_overlay_' + button.id + '.png',
					height:35,
					width:35,
					touchEnabled:false
				});
				button.add(img_button);
			}
		} else { //else, we change it to the default ones
			button.setBackgroundImage('../img/button.png');
			button.setBackgroundSelectedImage('../img/button_selected.png');
			button.setBorderColor('gray');
		}
		
		if(button.isArrow)
		{
			var img_button = Ti.UI.createImageView({
				image:'../img/arrow_' + button.id + '.png',
				height:20,
				width:20
			});
			button.add(img_button);
		}
		
		if(button.id == 'power')
		{
			var img_button = Ti.UI.createImageView({
				image:'../img/power.png',
				height:20,
				width:20,
				touchEnabled:false
			});
			button.add(img_button);
		}
		
		//if it's a volume/program button, we use the properties set by the user to determine if the press can be repeated as long as the user is pressing the button
		if(button.id == 'vol_inc' || button.id == 'vol_dec') {
				button.canRepeat = volumeRepeat;
		} if(button.id == 'prgm_inc' || button.id == 'prgm_dec') {
				button.canRepeat = progRepeat;
		}
		
		//if the button press can be long, we use the properties to determine if the user WANTS it to be long
		if(button.canBeLong) {
			button.canBeLong = longPress;
		}
		
		win.shadowController.Shadow(button, {
			shadowRadius:1,
			shadowOpacity:0.5,
			shadowOffset:{x:1, y:1}
		});
		
		button.addEventListener('touchstart', function(e)
		{
			//if the button press can be repeated as long as the user keeps pressing it the functionnality is compatible only with the volume and program buttons
			if(e.source.canRepeat)
			{
				var delay;
				//if it's one of the volume buttons, get the volume repeat frequency
				if(e.source.id == 'vol_inc' || e.source.id == 'vol_dec') {
					delay = volumeRepeatFrequency;
				}
				//else if it's one of the program buttons, get the program repeat frequency
				else if(e.source.id == 'prgm_inc' ||e.source.id == 'prgm_dec') {
					delay = progRepeatFrequency;
				}
				//else, if it's not a volume button nor a program button
				else {
					delay = 200;
				}
				
				//the freebox révolution volume button needs a shorter frequency than the freebox hd one
				if(model == Model.FREEBOX_REVOLUTION && (e.source.id == 'vol_inc' || e.source.id == 'vol_dec')) {
					delay*=0.5;
				}
				
				//set an interval so it will be repeated every *delay* milliseconds repeatIntervalID is so we can cancel the interval later
				repeatIntervalID = setInterval(function(){
					hasBeenPressed = true;
					//calling the key!
					callKey(e.source.id, false, hd, code, model, profile);
				}, delay);
			}
			else if(e.source.canBeLong)
			{
				//slightly more simple here, just having to use the longPressLength variable as the delay we're using a timeout here longPressTimeoutID is so we can eventually cancel the timeout
				longPressTimeoutID = setTimeout(function(){
					//calling the key!
					callKey(e.source.id, true, hd, code, model, profile);
					hasBeenPressed = true;
				}, longPressLength);
			}
		});
		
		//two events with the same callback, as touchend and touchcancel are quite the same
		button.addEventListener('click', onTouchEnd);
		button.addEventListener('touchcancel', onTouchEnd);
		
		function onTouchEnd(e)
		{
			//if we're clicking the 'more' button, we have to open a popup window
			if(e.source.id == 'other')
			{
				win_more.setTop(-320);
				win_more.open({top:'auto', duration:500});
			}
			
			else if(e.source.canBeLong)
			{
				//if the button press can be long and hasn't been pressed already (by the timeout)
				if(!hasBeenPressed)
				{
					//clearing the timeout so it won't be pressed two times
					clearTimeout(longPressTimeoutID);
					longPressTimeoutID = null;
					//calling the key!
					callKey(e.source.id, false, hd, code, model, profile);
				}
			}
			
			else if(e.source.canRepeat)
			{
				//if the button press can be repeated and hasn't been pressed already (by the interval)
				if(!hasBeenPressed)
				{
					//calling the key!
					callKey(e.source.id, false, hd, code, model, profile);
				}
				clearInterval(repeatIntervalID);
				repeatIntervalID = null;
			}
			
			else
			{
				//if it's a basic button, just call the key!
				callKey(e.source.id, false, hd, code, model, profile);
			}
			//hasn't been pressed anymore, heh ?
			hasBeenPressed = null;
		}
		view.add(button);
	}
	
	loadingWin.close();
	win.add(view);
}

win.addEventListener('focus', function(e)
{
	//on focus, we're checking for new data the user may have modified
	volumeRepeat = Ti.App.Properties.getBool('volume.repeat', true);
	volumeRepeatFrequency = Ti.App.Properties.getInt('volume.repeat.frequency', 200);
	progRepeat = Ti.App.Properties.getBool('program.repeat', false);
	progRepeatFrequency = Ti.App.Properties.getInt('program.repeat.frequency', 300);
	longPress = Ti.App.Properties.getBool('longpress', true);
	longPressLength = Ti.App.Properties.getInt('longpress.length', 600);
	
	//updating the buttons; the user can also have change the profile to use
	updateButtons();
	//updating the tabbed bar to reflect the new profile
	tabbedBar.index = profile - 1;
});