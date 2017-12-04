// JavaScript Document
var inq = angular.module('inq', ['ngRoute', 'inqcontroller', 'templateservicemod', 'navigationservice', 'angularFileUpload', 'angular-loading-bar','timer']);

/*
Client ID : 951565546728-s8mpt0u6nblg7qv6mpom6arvqm2o7qp8.apps.googleusercontent.com
Client Secret ID: qVyozubT7R6e2R3opkQq1Rhv
*/
inq.run(function ($rootScope, $location, $route, $interval) {

    $rootScope.$on('$routeChangeStart', function () {

        //show loading gif
        //$rootScope.loadingdiv = true;
        console.log("APP MADE TRUE");
        $rootScope.errormsg = '';

    });
    $rootScope.$on('$routeChangeSuccess', function () {

        //hide loading gif
        /*$interval(function () {
            console.log("APP MADE FALSE");
            $rootScope.loadingdiv = false;
        }, 1000, 1);*/


    });
    $rootScope.$on('$routeChangeError', function () {

        //hide loading gif
        $rootScope.loadingdiv = false;

    });
});


inq.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/home', {
            templateUrl: 'views/template.html',
            controller: 'home'
        }).
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        }).
        when('/subjects', {
            templateUrl: 'views/template.html',
            controller: 'subjectsCtrl'
        }).
        when('/standards', {
            templateUrl: 'views/template.html',
            controller: 'standardsCtrl'
        }).
        when('/tests', {
            templateUrl: 'views/template.html',
            controller: 'testsCtrl'
        }).
        when('/concepts/:chapterid', {
            templateUrl: 'views/template.html',
            controller: 'conceptsCtrl'
        }).
        when('/testresults', {
            templateUrl: 'views/template.html',
            controller: 'testresultsCtrl'
        }).
        when('/chapters/:subjectid', {
            templateUrl: 'views/template.html',
            controller: 'chaptersCtrl'
        }).
        when('/conceptcards/:conceptid', {
            templateUrl: 'views/template.html',
            controller: 'conceptcardsCtrl'
        }).
        when('/practice', {
            templateUrl: 'views/template.html',
            controller: 'practiceCtrl'
        }).
        when('/profile', {
            templateUrl: 'views/template.html',
            controller: 'profileCtrl'
        }).
        when('/dashboard', {
            templateUrl: 'views/template.html',
            controller: 'dashboardCtrl'
        }).
        when('/starred', {
            templateUrl: 'views/template.html',
            controller: 'starredCtrl'
        }).
        when('/leaderboard', {
            templateUrl: 'views/template.html',
            controller: 'leaderboardCtrl'
        }).

        otherwise({
            redirectTo: '/home'
        });
  }]);

inq.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});


inq.filter('imagepath', function () {
    return function (input) {
        //return "http://localhost/rest/rest/uploads/" + input;
        return "http://learnwithinq.com/adminpanel/rest/uploads/" + input;

    };

});
inq.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {
                        'event': event
                    });
                });

                event.preventDefault();
            }
        });
    };
});

inq.filter('letterFromCode', function () {
    return function (input) {
        var code = input % 26;
        return String.fromCharCode(65 + code);
    };
});
//directive for file value
inq.directive('fileModel',['$parse',function($parse){
    return{
    restrict:'A',
    link:function(scope, element, attrs){
        var model=$parse(attrs.fileModel);
        var modelsetter=model.assign;
        element.bind('change',function(){
            scope.$apply(function(){
                modelsetter(scope,element[0].files[0]);
            });
        });
    }

    };
}]);

inq.directive('onChangeEvent', function() {
    return {
      restrict: 'A',
      scope: {
        onChangeEvent: '&'
      },
      link: function(scope, elem, attr, ctrl) {
        scope.$watch(attr.fileModel, function (v) {
        elem.bind('change', function(e) {
          scope.$apply(function() {
            scope.onChangeEvent();
          });
        });
    })
      }
    };
  });

