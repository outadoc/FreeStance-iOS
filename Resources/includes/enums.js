//enumerations for the config settings, more clear when you read the code for the model...
var Model = {
	FREEBOX_HD: 1,
	FREEBOX_REVOLUTION: 2,
	FREEBOX_PLAYER: 2.1,
	UNKNOWN: 0
};

//the profile...
var Profile = {
	PROFILE_1: 1,
	PROFILE_2: 2,
	PROFILE_3: 3
};

//...and the box id
var HD = {
	HD_1: 1,
	HD_2: 2,
	HD_3: 3
};

var EPG = {
	NOW: 0,
	TONIGHT: 1,
	NOW_URL: 'http://www.zap-programme.fr/rss/rss.php?bouquet=2&day=now',
	TONIGHT_URL: 'http://www.zap-programme.fr/rss/rss.php?bouquet=2'
};

var Error = {
	NETWORK: 943,
	SERVER: 944,
	UNKNOWN: 945
};
