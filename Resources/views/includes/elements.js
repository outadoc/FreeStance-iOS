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
		backgroundImage:'../../img/big_red_button.png',
		top:10,
		height:45,
		width:300
	});
	
	var lbl_title = Ti.UI.createLabel({
		text:title,
		shadowColor:'#8c2a31',
		shadowOffset:{x:0,y:-1},
		font:{fontSize:19, fontWeight:'bold', fontFamily:'Helvetica Neue'},
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