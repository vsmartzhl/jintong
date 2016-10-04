
/*
 首页相关的controller、service 的脚本
*/
moduleI.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
var html_path = "/home/template/";
  $stateProvider
	.state("default", {
	  url: "",
	  template: function() { 
		return getHtml(html_path + "t_home"); 
	  },
	  controller: "HomeCtrl"
	})
	.state("home", {
	  url: "/",
	  template: function() { 
		return getHtml(html_path + "t_home"); 
	  },
	  controller: "HomeCtrl"
	})
	.state("slides", {
	  url: "/slides",
	  template: function() { 
		return getHtml(html_path + "t_home"); 
	  },
	  controller: "SlidesCtrl"
	});
}]);


//Slides Controller - 用了检查轮播图显示效果
moduleC.controller("SlidesCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "User", function($rootScope, $scope, $state, $stateParams, User) {
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
moduleC.controller("HomeCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "User", function($rootScope, $scope, $state, $stateParams, User) {
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

	document.title = "开放平台";
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
	
    $scope.options = {};

    // 筛选获取到的轮播图信息
	$scope.filteSlidesByLocation = function() {
		if (!$scope.ads || !$scope.ads.slides) {
			 $timeout(filteSlidesByLocation, 100);
			return;
		}
	}


}]);

