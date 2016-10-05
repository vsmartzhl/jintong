
/*
 首页相关的controller、service 的脚本
*/
moduleI.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	var html_path = "/home/template/";
	function mapping(url, crontroller, template) {
		return {"url": url, "template": function() {return getHtml(html_path + template); }, "controller": crontroller};
	}
	
	$stateProvider.state('default', mapping("", 'HomeCtrl', "t_home"));
	$stateProvider.state('home', mapping("/", 'HomeCtrl', "t_home"));
	
}]);


//home Controller
moduleC.controller("HomeCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "$timeout", "User", "Home", function($rootScope, $scope, $state, $stateParams, $timeout, User, Home) {
    $scope.loaded = false;
    $scope.failed = false;
    $scope.permited = true;
    $scope.brandList = [];
    $scope.data = { 
		"slides": [
					{"start": "2016-10-03", "end": "2018-10-03", "img": "/common/img/slides/1.jpg", "name": "", "url": "../events.html?id=SD0429wzs02", "picture": "/events/img/1461922320_20160429zs02.png"},
					{"img": "/common/img/slides/2.jpg", "name": "", "url": ""}
				  ],
        "service": {"img": "/common/img/service/7.png",  "description": "【丰富的数据】<br>【强大的数据处理能力】<br>为客户提供全面便捷的数据服务", "list": [{"img": "/common/img/service/1.png", "name": "", "description": "", "url": ""}]},
        "saas": {"img": "/common/img/service/5.png",  "description": "", "list": [{"img": "/common/img/service/5.png", "name": "弹性扩展", "description": "服务资源弹性升级<br>应对不同业务强度", "url": ""}]},
        "solution": {"img": "/common/img/service/8.png",  "description": "", "list": [{"img": "/common/img/service/1.png", "name": "", "description": "", "url": ""}]}
    };
	
    $scope.userData = User.getUserData();
	
	document.title = "开放平台";
	$timeout(function() {jQuery(".navbar-header").hide();}, 100);


    $scope.clickAds = function(link){
        if (link && link.length > 0) {
            ZCar.openInside(link, false);
        }
    }
	
    // 加载首页信息
    if(!$scope.loaded) {
        Home.load(function(data) {
            $scope.loaded = true;
            $scope.data = data;
        });
    }

}]);


//Home service
moduleS.factory("Home", ["$rootScope", "$http", function($rootScope, $http) {
    var Home = {
        load: function(callback) {
            $rootScope.sendGet("/home/list", {}, function(res, status, headers, config) {
				return ZCar.doCallback(res, callback);
            });
        },
		
        getUserData:function(key){
            return key ? userData[key]: userData;
        }

    };
	return Home;
}]);