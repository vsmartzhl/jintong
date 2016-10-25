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
	var html_path = "/product/template/";
	function mapping(url, crontroller, template) {
		return {"url": url, "template": function() {return getHtml(html_path + template); }, "controller": crontroller};
	}
	
	var ctrl = 'ProductListCtrl';
	var tpl = 't_list';
	if (location.pathname.indexOf("item.html") > -1) {
		//$stateProvider.state('default', mapping("?id", 'ServiceItemCtrl', 't_item'));
		$stateProvider.state('item', mapping("{action:[^\?]*}?id", 'ProductItemCtrl', 't_item'));
	} else {
		$stateProvider.state('list', mapping("{action:[^\?]*}", 'ProductListCtrl', 't_list'));
	}
	
}]);


// 服务清单 Controller
moduleC.controller("ProductListCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "$timeout", "User", "Product", function($rootScope, $scope, $state, $stateParams, $timeout, User, Product) {
    $scope.action = ($stateParams.action || "/service").substr(1).toLowerCase();
    $scope.loaded = false;
    $scope.failed = false;    
	
    $scope.userData = User.getUserData();
	$scope.data = {"id": "S003", "img": "/common/img/service/7.png", "name": "安全防护", "price": 15, "unit": "元/月", "description": "多维度安全保护,安心托管各种应用"};
    $scope.menu = $scope.action;
	document.title = "开放平台-数据商城";
	$timeout(function() {jQuery(".navbar-header").hide();}, 100);

    if (!$scope.action.match(/^(newservice|service|sold)$/gi)) {
        $scope.action = "service";
        $scope.menu = $scope.action;
    }
    $scope.show = function(item){
        ZCar.openInside("/product/item.html#/?id=" + item.id, false);
    }
	
    // 加载首页信息
    if(!$scope.loaded) {
        Product.load(function(data) {
            $scope.loaded = true;
            $scope.data = data.list;
        });
    }

}]);


// 服务清单 service
moduleS.factory("Product", ["$rootScope", "$http", function($rootScope, $http) {
    var Product = {
        load: function(callback) {
            $rootScope.sendGet("/product/list", {}, function(res, status, headers, config) {
				return ZCar.doCallback(res, callback);
            });
        },
		
        getUserData:function(key){
            return key ? userData[key]: userData;
        }

    };
	return Product;
}]);

// 服务明细 service
moduleS.factory("ProductItem", ["$rootScope", "$http", function($rootScope, $http) {
    var ProductItem = {
        load: function(callback) {
            $rootScope.sendGet("/product/item", {}, function(res, status, headers, config) {
                return ZCar.doCallback(res, callback);
            });
        },
        
        getUserData:function(key){
            return key ? userData[key]: userData;
        }

    };
    return ProductItem;
}]);


// 服务详细 Controller
moduleC.controller("ProductItemCtrl", ["$rootScope", "$scope", "$state", "$stateParams", "$timeout", "User", "ProductItem", function($rootScope, $scope, $state, $stateParams, $timeout, User, ProductItem) {
    $scope.loaded = false;
    $scope.failed = false;
    $scope.action = ($stateParams.action || "/sold").substr(1).toLowerCase();
    $scope.id = $stateParams.id || "";
	console.log($stateParams);
	
    $scope.userData = User.getUserData();
    $scope.item = {"id": "S003", "img": "/common/img/service/7.png", "name": "安全防护", "price": 15, "unit": "元/月", "description": "多维度安全保护,安心托管各种应用"};
	
	$scope.menu = $scope.action;
	document.title = "开放平台-服务详细";
	$timeout(function() {jQuery(".navbar-header").hide();}, 100);


    $scope.show = function(item){
        ZCar.openInside("/product/item.html?id=" + item.id, false);
    }
	
    // 加载首页信息
    if(!$scope.loaded) {
        ProductItem.load(function(data) {
            $scope.loaded = true;
            $scope.item = data.list;
        });
    }

}]);

