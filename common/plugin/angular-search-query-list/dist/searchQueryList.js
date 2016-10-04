var app = angular.module('angularSearchList', []);

app.controller("searchCtrl",['$scope','$document',function($scope,$document){
    $scope.hidetrue = true;
    
    $scope.showList = function($event){
        $scope.hidetrue = false;
        document.getElementById('searchUl').style.display="block";
        if($event.stopPropagation){
          $event.stopPropagation();
        }
    };

    document.onclick = function(){
        $scope.hidetrue = true;
        if(document.getElementById('searchUl')){
            document.getElementById('searchUl').style.display="none";
        }
    };

    $scope.testa = function(obj,$event,defaultQuerykey){
        if($event.stopPropagation){
            $event.stopPropagation();
        }
        $scope.hidetrue = true;

        $scope.defaultValue = obj[defaultQuerykey];

        var storage = window.localStorage;
        storage.setItem("dataLocalStroage", JSON.stringify(obj));

        $scope.action();
         //document.getElementById('searchUl').style.display="block";
    };

}]);
 
app.directive("searchList",function(){
  return{
    restrict: 'AE',
    template:'<div><input type="text" id="searchSelectList" class="form-control" placeholder="输入代运营商户" ng-focus="showList($event)" ng-model="defaultValue"><ul ng-hide="hidetrue" style="margin-left: 14px;" id="searchUl" class="select dropdown-menu" >'+
			    '<li ng-click="testa(obj,$event,defaultQuerykey)" style="line-height: 24px; height: 24px; " ng-repeat="obj in searchData | filter: defaultValue | limitTo: 20 track by $index"><a href="javascript:;">{{obj.name}}</a></li>'+
			'</ul></div>',
    scope: {
        searchData: '=',
        action: "&",
        defaultValue: "@",
        defaultQuerykey: "@"
    },
    link: function(scope, element, attrs){
        element.on('click',function($event){
            if($event.stopPropagation){
              $event.stopPropagation();
            }
            scope.dataLocalStroage = attrs.dataLocalStroage;
            scope.defaultQuerykey = attrs.defaultQuerykey;
            //scope.defaultValue = attrs.defaultValueName;
        });
    },
    controller : "searchCtrl",
    replace:true   
  }
});



