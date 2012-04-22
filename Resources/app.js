Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/utils.js');
Ti.include('/includes/ui.js');
Ti.include('/includes/enums.js');

var tabGroup = Ti.UI.createTabGroup();

var win1 = Ti.UI.createWindow({
	url:'views/index.js',
	backgroundImage:'/img/remotebg.png',
	navBarHidden:true,
	orientationModes:[Ti.UI.PORTRAIT],
	barColor:'#464646'
});

var win2 = Ti.UI.createWindow({
	url:'views/mosaic.js',
	barColor:'#464646',
	backgroundImage:'/img/remotebg.png',
	orientationModes:[Ti.UI.PORTRAIT]
});

var win3 = Ti.UI.createWindow({
	url:'views/epg.js',
	backgroundColor:'#fff',
	barColor:'#464646',
	orientationModes:[Ti.UI.PORTRAIT]
});

var win4 = Ti.UI.createWindow({
	title:I('labels.more'),
	url:'views/more.js',
	barColor:'#464646',
	backgroundColor:getDefaultBackground(),
	orientationModes:[Ti.UI.PORTRAIT]
});

//add tabs
var tab1 = Ti.UI.createTab({
	icon:'/img/remote.png',
	title:Ti.App.name,
	window:win1
});

var tab2 = Ti.UI.createTab({
	icon:'/img/planet.png',
	title:I('labels.mosaic'),
	window:win2
});

var tab3 = Ti.UI.createTab({
	icon:'/img/tv.png',
	title:I('labels.epg'),
	window:win3
});

var tab4 = Ti.UI.createTab({
	icon:'img/gear.png',
	title:I('labels.more'),
	window:win4
});

tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.addTab(tab4);

Ti.UI.setOrientation(Ti.UI.PORTRAIT);
tabGroup.open();

if(!Ti.App.Properties.getBool('hasBeenSet', false)) {
	var alert = Ti.UI.createAlertDialog({
		title:I('welcome.message.title'),
		message:I('welcome.message.message', Ti.App.name),
		buttonNames:[I('welcome.buttons.no'), I('welcome.buttons.yes')],
		cancel:0
	});

	alert.show();

	alert.addEventListener('click', function(e) {
		if(e.index == 1) {
			var helpwin = Ti.UI.createWindow({
				url:'views/subviews/options/options.js',
				title:I('labels.options'),
				backgroundColor:'stripped',
				barColor:'#464646'
			});

			tab4.open(helpwin);
			tabGroup.setActiveTab(3);
		}
	});

}

if(Ti.Network.networkType != Ti.Network.NETWORK_WIFI) {
	var alert = Ti.UI.createAlertDialog({
		title:I('network.message.title'),
		message:I('network.message.message', Ti.App.name) + ' (E' + Error.NETWORK + ')',
		buttonNames:[I('network.buttons.ok')]
	});

	alert.show();
} else {
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
			if(this.getStatusCode() == 200) {
				var motd = this.responseText;
				motd = JSON.parse(motd);

				if(motd != null) {
					try {
						if(Ti.App.Properties.getString('lastMotd') != motd.id) {
							var motdAlert = Ti.UI.createAlertDialog({
								title:motd.title,
								message:motd.message,
								buttonNames:[motd.buttons.cancel, motd.buttons.accept],
								cancel:0
							});
							motdAlert.show();

							motdAlert.addEventListener('click', function(e) {
								if(e.index == 1 && motd.url !== null) {
									var w = Ti.UI.createWindow({
										url:'views/subviews/website.js',
										isModalWin:true,
										thisUrl:motd.url,
										barColor:'#464646'
									});

									w.open({
										modal:true
									});
								}
							});

							Ti.App.Properties.setString('lastMotd', motd.id);
						}
					} catch(e) {
					}
				}
			}
		}
	});

	xhr.open('GET', 'http://dev.outadoc.fr/freestance/motd.json');
	xhr.send();
}