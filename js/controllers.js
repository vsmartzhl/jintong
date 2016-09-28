
/*
hash: "#/rorder"
href: "http://localhost:8080/buyer.html?_=20160313#/rorder"
origin: "http://localhost:8080"
pathname: "/buyer.html"
*/
if(location.pathname == "/home.html" || location.pathname == "/"){
	moduleI.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	  $stateProvider
		.state("home", {
		  url: "",
		  template: function() { 
			return getHtml("t_home"); 
		  },
		  controller: "HomeCtrl"
		})    
		.state("slides", {
		  url: "/slides",
		  template: function() { 
			return getHtml("t_slides"); 
		  },
		  controller: "SlidesCtrl"
		})    
		.state("select", {
		  url: "/select?vid",
		  template: function() { 
			return getHtml("t_parts_pob"); 
		  },
		  controller: "PartCtrl_pob"
		})
		.state("select_parts", {
		  url: "/parts?vid",
		  template: function() { 
			return getHtml("t_parts"); 
		  },
		  controller: "PartCtrl_pod"
		});
	}]);
}
	
// 用户登录
moduleI.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: "/login",
	  template: function() { 
		return getHtml("t_login"); 
	  },
	  controller: 'LoginCtrl'
    });
}]);


// Header Controller 
moduleC.controller("HeaderCtrl", ["$location","$rootScope", "$scope", "$state", "$stateParams", "$interval", "User", function($location, $rootScope, $scope, $state, $stateParams, $interval, User) {
	$scope.userData = {city: ""};
    $scope.cities = ["北京市", "保定市", "深圳市"];
	if (location.href.indexOf("#/login") < 0) {
		// 防止login页面显示用户信息（隐藏用户数据，但不清除）
		$scope.userData = User.getUserData();
		$scope.userData.city = ZCar.data("location") || "北京市";
	}

    $scope.status = "out";

    var ads = ZCar.data("ads");
	$scope.msgOrg = ads && ads.messages || [];
	$scope.notices = ZCar.cache("notices") || [];
	if (!$scope.notices.length) {
		$scope.notices = [];
	}
	$scope.messages = $scope.msgOrg.concat($scope.notices);

	
    $scope.cityChange = function cityChange(city) {
		ZCar.data("location", city);
		$scope.userData.city = city;
		location.reload();
    };
	
    $scope.home = function home() {
		ZCar.openInside("/", true);
    };
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
		User.loginout();
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

// Menu Controller 
moduleC.controller("MenuCtrl", ["$location","$rootScope", "$scope", "$state", "$stateParams", "User", function($location, $rootScope, $scope, $state, $stateParams, User) {
    $scope.userData = User.getUserData();	
    $scope.menu = {b: false, s: false};
	if (!$scope.userData || typeof $scope.userData.userid !== "string" || $scope.userData.userid === "") {
		$scope.menu = {"b": false, "s": false};
	} else {
		$scope.menu = {"b": ($scope.userData.role.indexOf("1") > -1), "s": ($scope.userData.role.indexOf("2") > -1)};
	}
	//$scope.width={width: ($scope.menu.b && $scope.menu.s ? '182px' : '130px')};
	$scope.menu.css = $scope.menu.b && $scope.menu.s ? 'menu-tabs' : 'menu-tab';

    $scope.powerful = ($scope.userData.account_role == 0);
	$scope.menu.bactive = (location.href.indexOf("buyer") > -1);
	$scope.menu.sactive = !$scope.menu.bactive;
	
    $scope.goPage = function goPage(url) {
		ZCar.openInside(url, true);
    };
}]);

//Slides Controller - 用了检查轮播图显示效果
moduleC.controller("SlidesCtrl", ["$rootScope", "$scope", "$state", "$stateParams","$modal", "$timeout", "Cart", "Car","User", function($rootScope, $scope, $state, $stateParams,$modal, $timeout, Cart, Car,User) {
    $scope.loaded = false;
    $scope.ads = { };
	
    $scope.clickAds = function(link){
        if (link && link.length > 0) {
            ZCar.openInside(link, false);
        }
    }
	
	$scope.ads.slidesB = [];
	$scope.ads.slidesS = [];
	$scope.ads.slidesB1 = [];
	$scope.ads.slidesB2 = [];
	$scope.ads.slidesS1 = [];
	$scope.ads.slidesS2 = [];
	
    // 加载首页信息
	Car.load(function(data) {
		$scope.loaded = true;
		$scope.ads = data;

		//轮播图片按活动时间自动下架
		var allSlides = [$scope.ads.slides, $scope.ads.slidesB1, $scope.ads.slidesB2, $scope.ads.slidesS1, $scope.ads.slidesS2];
		for( var i = $scope.ads.slides.length - 1; i > -1;i--){
			var slide = $scope.ads.slides[i];
			var now = new Date() - 0;
			var start = slide["start"] || "";
			if (start && start.length < 14) {
				start += " 00:00:00";
			}
			if (start) {
				start = new Date(start.replace(/\-/gi, "/")) - 0;
			} else {
				start = now;
			}
			var end = slide["end"] || "";
			if (end && end.length < 14) {
				end += " 23:59:59";
			}
			if (end) {
				end = new Date(end.replace(/\-/gi, "/")) - 0;
			} else {
				end = now;
			}
			if ((start && start > now) || (end && end < now)) {
				// 过期
				$scope.ads.slides.splice(i,1);
				continue;
			}
			fillSlides();
		}
	});
	function fillSlides() {
		$scope.ads.slidesB = [];
		$scope.ads.slidesS = [];
		$scope.ads.slidesB1 = [];
		$scope.ads.slidesB2 = [];
		$scope.ads.slidesS1 = [];
		$scope.ads.slidesS2 = [];
		for(var i in $scope.ads.slides){
			var slide = $scope.ads.slides[i];
			if (slide["locations"].indexOf("北京市") > -1) {
				//
				if ((slide["type"] + "").indexOf("b") > -1) {
					$scope.ads.slidesB1.push(slide);
				} 
				if ((slide["type"] + "").indexOf("B") > -1) {
					$scope.ads.slidesB2.push(slide);
				} 
				if ((slide["type"] + "").indexOf("B") > -1 && (slide["type"] + "").indexOf("b") > -1) {
					$scope.ads.slidesB.push(slide);
				}
			}
			if (slide["locations"].indexOf("深圳市") > -1) {
				//
				if (slide["type"].indexOf("b") > -1) {
					$scope.ads.slidesS1.push(slide);
				} 
				if ((slide["type"] + "").indexOf("B") > -1) {
					$scope.ads.slidesS2.push(slide);
				} 
				if ((slide["type"] + "").indexOf("B") > -1 && (slide["type"] + "").indexOf("b") > -1) {
					$scope.ads.slidesS.push(slide);
				}
			}
		}
		
	}
	

}]);
//home Controller
moduleC.controller("HomeCtrl", ["$rootScope", "$scope", "$state", "$stateParams","$modal", "$timeout", "Cart", "Car","User", function($rootScope, $scope, $state, $stateParams,$modal, $timeout, Cart, Car,User) {
    $scope.loaded = false;
    $scope.failed = false;
    $scope.permited = true;
    $scope.brandList = [];
    $scope.ads = { "slides": [{"img": "/img/slides/1.jpg", "name": "", "url": "", "bgcolor": "green"}],
        "hm1": [{"img": "/img/zhengshi.png", "name": "", "url": ""},{"img": "/img/zhengshi.png", "name": "", "url": ""},{"img": "/img/zhengshi.png", "name": "", "url": ""},{"img": "/img/zhengshi.png", "name": "hpsum", "url": ""},{"img": "/img/zhengshi.png", "name": "", "url": ""},{"img": "/img/zhengshi.png", "name": "", "url": ""}],
        "hm2": [{"img": "/img/zhengshi.png", "name": "", "url": ""},{"img": "/img/zhengshi.png", "name": "", "url": ""},{"img": "/img/zhengshi.png", "name": "", "url": ""},{"img": "/img/zhengshi.png", "name": "hpsum", "url": ""},{"img": "/img/zhengshi.png", "name": "", "url": ""},{"img": "/img/zhengshi.png", "name": "", "url": ""}],
    };
    $scope.userData = {};
    if (location.href.indexOf("#/login") < 0) {
        // 防止login页面显示用户信息（隐藏用户数据，但不清除）
        $scope.userData = User.getUserData();
    }

	document.title = "正时汽车";
    $scope.status = "out";

    if (!$scope.userData.name) {
        $scope.status = "out";
    } else {
        $scope.status = "in";
    }

    $scope.clickAds = function(link){
        if (link && link.length > 0) {
            ZCar.openInside(link, false);
        }
    }
	$scope.location = "";
	ZCar.getLocation(function(data) { $scope.location = data; });
	
    $scope.options = {};

    // 筛选获取到的轮播图信息
	$scope.filteSlidesByLocation = function() {
		if (!$scope.ads || !$scope.ads.slides || $scope.location == "") {
			 $timeout(filteSlidesByLocation, 100);
			return;
		}
		
		//轮播图片按活动时间自动下架
		for( var i = $scope.ads.slides.length - 1; i > -1;i--){
			var slide = $scope.ads.slides[i];
			if (slide.locations.indexOf($scope.location) < 0) {
				// 移除非本区域的广告
				$scope.ads.slides.splice(i,1);
				continue;
			}
		}
	}
	
    // 加载首页信息
    if(!$scope.loaded) {
        Car.load(function(data) {
            $scope.loaded = true;
            $scope.ads = data;
			
			var key = "";
            if(ZCar.isBuyer() && !ZCar.isSeller()){
                key = "B";
            } else if( ZCar.isSeller() && !ZCar.isBuyer()){
                key = "b";
            }else {
                key = "";
            }
			$scope.filteSlidesByLocation();
            //轮播图片按活动时间自动下架
            for( var i = $scope.ads.slides.length - 1; i > -1;i--){
                var slide = $scope.ads.slides[i];
				// 移除非当前用户类型的广告
				if ($scope.ads.slides[i].type == key) {
                    $scope.ads.slides.splice(i,1);
					continue;
				}
				var now = new Date() - 0;
				var start = slide["start"] || "";
				if (start && start.length < 14) {
					start += " 00:00:00";
				}
				if (start) {
					start = new Date(start.replace(/\-/gi, "/")) - 0;
				} else {
					start = now;
				}
				var end = slide["end"] || "";
				if (end && end.length < 14) {
					end += " 23:59:59";
				}
				if (end) {
					end = new Date(end.replace(/\-/gi, "/")) - 0;
				} else {
					end = now;
				}
				if ((start && start > now) || (end && end < now)) {
					// 过期
                    $scope.ads.slides.splice(i,1);
				}
            }
            var cart = ZCar.cache("cart");
            if (!cart || !cart[0]) {
                Cart.reload();
            }
        });
    }


}]);


moduleC.controller('IMCtrl', ['$location','$rootScope', '$scope', '$state','$stateParams', '$timeout', 'User',"IM", 'Code', function($location, $rootScope, $scope, $state,$stateParams, $timeout, User,IM, Code) {
	$scope.userData = User.getUserData(); //获取缓存的登录信息
	$scope.user_code = User.getUserData("code");
	$scope.user_name = User.getUserData("name");
	/*toTalk("当前商户code", "当前商户name");*/
	toTalk($scope.user_code, $scope.user_code);
	document.title = "客服";


}]);


moduleC.controller('LoginCtrl', ['$location','$rootScope', '$scope', '$state','$stateParams', '$timeout', 'User', 'Code', function($location, $rootScope, $scope, $state,$stateParams, $timeout, User, Code) {
	$scope.action = "login";
	$scope.user	= {password: "", uname: "", error: "", code: "", sms: "", mobile: ""};
	$scope.userData = User.getUserData(); //获取缓存的登录信息
	$scope.images = null; 
	$scope.hint = "";
	$scope.disabled60s = false;	
	document.title = "登录";
	
	$scope.vcode = {title: "获取短信校验码", sent: false, clickable: true, experied: false, limit: 300000}; // limit: timeout 5 minutes
	
	var reason = ZCar.data("goto_login_reason");
	if (reason && typeof reason == "string" && reason.trim() != "") {
		ZCar.data("goto_login_reason", null);
		$scope.alerts = reason;
		$timeout(function() {ZCar.logout();}, 100);
	}
	
	// 触发获取图片验证码请求
	$scope.getCodes = function getCodes() {
		if(ZCar.guard("getCodes")) {
			return;
		}
		if ($scope.disabled60s == true) {
			return;
		}
		$scope.hint = "loading...";
		$scope.images = [];
		Code.load(function(res) {
			if (res.images) {
				$scope.user.code = "";
				$scope.images = res.images;
				$scope.hint = res.name; 
			}
			$scope.disabled60s = true;
			$timeout(function() {$scope.disabled60s = false;}, 60000);
		});
	};
	$scope.getCodes();
	
	// 选择图片验证码
	$scope.clickCode = function clickCode(idx) {
		if(ZCar.guard("clickCode")) {
			return;
		}
		if ($scope.user.code.indexOf("" + idx) < 0) {
			$scope.user.code += "," + idx;
		} else {
			$scope.user.code = $scope.user.code.replace("," + idx, "");
		}
	};
	
	$scope.isActive = function isActive(idx) {
		return $scope.user.code.indexOf("," + idx) > -1; 
	};
	
	//点击登录按钮激活login
	$scope.login = function login(){
		if(ZCar.guard("login")) {
			return;
		}
		if ($scope.user.code == '') {
			$scope.user.error = "3208";
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
					case '3219':
						$scope.user.error = "您的账号还不属于任何商家，赶紧联系老板添加吧！";
						break;
					default:
						$scope.user.error = res.message;
						break;
				}
				// 验证码错误，重新获取
				$scope.disabled60s = false;
				$scope.getCodes();
            } else {
                $scope.user.error = "";
                var href = ZCar.data("href");
                if (href && typeof href == "string") {
                    // 如果由需要登录转来登录，返回到元页面
                    ZCar.data("href", "");
                } else {
                    href = "/home.html";
                }
				ZCar.openInside(href, true);
            }
        });
	}


	// 校验手机号和发送状态，控制发送按钮有效无效状态
	$scope.isClickable = function isClickable() {
		if (!$scope.vcode.clickable) {
			return false;
		}
		return ZCar.validateMobile($scope.user.mobile);
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
		
		Code.sendSms({"mobile": $scope.user.mobile}, function(res) {
            if (res.code && ("" + res.code) != "200") {
                $scope.user.error = res.code;
            } else {
				$scope.vcode.clickable = false;
				$scope.vcode.sent = true;
				$scope.vcode.title = "已经发送校验码";
				$timeout(function() {
					$scope.vcode.clickable = true;
				}, $scope.vcode.limit);
			}
		});
		$scope.user.password = "";
		$scope.user.password2 = "";
	};
	
	// 发送变更请求
	$scope.resetPwd = function resetPwd() {
		if(ZCar.guard("resetPwd")) {
			return;
		}
		User.resetPwd($scope.user, function(res) {
            if (("" + res.code) != "200") {
                $scope.user.error = res.code;
				// 验证码错误，重新获取
				if ($scope.user.error == "3208") {
					$scope.user.sms = "";
				}
				if ($scope.user.error == "3203") {
					$rootScope.alert("密码修改失败！\n请联系客服进行密码重置！");
				} else {
					$scope.go("forgot");
				}
            } else {
                $scope.user.error = "";
				$scope.go("success");
            }
			$scope.user.mobile = "";
			$scope.user.sms = "";
			$scope.user.uname = "";
			$scope.user.code = "";
			$scope.user.password = "";
			$scope.user.password2 = "";
        });
	}
	
    // 点击事件，用于切换视图
    $scope.go = function go(step) {
        $scope.action = step;
		
		$scope.user.password = "";
		//$scope.user.sms = "";
		///$scope.user.code = "";
		//$scope.user.error = "";
    };
}]);

