(function() {
	Ti.include('/includes/enums.js');
	
	var Utils = require('includes/utils'),
	
	hd, code, model, profile;
	
	//can call any key, but it must be formatted as in the freebox API
	exports.callKey = function(key, isLong, callback, nextKey) {
		//checking if we call the function with already set config values; if we don't, get them
		if(this.profile == null) {
			this.profile = Ti.App.Properties.getString('profileToUse', Profile.PROFILE_1);
		}
		if(this.hd == null) {
			this.hd = Ti.App.Properties.getString('profile' + this.profile + '.hd', HD.HD_1);
		}
		if(this.code == null) {
			this.code = Ti.App.Properties.getString('profile' + this.profile + '.code', '');
		}
		if(this.model == null) {
			this.model = Model.UNKNOWN;
		}
		if(callback === undefined) {
			callback = function(){};
		}
	
		if(!Ti.App.Properties.getBool('debugmode', false)) {
			var xhr = Ti.Network.createHTTPClient({
				timeout: 3000,
				cache: false
			});
			
			//this is the url used for calling remote keys, as specified in the API
			xhr.open('GET', 'http://' + 'hd' + this.hd + '.freebox.fr/pub/remote_control');
			xhr.send({
				code: this.code,
				key: key,
				long: isLong
			});
			
			setTimeout(callback, (nextKey === key) ? 1250 : 700);
		} else {
			//if debugging, show the information that was about to be sent
			Ti.API.info('requested call for profile:' + this.profile + ', hd:' + this.hd + ', code:' + this.code + ', key:' + key + ', long:' + isLong.toString() + ', model:' + Utils.getModelString(this.model));
			callback();
		}
	}
	//can call a precise channel (1 digit or more)
	exports.callMultiKeys = function(channel) {
		//if there's only one digit, call it simply
		if(channel.length == 1) {
			exports.callKey(channel.charAt(0), false);
		} else {
			//if there's more than one digit, call the first one
			exports.callKey(channel.charAt(0), true, function() {
				//and when it's done, call the same function with only the remaining digits
				exports.callMultiKeys(channel.substr(1));
			}, channel.charAt(1));
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
})();