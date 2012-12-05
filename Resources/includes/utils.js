exports.getFullDate = function() {
	var date = new Date();

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();

	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	if(hours < 10) {
		hours = "0" + hours;
	}
	if(minutes < 10) {
		minutes = "0" + minutes;
	}

	var datestr = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
	return datestr;
}

exports.getChannelID = function(channel) {
	var id;
	switch(channel) {
		case 'TF1':
			id = 1;
			break;
		case 'France 2':
			id = 2;
			break;
		case 'France 3':
			id = 3;
			break;
		case 'Canal+':
			id = 4;
			break;
		case 'Arte':
			id = 7;
			break;
		case 'M6':
			id = 6;
			break;
		case 'France 4':
			id = 14;
			break;
		case 'France 5':
			id = 5;
			break;
		case 'D8':
			id = 8;
			break;
		case 'W9':
			id = 9;
			break;
		case 'TMC':
			id = 10;
			break;
		case 'NT1':
			id = 11;
			break;
		case 'NRJ12':
			id = 12;
			break;
		case 'LCP':
			id = 13;
			break;
		case 'BFM TV':
			id = 15;
			break;
		case 'i>TELE':
			id = 16;
			break;
		case 'D17':
			id = 17;
			break;
		case 'Gulli':
			id = 18;
			break;
		case 'France Ô':
			id = 19;
			break;
		case 'HD1':
			id = 20;
		case 'L\'Equipe 21':
			id = 21;
			break;
		case '6ter':
			id = 22;
			break;
		case 'Numéro 23':
			id = 23;
			break;
		case 'RMC Découverte':
			id = 24;
			break;
		case 'Chérie 25':
			id = 25;
			break;
		case 'RTL9':
			id = 28;
			break;
		case 'Vivolta':
			id = 38;
			break;
		case 'AB1':
			id = 39;
			break;
		case 'Disney Channel':
			id = 48;
			break;
		case 'NRJ Hits':
			id = 59;
			break;
		case 'Clubbing TV':
			id = 72;
			break;
		case 'BeBlack':
			id = 78;
			break;
		case 'O Five':
			id = 79;
			break;
		case 'BFM Business':
			id = 80;
			break;
		case 'Euronews':
			id = 82;
			break;
		case 'Bloomberg':
			id = 83;
			break;
		case 'Al Jazeera':
			id = 85;
			break;
		case 'Sky News':
			id = 87;
			break;
		case 'Guysen TV':
			id = 88;
			break;
		case 'CNBC':
			id = 89;
			break;
		case 'MCE':
			id = 93;
			break;
		case 'France 24':
			id = 95;
			break;
		case 'Game One':
			id = 118;
			break;
		case 'Game One Music':
			id = 119;
			break;
		case 'Lucky Jack':
			id = 121;
			break;
		case 'Men\'s up':
			id = 122;
			break;
		case 'Nolife':
			id = 123;
			break;
		case 'Fashion TV':
			id = 131;
			break;
		case 'World Fashion':
			id = 132;
			break;
		case 'Allocine':
			id = 133;
			break;
		case 'Equidia Live':
			id = 137;
			break;
		case 'Equidia Life':
			id = 138;
			break;
		case 'Renault TV':
			id = 139;
			break;
		case 'AB Moteurs':
			id = 143;
			break;
		case 'Poker Channel':
			id = 145;
			break;
		case 'Liberty TV':
			id = 154;
			break;
		case 'Montagne TV':
			id = 156;
			break;
		case 'Luxe.TV':
			id = 157;
			break;
		case 'Demain TV':
			id = 163;
			break;
		case 'KTO':
			id = 164;
			break;
		case 'Wild Earth':
			id = 166;
			break;
		case 'TNA':
			id = 168;
			break;
		case 'Souvenirs from Earth':
			id = 169;
			break;
		case 'Penthouse':
			id = 176;
			break;
		case 'M6 Boutique':
			id = 191;
			break;
		case 'Best of Shopping':
			id = 193;
			break;
		case 'Astro Center':
			id = 195;
			break;
		case 'Radio':
			id = 199;
			break;
		case 'C+ Cinéma':
			id = 41;
			break;
		case 'C+ Sport':
			id = 42;
			break;
		case 'C+ Décalé':
			id = 43;
			break;
		case 'C+ Family':
			id = 44;
			break;
		default:
			Ti.API.error('could not find channel ID for ' + channel);
			id = null;
			break;
	}

	return id;
}
//used to get the string equivalent of a given freebox model
exports.getModelString = function(model) {
	if(model == Model.FREEBOX_HD) {
		return 'Freebox HD';
	} else if(model == Model.FREEBOX_REVOLUTION) {
		return 'Freebox Révolution';
	} else if(model == Model.FREEBOX_PLAYER) {
		return 'Freebox Player';
	} else {
		return 'Unknow model';
	}
}

exports.capitalize = function(string) {
	return string.toLowerCase().charAt(0).toUpperCase() + string.toLowerCase().slice(1);
};

exports.confCheck = function(tabGroup) {
	if(Ti.Network.networkType != Ti.Network.NETWORK_WIFI) {
		var alert = Ti.UI.createAlertDialog({
			title: I('network.message.title'),
			message: I('network.message.message', Ti.App.name) + ' (E' + Error.NETWORK + ')',
			buttonNames: [I('network.buttons.ok')]
		});

		alert.show();
	} else if(!Ti.App.Properties.getBool('hasBeenSet', false)) {
		var alert = Ti.UI.createAlertDialog({
			title: I('welcome.message.title'),
			message: I('welcome.message.message', Ti.App.name),
			buttonNames: [I('welcome.buttons.no'), I('welcome.buttons.yes')],
			cancel: 0
		});

		alert.show();

		alert.addEventListener('click', function(e) {
			if(e.index == 1) {
				var helpwin = Ti.UI.createWindow({
					url: '/views/subviews/options/options.js',
					title: I('labels.options'),
					backgroundColor: '#d8d8d8',
					barColor: '#464646'
				});

				tabGroup.tabs[3].open(helpwin);
				tabGroup.setActiveTab(3);
			}
		});
	}
}