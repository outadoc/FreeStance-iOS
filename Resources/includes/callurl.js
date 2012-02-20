Ti.include('enums.js');
Ti.include('utils.js');

var hd, code, profile;

//can call any key, but it must be formatted as in the freebox API
function callKey(key, isLong, hd, code, model, profile)
{
	//checking if we call the function with already set config values; if we don't, get them
	if(profile === undefined) {
		profile = Ti.App.Properties.getString('profileToUse', Profile.PROFILE_1);
	} if(hd === undefined) {
		hd = Ti.App.Properties.getString('profile' + profile + '.hd', HD.HD_1);
	} if(code === undefined) {
		code = Ti.App.Properties.getString('profile' + profile + '.code', '');
	} if(model === undefined) {
		model = Model.FREEBOX_HD;
	}
	
	var xhr = Ti.Network.createHTTPClient();

	if(!Ti.App.Properties.getBool('debugmode', false)) {
		//this is the url used for calling remote keys, as specified in the API
		xhr.open('GET', 'http://' + 'hd' + hd + '.freebox.fr/pub/remote_control?code=' + code + '&key=' + key + '&long=' + isLong.toString(), true);
		xhr.send(null);
	}
	else {
		//if debugging, show the information that was about to be sent
		Ti.API.info('requested call for profile:' + profile + ', hd:' + hd + ', code:' + code + ', key:' + key + ', long:' + isLong.toString() + ', model:' + getModelString(model) + '; the app is in debug mode so the request was not treated');
	}
}

//can call a precise channel (1 digit or more)
function callMultiKeys(channel, hd, code, model, profile)
{
	//we check the digits one by one using a loop, as you need to call all the first digits with a long press and the last with a short one
	for(var i = 0;i < (channel.length);i++) {
		//if this is the last digit of the number, call it as a short press
		if(i == (channel.length - 1)) {
			callKey(channel.charAt(i), false, hd, code, model, profile);
		} else {
			callKey(channel.charAt(i), true, hd, code, model, profile);
		}
	}
}