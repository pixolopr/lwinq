// JavaScript Document
var inq = angular.module('inq', ['ngRoute', 'inqcontroller', 'templateservicemod', 'navigationservice', 'angularFileUpload', 'angular-loading-bar', 'timer']);

/*
Client ID : 951565546728-s8mpt0u6nblg7qv6mpom6arvqm2o7qp8.apps.googleusercontent.com
Client Secret ID: qVyozubT7R6e2R3opkQq1Rhv
*/
inq.run(function ($rootScope, $location, $route, $interval) {

    $rootScope.$on('$routeChangeStart', function () {

        //show loading gif
        //$rootScope.loadingdiv = true;
        $rootScope.progressstatus = $location.path().includes('concepts');
        console.log("APP MADE TRUE");
        $rootScope.errormsg = '';

    });
    $rootScope.$on('$routeChangeSuccess', function () {

        var path = $location.path();
        if (path.match(/\//g).length == 1) {
           
           
            path=path.substring(1);
        } else {
            
            path = path.substring(1, path.indexOf('/', 1));
        }
            console.log(path);
        $('.menu-item').removeClass('active');
         $('#'+path).addClass('active');
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


inq.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
        console.log($locationProvider);

        $routeProvider.
        when('/home', {
            templateUrl: 'views/halfPageTemplate.html',
            controller: 'home'
        }).
        when('/landing', {
            templateUrl: 'views/landing.html',
            controller: 'landingCtrl'
        }).
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        }).
        when('/bookmark', {
            templateUrl: 'views/bookmark.html',
            controller: 'bookmarkCtrl'
        }).
        when('/subjects', {
            templateUrl: 'views/halfPageTemplate.html',
            controller: 'subjectsCtrl'
        }).
        when('/standards', {
            templateUrl: 'views/halfPageTemplate.html',
            controller: 'standardsCtrl'
        }).
        when('/tests/:controllername', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'commontestsCtrl'
        }).
        when('/concepts/:chapterid', {
            templateUrl: 'views/halfPageTemplate.html',
            controller: 'conceptsCtrl'
        }).
        when('/testresults', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'testresultsCtrl'
        }).
        when('/chapters/:subjectid', {
            templateUrl: 'views/halfPageTemplate.html',
            controller: 'chaptersCtrl'
        }).
        when('/conceptcards/:conceptid', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'conceptcardsCtrl'
        }).
        when('/practice', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'practiceCtrl'
        }).
        when('/profile', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'profileCtrl'
        }).
        when('/dashboard', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'dashboardCtrl'
        }).
        when('/doubts', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'doubtsCtrl'
        }).
        when('/answers/:ques_id', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'answersCtrl'
        }).
        when('/starred', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'starredCtrl'
        }).
        when('/leaderboard', {
            templateUrl: 'views/fullPageTemplate.html',
            controller: 'leaderboardCtrl'
        }).
        when('/starredcards/:conceptid', {
            templateUrl: 'views/starredcards.html',
            controller: 'starredcardsCtrl'
        }).
        when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'signupCtrl'
        }).


        otherwise({
            redirectTo: '/login'
        });
        // $routeProvider.html5Mode(true);


  }
]);

inq.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

inq.filter("timeago", function () {
		//time: the time
		//local: compared to what time? default: now
		//raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
		return function (time, local, raw) {
				if (!time) return "never";

				if (!local) {
						(local = Date.now())
				}

				if (angular.isDate(time)) {
						time = time.getTime();
				} else if (typeof time === "string") {
						time = new Date(time).getTime();
				}

				if (angular.isDate(local)) {
						local = local.getTime();
				}else if (typeof local === "string") {
						local = new Date(local).getTime();
				}

				if (typeof time !== 'number' || typeof local !== 'number') {
						return;
				}

				var
						offset = Math.abs((local - time) / 1000),
						span = [],
						MINUTE = 60,
						HOUR = 3600,
						DAY = 86400,
						WEEK = 604800,
						MONTH = 2629744,
						YEAR = 31556926,
						DECADE = 315569260;

				if (offset <= MINUTE)              span = [ '', raw ? 'now' : 'less than a minute' ];
				else if (offset < (MINUTE * 60))   span = [ Math.round(Math.abs(offset / MINUTE)), 'min' ];
				else if (offset < (HOUR * 24))     span = [ Math.round(Math.abs(offset / HOUR)), 'hr' ];
				else if (offset < (DAY * 7))       span = [ Math.round(Math.abs(offset / DAY)), 'day' ];
				else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
				else if (offset < (YEAR * 10))     span = [ Math.round(Math.abs(offset / YEAR)), 'year' ];
				else if (offset < (DECADE * 100))  span = [ Math.round(Math.abs(offset / DECADE)), 'decade' ];
				else                               span = [ '', 'a long time' ];

				span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
				span = span.join(' ');

				if (raw === true) {
						return span;
				}
				return (time <= local) ? span + ' ago' : 'in ' + span;
		}
});
inq.filter('thousandSuffix', function () {
    return function (input, decimals) {
      var exp, rounded,
        suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

      if(window.isNaN(input)) {
        return null;
      }

      if(input < 1000) {
        return input;
      }

      exp = Math.floor(Math.log(input) / Math.log(1000));

      return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
    };
  });


inq.filter('imagepath', function () {
    return function (input) {

//         return "http://localhost/rest/uploads/" + input;
        return "http://learnwithinq.com/rest/uploads/" + input;

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
inq.filter('percenttograde', function () {
    return function (percent) {

        if (percent >= 0) {
            if (percent >= 91) {

                return 'A';
            } else if (percent >= 75) {

                return 'B';
            } else if (percent >= 60) {
                return 'C';

            } else if (percent >= 45) {

                return 'D';
            } else {

                return 'E';
            }

        }
    };
});
inq.filter('letterFromCode', function () {
    return function (input) {
        var code = input % 26;
        return String.fromCharCode(65 + code);
    };
});
inq.filter('roundoff', function () {
    return function (value, decimals) {
        if (value)
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        else
            return 0;
    };
});
//directive for file value
inq.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelsetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelsetter(scope, element[0].files[0]);
                });
            });
        }

    };
}]);

inq.directive('onChangeEvent', function () {
    return {
        restrict: 'A',
        scope: {
            onChangeEvent: '&'
        },
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.fileModel, function (v) {
                elem.bind('change', function (e) {
                    scope.$apply(function () {
                        scope.onChangeEvent();
                    });
                });
            })
        }
    };
});

/*Return count of a particular value from array*/
inq.filter('countOfValueInArray', function () {
    return function (items, value) {
        angular.forEach(items, function (item) {
            count += item == value ? 1 : 0;
        });
        return count;
    };
});


inq.filter('getCountOfAttempts', function () {
    return function (items) {
        angular.forEach(items, function (item) {
            count += item.answergiven != 0 ? 1 : 0;
        });
        return count;
    };
});
