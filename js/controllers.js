var inqcontroller = angular.module('inqcontroller', ['templateservicemod', 'navigationservice']);

var adminurl = "http://localhost/rest/rest/index.php/";
var imageurl = "http://localhost/rest/rest/uploads/";
//var adminurl = "http://learnwithinq.com/adminpanel/rest/index.php/";
//var imageurl = "http://learnwithinq.com/adminpanel/rest/uploads/";

var usertypes = [
    {
        id: 1,
        'type': 'teacher',
        'image': 'img/feed/teacher.svg'
        },
    {
        id: 2,
        'type': 'Inhouse',
        'image': 'img/feed/inhouse.svg'
        },
    {
        id: 3,
        'type': 'Non In-house',
        'image': 'img/feed/noninhouse.svg'
        }
    ];

inqcontroller.controller('home', ['$scope', 'TemplateService', 'NavigationService', '$rootScope',
  function ($scope, TemplateService, NavigationService, $rootScope) {

        $scope.template = TemplateService; // loading the TemplateService
        TemplateService.content = "views/content.html"; // setting the content of the page as content.html
        $scope.title = "Home";
        $scope.navigation = NavigationService.getnav();
        $rootScope.loginpage = false;

        //INITIALIZATIONS

        /*NAVIGATION SET*/
        var nav = {
            location: "/home",
            title: "INQ",
            position: 0,
            clickable: true
        };
        $rootScope.navigation = $.jStorage.get("navigation");
        $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
            return n.position < nav.position;
        });
        $rootScope.navigation[nav.position] = nav;
        $.jStorage.set("navigation", $rootScope.navigation);
        /*SET NAVIGATION END*/

        /*function*/

        // routing

  }]);

inqcontroller.controller('loginCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $location) {

        $scope.title = "Login";

        //INITIALIZATIONS
        $scope.error = false;
        $scope.logindata = {
            contact: "",
            password: ""
        };

        $rootScope.showmenu = false;

        var loginsuccess = function (response) {
            if (response.data == 'false') { // if login fails i.e. no data received
                console.log('Login error');
                $scope.error = true;
            } else {
                $scope.error = false;
                console.log(response.data);
                $.jStorage.set('user', response.data);
                $rootScope.showmenu = true;
                if ($.jStorage.get('user').access_id != 3) { // if teacher or in-house stud
                    $location.path('/subjects');
                } else { // if non in-house person
                    $location.path('/standards');
                }
            }
        };

        /*function*/
        $scope.dologin = function () {
            $scope.error = false;
            console.log($scope.logindata);
            NavigationService.dologin($scope.logindata.contact, $scope.logindata.password).then(loginsuccess); // try login and if success goto loginsuccess function
        }

        // routing

  }]);

inqcontroller.controller('standardsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $location) {

        $scope.title = "Standards";
        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/standards.html";

        /*NAVIGATION SET*/
        var nav = {
            location: "/home",
            title: "INQ",
            position: 0,
            clickable: true
        };
        $rootScope.navigation = $.jStorage.get("navigation");
        $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
            return n.position < nav.position;
        });
        $rootScope.navigation[nav.position] = nav;
        $.jStorage.set("navigation", $rootScope.navigation);
        /*SET NAVIGATION END*/

        var getstandardsuccess = function (response) {
            console.log(response.data);
            $scope.standards = response.data;
            $rootScope.loadingdiv = false;
        };

        var getstandarderror = function (response) {
            console.log(response.data);
        };

        //INITIALIZATIONS
        $rootScope.loadingdiv = true;
        console.log($rootScope.loadingdiv);
        NavigationService.getstandardsbyboardid($.jStorage.get('user').board_id).then(getstandardsuccess, getstandarderror); // get the standards related to user's board_id
        $.jStorage.get("user").standard_id = 0; // setting the default when no standards are selected
        $.jStorage.get("user").standard_name = "No"; // Initially the standard will appear as no standard

        /*function*/

        // routing
        $scope.gotosubjects = function (index) {
            $.jStorage.get('user').standard_id = $scope.standards[index].id;
            var name = $scope.standards[index].name;
            $.jStorage.get('user').standard_name = name;
            $location.path('/subjects');
        };

  }]);

inqcontroller.controller('conceptcardsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval', '$routeParams', '$sce', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval, $routeParams, $sce, $location) {

        $scope.title = "ConceptCards";
        $scope.template = TemplateService;
        TemplateService.content = "views/conceptcards.html";
        $rootScope.fullpageview = true;
        $scope.conceptid = $routeParams.conceptid;

        var cw = $('.cardbut').width();
        $('.cardbut').css({
            'height': cw + 'px'
        });

        $interval(function () {

            console.log("BAARAJA");

            var $el = $('#baraja-el'),
                baraja = $el.baraja();

            // navigation
            $('#nav-prev').on('click', function (event) {
                baraja.previous();
            });

            $('#nav-next').on('click', function (event) {
                console.log("NEXT");
                baraja.next();

            });

        }, 2000, 1);

        $rootScope.$watch(function () {
            var math = document.getElementById("carddata");
            MathJax.Hub.Queue(["Typeset", MathJax.Hub], math);
            return true;
        });

        //INITIALIZATIONS
        $scope.cardindex = -1; // Initially set the cardindex to -1 so if there are no cards it appeards 0/0 cards
        $scope.user = $.jStorage.get("user");


        /*NAVIGATION SET*/
        $rootScope.navigation = $.jStorage.get("navigation");
        var getdatabyidsuccess = function (response) {
            console.log(response.data);
            var nav = {
                location: $location.path(),
                title: response.data.name,
                position: 4,
                clickable: false
            };
            $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
                return n.position < nav.position;
            });
            $rootScope.navigation[nav.position] = nav;
            $.jStorage.set("navigation", $rootScope.navigation);
        };
        var getdatabyiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getdatabyid('concepts', $scope.conceptid).then(getdatabyidsuccess, getdatabyiderror);
        /*SET NAVIGATION END*/

        var getcardsuccess = function (response) {

            console.log(response.data);

            $scope.conceptcards = response.data;
            if (response.data.length > 0) { // if there is atleast 1 conceptcard then set cardindex to 0
                $scope.cardindex = 0;
            }

            _.forEach($scope.conceptcards, function (value) {
                if (value.user_id == 0) {
                    value.conceptdata = $sce.trustAsHtml(value.conceptdata);
                }
            });

            if (response.data.length > 0) {
                readcardbyuserid(0);
            }
        };

        var getcarderror = function (response) {
            console.log(response.data);
        };

        var readcardsuccess = function (response) {
            console.log(response.data);
            $scope.conceptcards[$scope.cardindex].cardread = 1;
        };

        var readcarderror = function (response) {
            console.log(response.data);
        };

        /*function*/
        NavigationService.getcardsbyconceptid($scope.conceptid, $.jStorage.get("user").id).then(getcardsuccess, getcarderror);

        var readcardbyuserid = function (cid) {
            if ($scope.conceptcards[cid].cardread == 0) {
                NavigationService.readcardbyuserid($.jStorage.get("user").id, $scope.conceptcards[cid].id).then(readcardsuccess, readcarderror);
                console.log("CALLING STATEMENT");
            }
        };

        var getconceptnamesuccess = function (response) {
            console.log(response.data);
            $scope.conceptdata = response.data;
        };

        var getconceptnameerror = function (response) {
            console.log(response.data);
        };

        NavigationService.getconceptname($scope.conceptid).then(getconceptnamesuccess, getconceptnameerror);

        // routing
        $scope.changecardindex = function (index) {
            if ($scope.conceptcards[$scope.cardindex].user_id == $scope.user.id && $scope.conceptcards[$scope.cardindex].editmode == true) {
                alert("Card not saved");
            } else if ($scope.cardindex == 0 && index == -1) {

            } else if ($scope.cardindex == $scope.conceptcards.length - 1 && index == 1) {

            } else if ($scope.cardindex >= 0 && $scope.cardindex < $scope.conceptcards.length) {
                $scope.cardindex += index; // keep changing the index, +1 for next and -1 for previous
                readcardbyuserid($scope.cardindex);
            }
        };

        $scope.addcustomusercard = function () {

            $scope.conceptcards.splice($scope.cardindex + 1, 0, { // add the card such that when we click on + the new card is added next to the current card and the index is same as current card's index
                user_id: $.jStorage.get("user").id,
                cardnumber: $scope.conceptcards[$scope.cardindex].cardnumber,
                conceptdata: "",
                editmode: true,
                concept_id: $scope.conceptid,
                id: 0
            });

            console.log($scope.conceptcards);

            /*CHANGE CARD INDEX TO +1 */
            $scope.changecardindex(1);
            /*CHANGE CARD*/
            var $el = $('#baraja-el'),
                baraja = $el.baraja();
            baraja.updateStack()
        };

        var savecustomcardssuccess = function (response) {
            console.log(response.data);
            console.log($scope.conceptcards[$scope.cardindex]);
            if (response.data != "false") {
                $scope.conceptcards[$scope.cardindex].editmode = false;

                if (response.data != "true") {
                    $scope.conceptcards[$scope.cardindex].id = response.data;
                }
            }

        };
        var savecustomcardserror = function (response) {
            console.log(response.data);
        };

        /* SAVE CUSTOM CARD */
        $scope.savecustomusercard = function (ind) {
            console.log($scope.conceptcards[ind]);
            NavigationService.savecustomcards($scope.conceptcards[ind]).then(savecustomcardssuccess, savecustomcardserror);
        };

        /* EDIT CUSTOMER CARD MODE */
        $scope.editcustomusercard = function (ind) {
            $scope.conceptcards[ind].editmode = true;
        };


        $scope.deletecustomusercard = function (ind) {
            /*ASK FOR CONFIRMATION*/
            $scope.conceptcards[ind].editmode = false;
        };

  }]);

inqcontroller.controller('testsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval', '$q','$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval, $q, $location) {

        $scope.title = "Tests";
        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/tests.html";

        //INITIALIZATIONS
        var test_questions_array = []; //USED to store data of test answers and options order

        //STYLING
        $interval(function () {

            /*TOOLTIPS FOR BUTTONS*/
            $('.tooltipped').tooltip({
                delay: 10
            });

            /*INITIALIZE MODALS*/
            $(document).ready(function () {
                // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
                $('.modal').modal();
            });

        }, 2000, 1);

        /*Design Functions*/

        /*Open Modal - ERROR REPORT OR DOUBT*/
        $scope.openmodal = function (modalname) {
            console.log("open modal");
            $(modalname).modal('open');
        };

        /*BOOKMARK QUESTION*/
        $scope.bookmarkquestion = function (id) {
            //CHECK IF BOOKMARKED OR TO REMOVE BOOKMARK
            //SET TEXT ACCORDINGLY
            var bookmarktoasttext = "This Question has been Bookmarked !"
                /*ON SUCCESS OF BOOKMARKING*/
            var $toastContent = $('<span>' + bookmarktoasttext + '</span>').add($('<button class="btn-flat toast-action" ng-click="bookmarkquestion()">Undo</button>'));
            Materialize.toast($toastContent, 3000);
        };

        /*function*/
        var getscoresfromchapterssuccess = function (response) {
            console.log(response.data);
            $scope.questions_data_response = response.data;

            var number_of_concepts = response.data.length;
            var number_of_concepts_group1 = Math.ceil(number_of_concepts / 2);
            var remaining_number_od_concepts = number_of_concepts - number_of_concepts_group1;
            var question_set = 0;
            var data_start = 0;
            var data_end = 0;
            $scope.total_questions = 20;

            if (remaining_number_od_concepts > 1) {
                var number_of_concepts_group2 = remaining_number_od_concepts / 2;
                var number_of_concepts_group3 = number_of_concepts_group2;
            } else {
                var number_of_concepts_group2 = 1;
                var number_of_concepts_group3 = 0;
            }

            /*CREATE ARRAY*/
            var create_values_array = function () {
                var create_values_array_deferred = $q.defer();

                var values_array = [];
                for (var va = 0; va < 20; va++) {
                    var level = va < 12 ? 1 : 2;
                    level = va > 15 ? 3 : level;

                    values_array.push({
                        answerval: 0,
                        change: 0,
                        levelval: level
                    });
                };
                create_values_array_deferred.resolve(values_array);

                return create_values_array_deferred.promise;
            };

            /*FIND QUESTIONS*/
            var find_questions = function () {

                var find_questions_deferred = $q.defer();


                while ($scope.questions_array.length < question_set) {

                    for (var cd = data_start; cd < data_end; cd++) {
                        var answerval = $scope.values_array[$scope.questions_array.length].answerval == 0 ? 'questions' : 'answeredquestions';

                        var levelval = $scope.values_array[$scope.questions_array.length].levelval == 1 ? 'easy' : 'medium';
                        levelval = $scope.values_array[$scope.questions_array.length].levelval == 3 ? 'hard' : levelval;

                        console.log(cd, answerval, levelval);
                        var length_of_set = $scope.questions_data_response[cd][answerval][levelval].length;
                        if (length_of_set != 0) {
                            /*QUESTIONS ARE THERE*/
                            /*FIND RANDOM QUESTION*/
                            var random_number = Math.floor(Math.random() * (length_of_set - 1));
                            /*ADD QUESTION ID TO ARRAY*/
                            $scope.questions_array.push($scope.questions_data_response[cd][answerval][levelval][random_number]);
                            /*REMOVE THAT QUESTION TO NOT USE AGAIN*/
                            $scope.questions_data_response[cd][answerval][levelval].splice(random_number, 1);
                            console.log($scope.questions_array);

                            /*CHECK IF WE ARE DONE WITH THE SET*/
                            if ($scope.questions_array.length == question_set) {
                                if (number_of_concepts_group3 != 0) {
                                    if (question_set != $scope.total_questions) {
                                        data_start = data_end;
                                        data_end = data_start + number_of_concepts_group2;
                                        question_set += 4;
                                    };
                                };
                            };

                        } else {
                            /*NO QUESTIONS OF SUCH TYPE*/
                            if ($scope.values_array[$scope.questions_array.length].change == 3) {
                                /*CHANGE QUESTION ANSWERED TYPE IF CHANGED ALREADY THREE TIMES*/
                                $scope.values_array[$scope.questions_array.length].answerval = 1;
                            };
                            /*CHANGE LEVEL TYPE*/
                            $scope.values_array[$scope.questions_array.length].levelval = $scope.values_array[$scope.questions_array.length].levelval == 3 ? 1 : $scope.values_array[$scope.questions_array.length].levelval + 1;

                            $scope.values_array[$scope.questions_array.length].change++;

                            console.log($scope.values_array[$scope.questions_array.length].levelval);
                            console.log($scope.values_array[$scope.questions_array.length].answerval);
                            console.log($scope.values_array[$scope.questions_array.length].change);

                            cd -= 1;
                        };

                    };
                };

                find_questions_deferred.resolve($scope.questions_array);

                return find_questions_deferred.promise;

            };

            var gettestquestionssuccess = function (response) {
                console.log(response.data);
                $scope.test_questions = response.data;

                _.forEach($scope.test_questions, function (value) {
                    var temporaryValue, randomIndex;
                    var temporaryarr;
                    var optionsorder = [1, 2, 3, 4];

                    // While there remain elements to shuffle...
                    for (var oi = 0; oi < value.options.length; oi++) {
                        // Pick a remaining element...
                        randomIndex = Math.floor(Math.random() * oi);

                        // And swap it with the current element.
                        temporaryValue = value.options[oi];
                        value.options[oi] = value.options[randomIndex];
                        value.options[randomIndex] = temporaryValue;

                        temporaryarr = optionsorder[oi];
                        optionsorder[oi] = optionsorder[randomIndex];
                        optionsorder[randomIndex] = temporaryarr;
                    }
                    test_questions_array.push({
                        question_id: value.qid,
                        answergiven: 0,
                        optionsorder: optionsorder
                    });
                });
                console.log(test_questions_array);
            };
            var gettestquestionserror = function (response) {
                console.log(response.data);
            };

            if ($scope.questions_data_response.length > 0) {
                var create_values_array_promise = create_values_array()
                create_values_array_promise.then(
                    function (response) {
                        /*SUCCESS IN CREATING ARRAY*/
                        console.log(response);
                        question_set = 12;
                        data_start = 0;
                        data_end = number_of_concepts_group1;
                        $scope.values_array = response;
                        $scope.questions_array = [];
                        var find_questions_promise = find_questions();
                        find_questions_promise.then(
                            function (response) {
                                /*QUESTIONS ARRAY RADY*/
                                NavigationService.gettestquestions(response).then(gettestquestionssuccess, gettestquestionserror);
                            },
                            function (response) {
                                /*QUESTIONS ARRAY ERROR*/
                            });
                    },
                    function (response) {
                        /*ERROR IN CREATING VALUE ARRAY*/
                    });
            }else{
                alert("Not enough Concepts in this chapter");
            };
        };
        var getscoresfromchapterserror = function (response) {
            console.log(response.data);
        };
        NavigationService.getscorefromchapterids($.jStorage.get('user').id, $rootScope.chaptersarray).then(getscoresfromchapterssuccess, getscoresfromchapterserror);

        /*TIMER FUNCTION*/
        $scope.countdown = {
            minutes: 2,
            seconds: 0
        };

        $interval(function () {
            $scope.countdown.minutes--;
            $scope.countdown.seconds = 59;
            var timer_interval = $interval(function () {
                if ($scope.countdown.seconds > 0) {
                    $scope.countdown.seconds--;
                    if ($scope.countdown.seconds == 0) {
                        $scope.countdown.minutes--;
                        if ($scope.countdown.minutes == 0) {
                            $interval.cancel(timer_interval);
                        }
                    }
                } else {
                    $scope.countdown.seconds = 59;
                };
            }, 1000);
        }, 1000, 1);

        /* TO PAUSE TIMER
        $interval.pause(timer_interval);
        */


        /* DISPLAY TEST FUNCTIONALITIES */
        $scope.test_question_number = 0;

        $scope.change_question = function (ind) {
            if (ind == 1 || ind == -1) {
                $scope.test_question_number += ind;
            } else {
                $scope.test_question_number = ind;
            };
        };

        /*SCORING*/
        $scope.optionselected = function (ind) {
            test_questions_array[$scope.test_question_number].answergiven = test_questions_array[$scope.test_question_number].optionsorder[ind];
            console.log(test_questions_array);
            if ($scope.test_question_number < $scope.test_questions.length) {
                $scope.change_question(1);
            };
        };


        /*STORE TEST ON SUBMIT*/
        $scope.submittest = function () {
            var store_test_detailssuccess = function (response) {
                console.log(response.data);
                if(response.data == "true"){
                    $('#end-modal').modal('close');
                    $location.path("/testresults");
                };
            };
            var store_test_detailserror = function (response) {
                console.log(response.data);
            };

            /*CONVERT optionsorder TO STRING*/
            _.forEach(test_questions_array, function (value) {
                value.optionsorder = JSON.stringify(value.optionsorder);
            });

            NavigationService.store_test_details($.jStorage.get("user").id, $rootScope.chaptersarray, "chapter", test_questions_array).then(store_test_detailssuccess, store_test_detailserror);
        };

        // routing

}]);

inqcontroller.controller('conceptsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.title = "Concepts";
        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/concepts.html";
        $scope.chapterid = $routeParams.chapterid;

        //INITIALIZATIONS

        /*NAVIGATION SET*/
        $rootScope.navigation = $.jStorage.get("navigation");
        console.log($rootScope.navigation);
        var getdatabyidsuccess = function (response) {
            console.log(response.data);
            var nav = {
                location: $location.path(),
                title: response.data.name,
                position: 3,
                clickable: true
            };
            $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
                return n.position < nav.position;
            });
            $rootScope.navigation[nav.position] = nav;
            $.jStorage.set("navigation", $rootScope.navigation);
        };
        var getdatabyiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getdatabyid('chapters', $scope.chapterid).then(getdatabyidsuccess, getdatabyiderror);
        /*SET NAVIGATION END*/

        /*FETCH CONCEPTS BY CHAPTER ID*/
        var getconceptsbychapteridsuccess = function (response) {

            $scope.concepts = response.data;
            $rootScope.loadingdiv = false;
            console.log(response.data);

            //STYLING
            var stylepage = function () {
                var height = $('.conceptdiv').height();
                height = height / 2;
                $scope.negativemargin = height;
            };

            var style = $interval(function () {
                console.log("TRYING");
                if ($('.conceptdiv').height() == 0) {

                } else {
                    stylepage();
                    $interval.cancel(style);
                };
            }, 50, 0);
        };

        var getconceptsbychapteriderror = function (response) {
            console.log(response.data);
        };

        $rootScope.loadingdiv = true;
        NavigationService.getconceptsbychapterid($.jStorage.get('user').id, $scope.chapterid).then(getconceptsbychapteridsuccess, getconceptsbychapteriderror);
        //END OF FETCHING CONCEPTS

        // routing
        $scope.gotoconceptcards = function (id) {
            $location.path('/conceptcards/' + id);
        };
        $scope.gototest = function () {
            $rootScope.chaptersarray = $scope.chapterid;
            $location.path('/tests');
        };

  }]);

inqcontroller.controller('testresultsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope',
  function ($scope, TemplateService, NavigationService, $rootScope) {

        $scope.title = "testresults";
        $scope.template = TemplateService;
        TemplateService.content = "views/testresults.html";
        $rootScope.fullpageview = true;
        $scope.conceptwidth = 70;

        //INITIALIZATIONS

        /*function*/

        // routing

  }]);

inqcontroller.controller('subjectsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $location) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/subjects.html";
        $scope.navigation = NavigationService.getnav();

        //INITIALIZATIONS

        /*NAVIGATION SET*/
        $rootScope.navigation = $.jStorage.get("navigation");
        var getdatabyidsuccess = function (response) {
            console.log(response.data);
            var nav = {
                location: $location.path(),
                title: response.data.name,
                position: 1,
                clickable: true
            };
            $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
                return n.position < nav.position;
            });
            $rootScope.navigation[nav.position] = nav;
            $.jStorage.set("navigation", $rootScope.navigation);
        };
        var getdatabyiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getdatabyid('standards', $.jStorage.get('user').standard_id).then(getdatabyidsuccess, getdatabyiderror);
        /*SET NAVIGATION END*/

        /*GET SUBJECTS FROM USER's STANDARD ID*/
        var getsubjectsbyuseridsuccess = function (response) {
            console.log(response.data);
            $scope.subjects = response.data;
            $rootScope.loadingdiv = false;
        };

        var getsubjectsbyuseriderror = function (response) {
            console.log(response.data);
        };
        /*MAKE LOADING TRUE*/
        $rootScope.loadingdiv = true;
        NavigationService.getsubjectsbyuserid($.jStorage.get('user').standard_id).then(getsubjectsbyuseridsuccess, getsubjectsbyuseriderror);
        /*END OG FETCHING SUBJECTS*/

        /*function*/

        // routing
        $scope.gotochapters = function (subjectid) {
            $location.path('/chapters/' + subjectid);
        };

                }]);

inqcontroller.controller('chaptersCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/chapters.html";
        $scope.navigation = NavigationService.getnav();

        //STYLING

        //INITIALIZATIONS
        $scope.subjectid = $routeParams.subjectid;

        /*NAVIGATION SET*/
        $rootScope.navigation = $.jStorage.get("navigation");
        var getdatabyidsuccess = function (response) {
            console.log(response.data);
            var nav = {
                location: $location.path(),
                title: response.data.name,
                position: 2,
                clickable: true
            };
            $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
                return n.position < nav.position;
            });
            $rootScope.navigation[nav.position] = nav;
            $.jStorage.set("navigation", $rootScope.navigation);
        };
        var getdatabyiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getdatabyid('subjects', $scope.subjectid).then(getdatabyidsuccess, getdatabyiderror);
        /*SET NAVIGATION END*/

        /*FETCH CHAPTERS FROM SUBJECT ID*/
        var getchaptersbysubjectidsuccess = function (response) {
            console.log(response.data);
            $scope.chapters = response.data;
            $rootScope.loadingdiv = false;
            //STYLING
            var stylepage = function () {
                var height = $('.chaprow').height();
                height = height / 2;
                $scope.negativemargin = height;
            };

            var style = $interval(function () {
                console.log("TRYING");
                if ($('.chaprow').height() == 0) {

                } else {
                    stylepage();
                    $interval.cancel(style);
                };
            }, 50, 0);

        };

        var getchaptersbysubjectiderror = function (response) {
            console.log(response.data);
        };

        $rootScope.loadingdiv = true;
        NavigationService.getchaptersbysubjectid($scope.subjectid).then(getchaptersbysubjectidsuccess, getchaptersbysubjectiderror);
        /*END OF FETCHING CHAPTERS*/

        /*function*/

        // routing
        $scope.gotoconcepts = function (id) {
            $location.path("/concepts/" + id);
        };

  }]);

inqcontroller.controller('profileCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/profile.html";
        $scope.navigation = NavigationService.getnav();

  }]);

inqcontroller.controller('dashboardCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/dashboard.html";
        $scope.navigation = NavigationService.getnav();

        $interval(function () {
            $('ul.tabs').tabs({
                'swipeable': true
            });

            $(document).ready(function () {



                var ctx = document.getElementById("timeline-graph").getContext('2d');


                var mixedChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        datasets: [{
                            label: 'Test Marks',
                            data: [10, 20, 30, 40, 10, 30, 40, 20]
        }, {
                            label: 'Time Spent',
                            data: [10, 30, 40, 20, 10, 30, 40, 20],
                            "fill": false,
                            "borderColor": "rgb(75, 192, 192)",

                            // Changes this dataset to become a line
                            type: 'line'
        }],
                        labels: ['21-09', '22-09', '23-09', '24-09', '25-09', '26-09', '27-09', '28-09']
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
            }]
                        },
                        fill: 'rgba(1,0,0,1)'
                    }
                });

                /*CHAPTERS COLLASIBLE*/
                $('.collapsible').collapsible();

            })
        }, 2000, 1);




                }]);

inqcontroller.controller('starredCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/starred.html";
        $scope.navigation = NavigationService.getnav();

  }]);

inqcontroller.controller('leaderboardCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/leaderboard.html";
        $scope.navigation = NavigationService.getnav();

  }]);

inqcontroller.controller('menuCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService', '$route',
 function ($scope, TemplateService, $location, $rootScope, NavigationService, $route) {



        $scope.template = TemplateService;

        /*INITIALIZATIONS*/
        $scope.user = $.jStorage.get("user");

        /*ROOTSCOPE VALUES*/
        $rootScope.fullpageview = false;

        console.log($.jStorage.get("navigation"));
        if ($.jStorage.get("navigation")) {
            $rootScope.navigation = $.jStorage.get("navigation");
        } else {
            $.jStorage.set("navigation", [{
                location: "/home",
                title: "INQ",
                position: 0,
                clickable: true
        }]);
            $rootScope.navigation = $.jStorage.get("navigation");
        };

        /*NAVIGATION FROM NAV MENU*/
        $rootScope.gotonav = function (clickable, loc) {
            if (clickable) {
                $location.path(loc);
            };
        };


        $('.button-collapse').sideNav({
            menuWidth: 350, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens,

        });

        /*Reload controller*/
        $rootScope.reloadpage = function () {
            $rootScope.errormsg = '';
            $route.reload();
        };

        $scope.logout = function () {
            $location.path('/login');
        };

  }]);

inqcontroller.controller('appCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService', '$route',
 function ($scope, TemplateService, $location, $rootScope, NavigationService, $route) {

        $rootScope.showmenu = true;

 }]);
