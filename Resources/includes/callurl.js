var Utils = require('includes/utils');
Ti.include('/includes/enums.js');

var hd, code, model, profile;

//can call any key, but it must be formatted as in the freebox API
exports.callKey = function(key, isLong) {
	//checking if we call the function with already set config values; if we don't, get them
	if(this.profile == null) {
		this.profile = Ti.App.Properties.getString('profileToUse', Profile.PROFILE_1);
	} if(this.hd == null) {
		this.hd = Ti.App.Properties.getString('profile' + this.profile + '.hd', HD.HD_1);
	} if(this.code == null) {
		this.code = Ti.App.Properties.getString('profile' + this.profile + '.code', '');
	} if(this.model == null) {
		this.model = Model.UNKNOWN;
	}

	var xhr = Ti.Network.createHTTPClient();

	if(!Ti.App.Properties.getBool('debugmode', false)) {
		//this is the url used for calling remote keys, as specified in the API
		xhr.open('GET', 'http://' + 'hd' + this.hd + '.freebox.fr/pub/remote_control?code=' + this.code + '&key=' + key + '&long=' + isLong.toString(), true);
		xhr.send(null);
	} else {
		//if debugging, show the information that was about to be sent
		Ti.API.info('requested call for profile:' + this.profile + ', hd:' + this.hd + ', code:' + this.code + ', key:' + key + ', long:' + isLong.toString() + ', model:' + Utils.getModelString(this.model));
	}
}

//can call a precise channel (1 digit or more)
exports.callMultiKeys = function(channel) {
	//we check the digits one by one using a loop, as you need to call all the first digits with a long press and the last with a short one
	for(var i = 0; i < (channel.length); i++) {
		//if this is the last digit of the number, call it as a short press
		if(i == (channel.length - 1)) {
			this.callKey(channel.charAt(i), false);
		} else {
			this.callKey(channel.charAt(i), true);
		}
	}
}

//getters
exports.getHd = function() {
	return this.hd;
}

exports.getCode = function() {
	return this.code;
}

exports.getModel = function() {
	return this.model;
}

exports.getProfile = function() {
	return this.profile;
}

//setters
exports.setHd = function(value) {
	this.hd = value;
}

exports.setCode = function(value) {
	this.code = value;
}

exports.setModel = function(value) {
	this.model = value;
}

exports.setProfile = function(value) {
	this.profile = value;
}