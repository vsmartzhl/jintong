
// verify Code Service 
moduleS.factory("Code", ["$rootScope", "$http", function($rootScope, $http) {
    var items = null;
    return {
        load: function(callback) {
			$rootScope.sendGet("getCode", {}, function(res, status, headers, config) {
					return ZCar.doCallback(res, callback);
				}, function(res, status, headers, config) {
					return ZCar.doCallback(res, callback);
				}, 3);
        }, 
        sendSms: function(data, callback) {
			data.mobile = Base64.encode(data.mobile);
			$rootScope.sendGet("sendSms", data, function(res, status, headers, config) {
				return ZCar.doCallback(res, callback);
			});
        }
    }
}]);


//user service
moduleS.factory("User", ["$rootScope", "$http", function($rootScope, $http) {
    var userData = null;
    var User = {
        init: function() {
            if (!userData) {
                userData = ZCar.cache("user") || {};
            }
        },

        toLogin: function() {
            // reset session data
            PHPSESSID = "";
        },

		/*!
		*  验证Cookie用户是否登录
		*/
        checkCookie: function() {
			return ZCar.checkCK();
        },

		/*!
		*  验证用户是否登录，未登录自动跳转到登录页面；是否有权限访问当前网页，没有权限返回false
		*/
        validate: function(url) {
            this.init();
            if (!userData.username) {
				// 用户未登录、跳转登录页面
				ZCar.gotoLogin("登录后再进行页面访问！");
				return false;
			}
			if (ZCar.isBuyerPage() && !ZCar.isBuyer()) {
				return false;
			}
			if (ZCar.isSellerPage() && !ZCar.isSeller()) {
				return false;
			}
			if (url != "50001007" && url != "account"  && url != "address" && url != "buyer" && userData.dyy) {
				// 代运营账户无权访问询价单以外
				return false;
			}
			if (userData.account_role == 0) {
				// 主账户不校验
				return true;
			}
			if (url == "employee" || url == "security") {
				// 子账户无权访问员工管理和模块密码管理
				return false;
			}
            if (url && userData.powers) {
				return userData.powers.indexOf(url + ",") < 0;
			}
			return true;
        },

		/*!
		*  验证用户模块密码
		*/
        validateMPasswd: function(url, passwd, callback) {
            var req = {"mod_url": url, "user_son_pwd": Base64.encode(passwd)};
				
			if (userData.account_role != 0 && (url == "employee" || url == "security")) {
				// 子账户无权访问员工管理和模块密码管理
				return ZCar.doCallback(false, callback);
			}
			if (ZCar.isBuyerPage() && !ZCar.isBuyer()) {
				return ZCar.doCallback(false, callback);
			}
			if (ZCar.isSellerPage() && !ZCar.isSeller()) {
				return ZCar.doCallback(false, callback);
			}
            $rootScope.sendPost("allow", req, function(res, status, headers, config) {
				var passed = false;
                if (!res.failed) {
                    // 验证成功
					passed = true;
					userData = ZCar.cache("user");
					if (userData.powers) {
						userData.powers = userData.powers.replace(url + ",", "");
					}
					ZCar.cache("user", userData);
                }
				return ZCar.doCallback(passed, callback);
            });
        },

        login: function(data, callback) {
			var dyy = false;
			if (data.uname.toLowerCase().indexOf("zs_") == 0) {
				dyy = true;
			}
            var req = {username: (dyy ? data.uname.substr(3) : data.uname)};
            req.password = Base64.encode(data.password);
            req.validate_code = Base64.encode(data.code.substr(1));

            $rootScope.sendPost((dyy ? "zsLogin" : "login"), req, function(res, status, headers, config) {
                if (res.username) {
                    // 登录成功
					$rootScope.reloadConfig(true);
                    ZCar.login(res.username);
					res.powers = res.power ? "," + res.power.join(",") + "," : "";
					res.dyy = dyy;
					// TODO 代运营
					// res.shop = {"id": res.code, "name": "正时汽车"};
					res.shops = [];
					if (dyy) {
						for (var i in res.operate_buyer) {
							res.shops.push({"id": res.operate_buyer[i].code, "name": res.operate_buyer[i].name});
						}
						//[{"id": "P001007309", "name": "ww正时汽车【内部测试专用】6"}, {"id": "P001023580", "name": "正时汽车【内部测试专用】"}];
						res.shop = res.shops[0];
						res.code = res.shop.id;
						res.role = "3,1";
						res.userid = req.username;
					}
					
                    ZCar.cache("user", res);
					userData = res;
					
					var menu = {};
					if (!res.userid || typeof res.userid !== "string" || res.userid === "") {
						menu.b = false;
						ZCar.log("无效的用户ID ！");
						menu = {"b": false, "s": false};
					} else {
						menu = {"b": (res.role.indexOf("1") > -1), "s": (res.role.indexOf("2") > -1)};
					}
					
                    ZCar.cache("menu", menu);
					ZCar.cache("shopid", res.code);
					ZCar.cache("buyerid", res.userid);
					ZCar.cache("sellerid", res.userid);
                }
                res.failed = !res.username;
				if (!res.failed && res.role.indexOf("1") > -1) {
					return User.reloadAddress(function() {
						return ZCar.doCallback(res, callback);
					});
				} else {
					return ZCar.doCallback(res, callback);
				}
            });
        },
        loginout: function() {
            $rootScope.sendPost("logout", {username: userData.username}, function(res, status, headers, config) {
				ZCar.log("server logout code: " + res.code);
            });
			// 强制客户端退出，不管服务器端是否退出
			ZCar.logout();
        },
		
		/*!
		*  密码找回
		*/
        resetPwd: function(data, callback) {
            var req = {};
            req.mobile = Base64.encode(data.mobile);
            req.password = Base64.encode(data.password);
            req.mobilecode = Base64.encode(data.sms);
				
            $rootScope.sendPost("resetPwd", req, function(res, status, headers, config) {
				return ZCar.doCallback(res, callback);
            });
        },
		
        reloadAddress:function reloadAddress(callback){
			this.init();
			$rootScope.reloadConfig();
			var userRole = ((this.getUserData("role") || "").indexOf("1") > -1) ? "1" : "2";
			var param = {role: userRole, often: 1, code: Base64.encode(this.getUserData("code"))};
			$rootScope.sendGet("getAddress", param, function(res, status, headers, config) {
				if (!res.failed && res[0] && res[0].consignee) {
					ZCar.data("location", res[0].city);
					ZCar.cache("default_address", res[0]);
				}
				return ZCar.doCallback(res, callback);
			});
        },
        getUserData:function(key){
            this.init();
            return key ? userData[key]: userData;
        },
		
        changeShop:function(shop){
			if (!shop || !shop.id) {
				return false;
			}
            this.init();
			userData["shop"] = shop;
			userData.code = shop.id;
			ZCar.cache("user", userData);
			ZCar.cache("shopid", shop.id);
            return true;
        },
		/*!
		*  获取用户角色。 如果是复合角色，指定参数为true，则返回卖家的角色值，否则，返回买家的角色值。
		*/
        getUserRole:function(isSeller){
            this.init();
			var role = userData["role"] || "";
			if (role.indexOf(",") < 0) {
				return role;
			}
			// 复合角色
			if (isSeller) {
				role = role.indexOf("2") > -1 ? "2" : role.substr(0, 1);
			} else {
				role = role.indexOf("1") > -1 ? "1" : role.substr(0, 1);
			}
            return role;
        }

    };
	return User;
}]);


// Password Service 
moduleS.factory("Password", ["$rootScope", "$http", function($rootScope, $http) {
	return {
		setPwd: function(data) {
			var url = "changeLoginPwd";
            $rootScope.sendGet(url, data, function(res, status, headers, config) {
				if (!res.failed) {
					$rootScope.alert({content: "登录密码修改成功！"});
				} else {
					$rootScope.alert({content: res.message + "!"});
				}
	        });
		}
    }
}]);


// Account Service 
moduleS.factory("Noticelist", ["$rootScope", "$http", function($rootScope, $http) {
	var items = null;
	return {
        list: function(options,callback) {
            $rootScope.sendGet("getNoticelist",options, function(res, status, headers, config) {
                res.failed = res.data;
                return ZCar.doCallback(res, callback);
            });
        }
    }
}]);



