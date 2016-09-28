// register router for Account
moduleI.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("Register", {
            url: "/register",
            template: function() {
                return getHtml("t_help_register");
            },
            controller: "RegisterCtrl"
        })
        .state("Description", {
            url: "/description",
            template: function() {
                return getHtml("../help/template/t_help_description");
            },
            controller: "HelpMenuCtrl"
        })
        .state("Service", {
            url: "/service",
            template: function() {
                return getHtml("t_service");
            },
            controller: "HelpMenuCtrl"
        });

}]);

moduleC.controller("HelpMenuCtrl", ["$scope", "$state", function($scope, $state) {
    $scope.Arrow = true;
    $scope.goArrow = function goArrow(){
        if($scope.Arrow){
            $scope.Arrow = false;
        }else{
            $scope.Arrow = true;
        }
    }
    $scope.goArrow1 = function goArrow1(){
        if($scope.Arrow1){
            $scope.Arrow1 = false;
        }else{
            $scope.Arrow1 = true;
        }
    }
    $scope.goArrow2 = function goArrow2(){
        if($scope.Arrow2){
            $scope.Arrow2 = false;
        }else{
            $scope.Arrow2 = true;
        }
    }
    $scope.goArrow3 = function goArrow3(){
        if($scope.Arrow3){
            $scope.Arrow3 = false;
        }else{
            $scope.Arrow3 = true;
        }
    }

}]);

