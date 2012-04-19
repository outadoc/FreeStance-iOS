function isIpad()
{
	var model = Ti.Platform.osname;
	if(model == 'ipad') {
		return true;
	} else {
		return false;
	}
}

function isIphone()
{
	var model = Ti.Platform.osname;
	if(model == 'iphone') {
		return true;
	} else {
		return false;
	}
}

function getDefaultBackground()
{
	var model = Ti.Platform.osname;
	if(isIphone()) {
		return 'stripped';
	} else if(isIpad()) {
		return '#d8dae0';
	} else {
		return null;
	}
}

function createLoadingWindow()
{
	var timeoutID;

	var win = Ti.UI.createWindow({
		width:320,
		height:480,
		orientationModes:[Ti.UI.PORTRAIT]
	});

	var view = Ti.UI.createView({
		height:60,
		width:60,
		borderRadius:10,
		backgroundColor:'#000',
		opacity:0.6
	});

	win.add(view);

	win.addEventListener('open', function(e)
	{
		timeoutID = setTimeout(function()
		{
			win.close();
		}, 10000);
	});


	win.addEventListener('close', function(e)
	{
		clearTimeout(timeoutID);
	});

	var spinWheel = Ti.UI.createActivityIndicator({
		style:Ti.UI.iPhone.ActivityIndicatorStyle.BIG
	});

	view.add(spinWheel);
	spinWheel.show();

	return win;
}

//just a few UI elements, so they can be used painlessly
function getFlexibleSpace()
{
	return Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
}

function getFixedSpace(width)
{
	return Ti.UI.createButton({
		systemButton:Ti.UI.iPhone.SystemButton.FIXED_SPACE,
		width:width
	});
}

function getDestructionView(title)
{
	var b_destruction = Ti.UI.createButton({
		backgroundImage:'/img/big_red_button.png',
		top:10,
		height:45,
		width:300
	});

	var lbl_title = Ti.UI.createLabel({
		text:title,
		shadowColor:'#8c2a31',
		shadowOffset: {
			x:0,
			y:-1
		},
		font: {
			fontSize:19,
			fontWeight:'bold',
			fontFamily:'Helvetica Neue'
		},
		color:'white',
		width:300,
		textAlign:'center'
	});

	b_destruction.add(lbl_title);
	var view = Ti.UI.createView({
		height:b_destruction.height + 30
	});

	view.add(b_destruction);

	return view;
}