

// Header Controller 
moduleC.controller("HeaderCtrl", ["$location","$rootScope", "$scope", "$state", "$stateParams", "$interval", "User", function($location, $rootScope, $scope, $state, $stateParams, $interval, User) {
	$scope.userData = User.getUserData();
    $scope.status = "out";

    var ads = ZCar.data("ads");
	$scope.msgOrg = ads && ads.messages || [];
	$scope.notices = ZCar.cache("notices") || [];
	if (!$scope.notices.length) {
		$scope.notices = [];
	}
	$scope.messages = $scope.msgOrg.concat($scope.notices);

    $scope.login = function login() {
		$scope.logout();
    };
    $scope.goCenter = function goCenter() {
		ZCar.openInside(ZCar.isBuyer() ? "/buyer.html" : "/seller.html", true);
    };
    $scope.goAccount = function goAccount() {
		ZCar.openInside(ZCar.isBuyer() ? "/buyer.html#/account" : "/seller.html#/account", true);
    };
	
    $scope.logout = function logout() {
		if(ZCar.guard("logout")) {
			return;
		}
		$scope.userData = {city: ""};
		User.logout();
		ZCar.gotoLogin();
		$scope.status = "out";
    };
	
	$scope.secondes = 0;
	var ignoreCount = 0;
	var qtime = {scope: $scope, name: "home_notices", finished: false, exec: function() {
		qtime.scope.secondes++;
		if (qtime.scope.secondes < 60) {
			return;
		}
		qtime.scope.secondes = 0;
		
		// 防止多个窗口向服务器发送过多请求
		var wins = ZCar.data("wins") || 1;
		if (ignoreCount < wins) {
			// 从缓存中取状态
			qtime.scope.notices = ZCar.cache("notices") || [];
			qtime.scope.messages = qtime.scope.msgOrg.concat(qtime.scope.notices);
			ignoreCount++;
			return;
		}
		ignoreCount = 0;
		
		$rootScope.sendGet("getNotice", {"noalert": true, "userId": ZCar.cache("buyerid")}, function(res, status, headers, config) {
			if (!res.failed) {
				if (res.notify && res.notify.length > 0) {
					var len = 10 - res.notify.length;
					if (len < 0) {
						len = 0;
					}
					while (qtime.scope.notices.length > len) {
						qtime.scope.notices.shift();
					}
					qtime.scope.notices = qtime.scope.notices.concat(res.notify);
					
					// 清理重复数据
					var msgs = "";
					for (var i = 0; i < qtime.scope.notices.length; i++) {
						if (msgs.indexOf(";" + qtime.scope.notices[i]) < 0) {
							msgs += ";" + qtime.scope.notices[i];
						}
					}
					qtime.scope.notices = msgs.substr(1).split(";");
					
					if(qtime.scope.msgOrg[0] && qtime.scope.msgOrg[0].indexOf("欢迎") > -1) {
						qtime.scope.msgOrg.shift();
					}
					ZCar.cache("notices", qtime.scope.notices);
					qtime.scope.messages = qtime.scope.msgOrg.concat(qtime.scope.notices);
				}
			}
		}, function(res, status, headers, config) {
			// ignore
		}, 1);
	}}
	if ($scope.userData.name) {
		$rootScope.listen(qtime);
	}
	if(!ZCar.guard("interval")) {
	$interval(function() {
        if (ZCar.needRefresh) {
            for (var i in $rootScope.refreshFunctions) {
                try {
                    $rootScope.refreshFunctions[i].exec();
                } catch(e) {}
            }
            ZCar.needRefresh = false;
        }

		for (var i in $rootScope.listeners) {
			try {
				$rootScope.listeners[i].exec();
				if ($rootScope.listeners[i].finished) {
					delete $rootScope.listeners[i];
				}
				
			} catch(e) {}
		}
	}, 1000);	
	}
		
    $scope.reportIssue = function reportIssue() {
		var openLink = jQuery("[name='toreportIssue']");
		var key;
		var body = "url:" + location.href + ";";
		var other = '"url": "' + location.href + '"';
		for(var i = window.localStorage.length - 1 ; i >=0; i--){
			key = window.localStorage.key(i);
			other += ',\n"' + key + '": "' + window.localStorage.getItem(key) + '"';
			if (key.indexOf("code") < 0 && key.indexOf("user") < 0) {
				continue;
			}
			
			body += key + ":" + window.localStorage.getItem(key) + ";";
		}
		openLink.attr('href', "mailto:totimingtechnology@totiming.com?subject=report issue&body=[" + encodeURIComponent(body) + "]");
		openLink[0].click();
		
		var content = "<div class='' style='width:400px;margin: 20px auto;height:300px;'>"+
				"<h4><b>请将下面信息复制到邮件中去：</b></h4>"+
				'<textarea style="margin: 0px; width: 400px; height: 252px;">问题信息:\n==============================================\n{' + other + "\n}\n==============================================</textarea>"+
				"<div><button class='btn btn-primary pull-right' ng-click='$hide();'>关闭</button></div>"+
		    "</div>";
		$rootScope.notify({scope: $scope, container: 'body', "content": content});
    };
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

		/*!
		*  验证用户是否登录，未登录自动跳转到登录页面；是否有权限访问当前网页，没有权限返回false
		*/
        validate: function(url) {
            if (!userData.username) {
				// 用户未登录、跳转登录页面
				//ZCar.gotoLogin("登录后再进行页面访问！");
				//return false;
			}
			return true;
        },
        register: function(data, callback) {
            var req = {username: data.uname};
            req.password = Base64.encode(data.password);
            req.code = Base64.encode(data.code.substr(1));

            $rootScope.sendPost("/i/register", req, function(res, status, headers, config) {
				return ZCar.doCallback(res, callback);
            });
        },
        login: function(data, callback) {
            var req = {username: data.uname};
            req.password = Base64.encode(data.password);
            req.validate_code = Base64.encode(data.code.substr(1));

            $rootScope.sendPost("/i/login", req, function(res, status, headers, config) {
                if (res.user_name) {
                    // 登录成功
					res.name = res.user_name || res.mobile || res.email;
                    ZCar.login(res.name);
					res.powers = res.power ? "," + res.power.join(",") + "," : "";
                    ZCar.cache("user", res);
					userData = res;
                }
                res.failed = !res.user_name;
				return ZCar.doCallback(res, callback);
            });
        },
        logout: function() {
            $rootScope.sendPost("/i/logout", {username: userData.username}, function(res, status, headers, config) {
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
		
        getUserData:function(key){
            return key ? userData[key]: userData;
        },
		/*!
		*  获取用户角色。 如果是复合角色，指定参数为true，则返回卖家的角色值，否则，返回买家的角色值。
		*/
        getUserRole:function(isSeller){
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
	
	User.init();
	return User;
}]);

