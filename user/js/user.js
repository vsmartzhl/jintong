
// 配置url路由
moduleI.config(['$stateProvider',function($stateProvider) {
	var html_path = "/user/template/";
	function mapping(url, crontroller, template) {
		return {"url": url, "template": function() {return getHtml(html_path + template); }, "controller": crontroller};
	}
	
	// var ctrl = (location.pathname.indexOf("/register.html") > -1) ? 'RegisterCtrl' : 'LoginCtrl';
	if (location.pathname.indexOf("/center.html") > -1) {
		$stateProvider.state('center', mapping("{action:[^\?]*}", 'CenterCtrl', "t_center"));
	} else {
		$stateProvider.state('default', mapping("?id", 'LoginCtrl', "t_login"));
		$stateProvider.state('login', mapping("/?id", 'LoginCtrl', "t_login"));
	}
}]);

moduleC.controller('CenterCtrl', ['$location','$rootScope', '$scope', '$state','$stateParams', '$timeout', 'User', 'Code', function($location, $rootScope, $scope, $state,$stateParams, $timeout, User, Code) {
	$scope.action = "login";
	$scope.step = 0;
	$scope.vcode = {};
	$scope.user	= {};
	$scope.userData = User.getUserData(); //获取缓存的登录信息
    $scope.id = $stateParams.id || "";
	$scope.images = null; 
	$scope.hint = "";
	$scope.menu = "account";
	document.title = "账户概览";
	
	
}]);

moduleC.controller('LoginCtrl', ['$location','$rootScope', '$scope', '$state','$stateParams', '$timeout', 'User', 'Code', function($location, $rootScope, $scope, $state,$stateParams, $timeout, User, Code) {
	$scope.action = "login";
	$scope.step = 0;
	$scope.vcode = {};
	$scope.user	= {};
	$scope.userData = User.getUserData(); //获取缓存的登录信息
    $scope.id = $stateParams.id || "";
	$scope.images = null; 
	$scope.hint = "";
	if (location.pathname.indexOf("/register.html") > -1) {
		document.title = "开放平台-注册";
		$scope.action = "register";
	} else {
		document.title = "开放平台-登录";
		$scope.action = "login";
	}
	
	var reason = ZCar.data("goto_login_reason");
	if (reason && typeof reason == "string" && reason.trim() != "") {
		ZCar.data("goto_login_reason", null);
		$scope.alerts = reason;
		$timeout(function() {ZCar.logout();}, 100);
	}
	
	function init() {
		$scope.user	= {password: "", uname: $scope.user.uname || "13800009999", nickname: "", photo: "", error: "", code: "", sms: "", mobile: ""};
		$scope.vcode = {title: "获取验证码", sent: false, clickable: true, experied: false, "max-limit": 60, limit: 60}; // limit: timeout 1 minutes
	}
	init();
	if ($scope.id != "") {
		// TODO
		if ($scope.action == "register") {
			$scope.user.nickname = "酷玩前端";
			$scope.user.photo = "https://itmantos.github.io/favicon.ico";
		} else {
			$rootScope.doing("微信登录成功，正在跳转到首页...");
			User.login($scope.user, function(res) {
				$timeout(function() {ZCar.openInside("/", true);}, 2000);
			});
			
		}
	}
	
	// 校验手机号和发送状态，控制发送按钮有效无效状态
	$scope.isClickable = function isClickable() {
		if (!$scope.vcode.clickable) {
			return false;
		}
		return (/^(0|86|17951)?(1[3-8][0-9])\d{8}$/.test($scope.user.uname) || /^[^\s\t@]+@[^\s\t@]+\.[^\s\t@]+$/.test($scope.user.uname));
	}
	
	// 校验码输入后，是否能点击下一步按钮
	$scope.nextable = function nextable() {
		return $scope.user.sms.length == 6;
	}
	
	// 触发获取短信校验码请求
	$scope.sendCode = function sendCode() {
		if(ZCar.guard("sendCode")) {
			return;
		}
		if (!$scope.isClickable()) {
			return;
		}
		
		Code.sendSms({"mobile": $scope.user.uname}, function(res) {
            if (res.failed) {
                $scope.user.error = res.code;
            } else {
				$scope.vcode.clickable = false;
				$scope.vcode.sent = true;
				(function countdown() {
					if ($scope.vcode.limit < 1) {
						$scope.vcode.clickable = true;
						$scope.vcode.limit = $scope.vcode["max-limit"];
						$scope.vcode.title = "再次发送验证码";
					} else {
						$scope.vcode.limit -= 1;
						$scope.vcode.title = $scope.vcode.limit + "秒后再次发送验证码";
						$timeout(countdown, 1000);
					}
				})();
			}
		});
		$scope.user.password = "";
		$scope.user.password2 = "";
	};
	
	//点击注册按钮
	$scope.register = function register(){
		if(ZCar.guard("register")) {
			return;
		}
		User.register($scope.user, function(res) {
            if (res.failed) {
				switch(res.code + "") {
					case '3229':
						$scope.user.error = "账号被冻结！";
						break;
					default:
						$scope.user.error = res.message;
						break;
				}
				// 验证码错误，重新获取
				//$scope.getCodes();
            } else {
                $scope.user.error = "";
				ZCar.openInside("/user/login.html", true);
            }
        });
	}
	
    // 点击事件，用于切换视图
    $scope.go = function go(action, step) {
        $scope.action = action;
		$scope.step = step || 0;
		if ($scope.step < 1) {
			init();
			var $bar = jQuery("#bs-navbar");
			$bar.attr("class", $bar.attr("class").replace(/hide/gi, "") + ((action == 'login') ? " hide" : ""));
		}
    };
	
	//点击登录按钮激活login
	$scope.login = function login(){
		if(ZCar.guard("login")) {
			return;
		}
		User.login($scope.user, function(res) {
            if (res.failed) {
				switch(res.code + "") {
					case '3201':
						$scope.user.error = "用户不存在！";
						break;
					case '3202':
					case '3208':
						$scope.user.error = res.code + "";
						break;
					case '3229':
						$scope.user.error = "账号被冻结！";
						break;
					default:
						$scope.user.error = res.message;
						break;
				}
				// 验证码错误，重新获取
				//$scope.getCodes();
            } else {
                $scope.user.error = "";
                var href = ZCar.data("href");
                if (href && typeof href == "string") {
                    // 如果由需要登录转来登录，返回到元页面
                    ZCar.data("href", "");
                } else {
                    href = "/";
                }
				ZCar.openInside(href, true);
            }
        });
	}
	
	// 发送变更请求
	$scope.resetPwd = function resetPwd() {
		if(ZCar.guard("resetPwd")) {
			return;
		}
		User.resetPwd($scope.user, function(res) {
			init();
            if (res.failed) {
                $scope.user.error = res.message || "密码修改失败！\n请联系客服进行密码重置！";
            } else {
                $scope.user.error = "";
            }
			$scope.go("forgot", 3);
        });
	}
}]);



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
			$rootScope.sendPost("/code/send", data, function(res, status, headers, config) {
				return ZCar.doCallback(res, callback);
			});
        }
    }
}]);

