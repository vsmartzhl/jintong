
var urlFake = {
	/* 用户相关 */
    "/i/register": "fake/login.json", 
	"/i/login": "fake/login.json", 
    "/i/logout": "fake/login.json", 
    "/code/send": "fake/code.json",
	"/user/resetPwd": "fake/login.json", 
	

	
	/* 首页用 */
	"/home/list": "fake/home.json", 
	
	/* service用 */
	"/service/list": "fake/service.json", 
	
	/* 处理结果 */
	"/result/failed": "fake/failed.json", 
    "/result/success":"fake/success.json"
};
module.exports = {
	get: function(url) { 
		var key = url.split("?")[0].split("/");
		if (key.length > 2) {
			key = "/" + key[1] + "/" + key[2];
		} else {
			key = "/" + key[1];
		}
		
		return urlFake[key] || url;
	}
};