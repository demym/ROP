// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
   .state('app', {
      url: "/app",
      abstract: true,
	  cache: false,
      templateUrl: "menu.html",
      controller: 'AppCtrl'
    })
	
	
   .state('app.homepage', {
      url: "/homepage",
      views: {
        'menuContent' :{
          templateUrl: "homepage.html",
		  controller: "HomepageCtrl"
        },
		'menuLeft' :{
          templateUrl: "menu_left.html",
		  controller: "HomepageCtrl"
        }
      }
    })
	  .state('app.ropprojects', {
		  cache: false,
      url: "/ropprojects",
      views: {
        'menuContent' :{
          templateUrl: "ropprojects.html",
		  controller: "RopprojectsCtrl"
        },
		'menuRight' :{
          templateUrl: "menu_ropprojects.html",
		  controller: "RopprojectsCtrl"
        },
		'menuLeft' :{
          templateUrl: "menu_left.html",
		  controller: "HomepageCtrl"
        }
      }
    })
	.state('app.sobject', {
      url: "/sobject",
	  cache: false,
	  params: { data: {} },
      views: {
        'menuContent' :{
          templateUrl: "sobject.html",
		  controller: 'WfeCtrl'
        },
		'menuLeft' :{},
		'menuRight':{}
      }
	  
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/homepage');

})








.directive('wfedoc', function($compile,globals,$http) {
  return {
    restrict: 'E',
    scope: {
      all: '=',
	  doc: '='
     //bindAttr: '='
    },
    templatex: '<div><div class="button-bar" ng-repeat="act in all.wfe.actions"><button class="button fixbutton button-small button-positive" id="{{act.endstatus}}" ng-click=performAction("{{act.endstatus}}") >{{act.description}}</button><!--<input id={{act.endstatus}} type="button" ng-click=performAction("{{act.endstatus}}")  value="{{act.description}}" />--></div><div ng-repeat="(key,value) in all.wfe"><div style="width: 100px">{{key}}</div><input id="{{key}}" value="{{value}}"></div></div>',
	template: '<div><div class="button-bar" ng-repeat="act in all.wfe.actions"><button class="button fixbutton button-small button-positive" id="{{act.endstatus}}" ng-click=performAction("{{act.endstatus}}") >{{act.description}}</button><!--<input id={{act.endstatus}} type="button" ng-click=performAction("{{act.endstatus}}")  value="{{act.description}}" />--></div><div style="padding: 3px"><table border=1 width=100% ><tr ng-repeat="(key,value) in all.wfe"><td>{{key}}</td><td><input id="{{key}}" value="{{value}}"/></td></tr></table></div></div>',
    replace: true,
    //require: 'ngModel',
    link: function($scope, elem, attr, ctrl) {
      console.debug($scope);
	  
	  
	  $scope.performsAction=function(actionid,callback) {
		  
	
		  console.log($scope)
		  
		  var url=globals.rooturl+"/wfe/doaction/"+actionid;
		  var wfe = $scope.all.wfe;

	        var fd={
	         doc: $scope.doc,
	         wfe: $scope.all.wfe
	   
	       }
		   globals.loadingShow();
		  $http.post(url,{
			  sdata: JSON.stringify($scope.all)
				  
			  
		  })
		  .success(function(data){
			  $scope.all=data;
			  globals.loadingHide();  
			  if (callback) callback(data)
			 /* $('#element').empty().jsonView(data);
		  $('#element ul').removeClass().css("border","1px solid black").collapsible();*/
	
	//$('#element ul').collapsible("expand");
		  })
		  .error(function(data){
			  globals.loadingHide();  
			  if (callback) callback(data)
			  
		  })
	  }
      //var textField = $('input', elem).attr('ng-model', 'myDirectiveVar');
      // $compile(textField)($scope.$parent);
    }
  };
})

.directive('demytree', function ($compile) {
	
	var linker = function(scope, element, attrs) {
		
		return;
		
        nestObject(scope.items)
			nest="<ion-list>"+nest+"</ion-list>"
			element.append(nest)
    		$compile(element.contents())(scope)
    }
	
	
    return {
        restrict: 'E',
		replace: true,
        scope: {
            items: '=',
            collapsed: '=',
            templateUrl: '@'
        },
        //templateUrl: CONF.baseUrl + '/ion-tree-list.tmpl.html',
		stemplate: "<ul><member ng-repeat='item in items' member='item'></member></ul>",
        controller: function($scope){
            $scope.baseUrl = CONF.baseUrl;
            $scope.toggleCollapse = toggleCollapse;

            $scope.$watch('collapsed', function(){
                $scope.toggleCollapse($scope.items);
            });

            $scope.$watch('items', function(){
				console.log("items changed!")
				linker();
                //$scope.items = addDepthToTree($scope.items, 1, $scope.collapsed);
	        });

          /*  $scope.templateUrl = $scope.templateUrl ? $scope.templateUrl : 'item_default_renderer';*/
        },
		link: linker
		
		
    }
})

.directive('member', function ($compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			member: '=',
			iter: '='
		},
		stemplate: "<li>{{member.name}}</li>",
		link: function (scope, element, attrs) {
			
			alert(nestObject(scope.member))
			
			
			/*for (var k in scope.member){
				console.log("***"+k+" - "+scope.member[k])
				
				if (angular.isArray(scope.member[k])) {
				console.log(k+" is an array")
				scope.iter=scope.member[k];
				element.append("<ul><member ng-repeat='member in iter' member='iter'></member></ul>"); 
				$compile(element.contents())(scope)
			} else {
				console.log(scope.member.name+" is not an array")
				
			}
				
				
			}*/
			
			
		}
	}
})

;