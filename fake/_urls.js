
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
		
		switch(method.toLowerCase()) {
			case "put":
				fake = "/fake/put.json";
			break;
			case "post":
				fake = "/fake/post.json";
			break;
			case "delete":
				fake = "/fake/delete.json";
			break;
			default:
			break;
		}
		if (fake.indexOf("/fake/") > -1) {
			return fake;
		}
		
		var key = url.split("?")[0].split("/");
		console.log(key.length + ": [" + key.join("_") + "]");
		if (key.length > 2) {
			key = "/" + key[1] + "/" + key[2];
		} else {
			key = "/" + key[1];
		}
		if (key == "/") {
			return "/index.html";
		}
		
		console.log(url + " to " + key);
		return urlFake[key] || url;
	}
};