
/*
 服务管理相关的controller、service 的脚本
*/
moduleI.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	var html_path = "/service/template/";
	function mapping(url, crontroller, template) {
		return {"url": url, "template": function() {return getHtml(html_path + template); }, "controller": crontroller};
	}
	
	var ctrl = (location.pathname.indexOf("/item.html") > -1) ? 'ServiceItemCtrl' : 'ServiceListCtrl';
	
	$stateProvider.state('default', mapping("", ctrl, "t_list"));
	$stateProvider.state('list', mapping("/", ctrl, "t_list"));
}]);


//home Controller
moduleC.controller("ServiceListCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "$timeout", "User", "Service", function($rootScope, $scope, $state, $stateParams, $timeout, User, Service) {
    $scope.loaded = false;
    $scope.failed = false;
    $scope.detail = false;
    $scope.permited = true;
    $scope.brandList = [];
    $scope.data = { 
		"list": [{"img": "/common/img/service/5.png", "name": "弹性扩展", "description": "服务资源弹性升级<br>应对不同业务强度", "url": ""}]
    };
	
    $scope.userData = User.getUserData();
	
	document.title = "开放平台";
	$timeout(function() {jQuery(".navbar-header").hide();}, 100);


    $scope.show = function(item){
        ZCar.openInside("/service/item.html?id=" + item.id, false);
    }
	
    // 加载首页信息
    if(!$scope.loaded) {
        Service.load(function(data) {
            $scope.loaded = true;
            $scope.data = data;
        });
    }

}]);


//Home service
moduleS.factory("Service", ["$rootScope", "$http", function($rootScope, $http) {
    var Service = {
        load: function(callback) {
            $rootScope.sendGet("/service/list", {}, function(res, status, headers, config) {
				return ZCar.doCallback(res, callback);
            });
        },
		
        getUserData:function(key){
            return key ? userData[key]: userData;
        }

    };
	return Service;
}]);


//home Controller
moduleC.controller("ServiceItemCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "$timeout", "User", "Service", function($rootScope, $scope, $state, $stateParams, $timeout, User, Service) {
    $scope.loaded = false;
    $scope.failed = false;
    $scope.detail = true;
    $scope.permited = true;
    $scope.brandList = [];
    $scope.data = { 
		"list": [{"img": "/common/img/service/5.png", "name": "弹性扩展", "description": "服务资源弹性升级<br>应对不同业务强度", "url": ""}]
    };
	
    $scope.userData = User.getUserData();
	
	document.title = "开放平台";
	$timeout(function() {jQuery(".navbar-header").hide();}, 100);


    $scope.show = function(item){
        ZCar.openInside("/service/item.html?id=" + item.id, false);
    }
	
    // 加载首页信息
    if(!$scope.loaded) {
        Service.load(function(data) {
            $scope.loaded = true;
            $scope.data = data;
        });
    }

}]);

