/*
$stateParams 状态参数
在上面提及使用$stateparams来提取在url中的不同参数。该服务的作用是处理url的不同部分。例如，当上述的inbox状态是这样时：
url: '/inbox/:inboxId/messages/{sorted}?from&to'//当用户访问者链接时：'/inbox/123/messages/ascending?from=10&to=20'
$stateParams对象的值为：
{inboxId: '123', sorted: 'ascending', from: 10, to: 20}

 // 限定id为6位16进制数字    url: '/inbox/{inboxId:[0-9a-fA-F]{6}}',
 // 或者    // 匹配任何在 `/inbox`后面的url（慎用）并匹配值到indexId    url: '/inbox/{inboxId:.*}'
	
*/

/*
 服务管理相关的controller、service 的脚本
*/
moduleI.config(['$stateProvider',function($stateProvider) {
	var html_path = "/service/template/";
	function mapping(url, crontroller, template) {
		return {"url": url, "template": function() {return getHtml(html_path + template); }, "controller": crontroller};
	}
	
	var ctrl = 'ServiceListCtrl';
	var tpl = 't_list';
	if (location.pathname.indexOf("/item.html") > -1) {
		//$stateProvider.state('default', mapping("?id", 'ServiceItemCtrl', 't_item'));
		$stateProvider.state('item', mapping("{action:[^\?]*}?id", 'ServiceItemCtrl', 't_item'));
	} else {
		$stateProvider.state('list', mapping("{action:[^\?]*}", 'ServiceListCtrl', 't_list'));
	}
	
}]);


// 服务清单 Controller
moduleC.controller("ServiceListCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "$timeout", "User", "Service", function($rootScope, $scope, $state, $stateParams, $timeout, User, Service) {
    $scope.loaded = false;
    $scope.failed = false;
    $scope.data = {"list": [{"img": "/common/img/service/5.png", "name": "弹性扩展", "description": "服务资源弹性升级,应对不同业务强度", "url": ""}]};
	
    $scope.userData = User.getUserData();
	
	document.title = "开放平台-数据商城";
	$timeout(function() {jQuery(".navbar-header").hide();}, 100);


    $scope.show = function(item){
        ZCar.openInside("/service/item.html#/?id=" + item.id, false);
    }
	
    // 加载首页信息
    if(!$scope.loaded) {
        Service.load(function(data) {
            $scope.loaded = true;
            $scope.data = data;
        });
    }

}]);


// 服务清单 service
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


// 服务详细 Controller
moduleC.controller("ServiceItemCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "$timeout", "User", "Service", function($rootScope, $scope, $state, $stateParams, $timeout, User, Service) {
    $scope.loaded = false;
    $scope.failed = false;
    $scope.action = $stateParams.action || "";
    $scope.id = $stateParams.id || "";
	console.log($stateParams);
	
    $scope.userData = User.getUserData();
    $scope.item = {"id": "S003", "img": "/common/img/service/7.png", "name": "安全防护", "price": 15, "unit": "元/月", "description": "多维度安全保护,安心托管各种应用"};
	
	
	document.title = "开放平台-服务详细";
	$timeout(function() {jQuery(".navbar-header").hide();}, 100);


    $scope.show = function(item){
        ZCar.openInside("/service/item.html?id=" + item.id, false);
    }
	
    // 加载首页信息
    if(!$scope.loaded) {
        Service.load(function(data) {
            $scope.loaded = true;
            $scope.item = data.list[0];
        });
    }

}]);

