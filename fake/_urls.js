
var urlFake = {
	/* 用户相关 */
	"zsLogin": "fake/login.json", 
    "login": "fake/login.json", 
    "logout": "fake/login.json", 
    "allow": "fake/allow.json", 
    "getCode": "fake/code.json", 
    "sendSms": "fake/code.json", 
    "resetPwd": "fake/resetpwd.json", 
	
	/* 首页和广告页用 */
	"getAdList": "data/home.json", 
	"home": "fake/home.json", 
    "saveSellerChangePriceAgain":"fake/saveSellerChangeAgain.json"
};
module.exports = {
	getFakeJSON: function() { return urlFake},
};