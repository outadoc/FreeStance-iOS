Ti.include('/includes/lib/json.i18n.js');

win = Ti.UI.currentWindow,

scrollView = Ti.UI.createScrollView({
	height: Ti.UI.FILL,
	width: Ti.UI.FILL,
	layout: 'vertical',
	contentHeight: 'auto'
}),

img_logo = Ti.UI.createImageView({
	image: '/img/icon-large.png',
	top: 10,
	width: 130
}),

lbl_app = Ti.UI.createLabel({
	text: Ti.App.getName() + ' v' + Ti.App.getVersion(),
	top: 0,
	color: '#656565',
	font: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	shadowColor: 'white',
	shadowOffset: {
		x: 0,
		y: 1
	}
}),

lbl_credits = Ti.UI.createLabel({
	text: I('more.credits.developer') + ' Baptiste Candellier (outadoc) for outa[dev]\n\n' + I('more.credits.platform') + ' Appcelerator Titanium\n\n' + I('more.credits.modules') + ' ShareKit par 0x82\n\nFree et Freebox sont des marques déposées de Illiad S.A.\nLes guides des programmes de la journée et de la soirée sont fournis par Zap-Programme.fr.\nCertaines icônes sont fournies par Sallee Design.\nIMDb (Internet Movie Database) est une marque déposée de Amazon.com, Inc.\nLes logos de chaînes de télévision des bouquets TNT et Freebox sont les propriétés de leurs sociétés respectives.',
	font: {
		fontSize: 15
	},
	color: '#707070',
	shadowColor: 'white',
	shadowOffset: {
		x: 0,
		y: 1
	},
	width: 280,
	top: 15,
	height: Ti.UI.SIZE,
	textAlign: 'center'
}),

img_outadev = Ti.UI.createImageView({
	image: '/img/outadev.png',
	top: 20,
	bottom: 20,
	height: Ti.UI.SIZE
});

win.add(scrollView);
scrollView.add(img_logo);
scrollView.add(lbl_app);
scrollView.add(lbl_credits);

img_outadev.addEventListener('click', function(e) {
	Ti.Platform.openURL('http://dev.outadoc.fr');
});

scrollView.add(img_outadev);
