
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
	get: function(url, method) { 
		method = method || "";
		
		if (url.indexOf("/fake/") > -1) {
			return url;
		}
		
		switch(method.toLowerCase()) {
			case "put":
				url = "/fake/put.json";
			break;
			case "post":
//				url = "/fake/post.json";
			break;
			case "delete":
				url = "/fake/delete.json";
			break;
			default:
			break;
		}
		if (url.indexOf("/fake/") > -1) {
			console.log(" to " + url);
			return url;
		}
		
		var key = url.split("?")[0].split("/");
		console.log(key.length + ": [" + key.join("_") + "]");
		if (key.length > 2) {
			key = "/" + key[1] + "/" + key[2];
		} else {
			key = "/" + key[1];
		}
		if (key == "/") {
			console.log(" to /index.html");
			return "/index.html";
		}
		
		console.log(url + " to " + key);
		return urlFake[key] || url;
	}
};