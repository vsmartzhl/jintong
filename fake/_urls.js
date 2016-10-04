
var urlFake = {
	/* 用户相关 */
    "/i/register": "fake/login.json", 
	"/i/login": "fake/login.json", 
    "/i/logout": "fake/login.json", 
    "/code/send": "fake/code.json",
	
	
    "allow": "fake/allow.json", 
    "getCode": "fake/code.json", 
    "resetPwd": "fake/resetpwd.json", 
	
	/* 首页和广告页用 */
	"getAdList": "data/home.json", 
	"home": "fake/home.json", 
    "saveSellerChangePriceAgain":"fake/saveSellerChangeAgain.json"
};
module.exports = {
	get: function(url) { 
		var key = url.split("?")[0].split("/");
		if (key.length > 2) {
			key = "/" + key[1] + "/" + key[2];
		} else {
			key = "/" + key[1];
		}
		
		return urlFake[key.toLowerCase()] || url;
	}
};