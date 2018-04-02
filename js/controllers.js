var inqcontroller = angular.module('inqcontroller', ['templateservicemod', 'navigationservice']);

// var adminurl = "http://localhost/rest/rest/index.php/";
// var imageurl = "http://localhost/rest/rest/uploads/";
var adminurl = "http://learnwithinq.com/adminpanel/rest/index.php/";
var imageurl = "http://learnwithinq.com/adminpanel/rest/uploads/";

var usertypes = [{
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

  }
]);

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
            if (response.data == 'false') {
                // if login fails i.e. no data received
                console.log('Login error');
                $scope.error = true;
            } else {
                $scope.error = false;
                console.log(response.data);
                $.jStorage.set('user', response.data);
                $rootScope.showmenu = true;
                if ($.jStorage.get('user').access_id != 3) {
                    // if teacher or in-house stud
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

  }
]);

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
            console.log(n);
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

  }
]);

inqcontroller.controller('conceptcardsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval', '$routeParams', '$sce', '$location', 'FileUploader', '$injector',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval, $routeParams, $sce, $location, FileUploader, $injector) {
        console.log('conceptcardsCtrl');

        $scope.title = "ConceptCards";
        $rootScope.fullpageview = true;
        $scope.template = TemplateService;
        TemplateService.content = "views/conceptcards.html";
        $scope.conceptid = $routeParams.conceptid;
        $scope.zindexarray = [];
        $scope.glossary = [];
        $scope.otheruserscard = false;
        $scope.uploadfile = function () {
            var formdata = new FormData();

            formdata.append('file', $scope.conceptcards[$scope.cardindex].image);

            NavigationService.getimagename(formdata).success(function (response) {
                console.log(response);
                $scope.conceptcards[$scope.cardindex].image = response; //to change image property
                console.log($scope.conceptcards[$scope.cardindex].image);

            });
        };

        $(document).keyup(function (e) {
            if (e.keyCode == 39 && $scope.zindexarray[$scope.conceptcards.length - 1] != $scope.conceptcards.length)
                $scope.changecardindex(1);
            else if (e.keyCode == 37 && $scope.zindexarray[0] != $scope.conceptcards.length)
                $scope.changecardindex(-1);

        });

        // CHANGE STAR STATUS OF CARDS
        changestarstatussuccess = function (response) {
            $scope.conceptcards[$scope.cardindex].starred = $scope.conceptcards[$scope.cardindex].starred == 1 ? 0 : 1;
        };
        changestarstatuserror = function (response) {
            console.log('Can not change status !');
        };
        $scope.changestarstatus = function () {
            console.log($scope.cardindex);
            console.log($scope.conceptcards[$scope.cardindex]);
            if ($scope.conceptcards[$scope.cardindex].id) {
                if ($scope.conceptcards[$scope.cardindex].starred == 1)
                    NavigationService.removestar($scope.conceptcards[$scope.cardindex].id, $.jStorage.get("user").id).then(changestarstatussuccess, changestarstatuserror);
                else
                    NavigationService.addstar($scope.conceptcards[$scope.cardindex].id, $.jStorage.get("user").id).then(changestarstatussuccess, changestarstatuserror);
            }
        };
        //GET OTHER USERS CARD
        getotheruserscards = function () {
            $scope.otheruserscard = true;
            NavigationService.getcardsbyconceptid($scope.conceptid, $.jStorage.get("user").id, "others").then(getcardsuccess, getcarderror);
        };

        //CHANGE SHARE STATUS OF CARDS
        $scope.changesharestatus = function (cardid) {
            if (cardid)
                NavigationService.changesharestatus(cardid).success(function (response) {
                    if (response)
                        $scope.conceptcards[$scope.cardindex].shared = $scope.conceptcards[$scope.cardindex].shared == 1 ? 0 : 1;
                    console.log(response);
                });
            else
                $scope.conceptcards[$scope.cardindex].shared = $scope.conceptcards[$scope.cardindex].shared == 1 ? 0 : 1;

        };

        $scope.removeimage = function (index) {
            NavigationService.removeimage($scope.conceptcards[index].image).success(function (response) {
                if (response) {
                    $scope.conceptcards[index].image = "";
                }
            });
        };

        $scope.checklength = function () {
            var content = $scope.conceptcards[$scope.cardindex].conceptdata;
            if (content.length > 500) {
                $scope.conceptcards[$scope.cardindex].conceptdata = content.replace(content.charAt(content.length - 1), "");
            };
        };

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


        /* Get cards Data */
        var getcardsuccess = function (response) {

            console.log(response.data);
            $scope.conceptcards = response.data.cards;
            $scope.nextconcept = response.data.next_concept[0];


            if (response.data.cards.length > 0 || $scope.otheruserscard) { // if there is atleast 1 conceptcard then set cardindex to 0
                console.log('pushing card');

                $scope.conceptcards.push({
                    user_id: 0,
                    conceptdata: '<div style="text-align: center;"><img src="' + imageurl + 'completioncelebration.gif" style="font-size: 14px;width:75%;heigth:50%"><button ng-click="gotopractisepage()" class="row btn waves-effect waves-light cyan">Practise Cards</button>' + ($scope.nextconcept ? '<a href="#/conceptcards/' + $scope.nextconcept.id + '" class="row btn waves-effect waves-light cyan">Next Concept</a>' : '') + '</div>'
                });
                $scope.cardindex = 0;
                readcardbyuserid(0);
                //$scope.changecardindex(1);
            }

            _.forEach($scope.conceptcards, function (value, key) {
                console.log($scope.conceptcards.length);
                if (value.user_id == 0) {
                    value.conceptdata = $sce.trustAsHtml(value.conceptdata);
                }
                $scope.zindexarray.push($scope.conceptcards.length - key);
                styleCards(key);
            });


        };

        var getcarderror = function (response) {
            /*INTERNET ERROR*/
            console.log(response.data);
        };

        var readcardsuccess = function (response) {
            console.log(response.data);

        };

        var readcarderror = function (response) {
            console.log(cid);
            $scope.conceptcards[$scope.cardindex].cardread = 0;
            console.log(response.data);
        };

        /*function*/
        NavigationService.getcardsbyconceptid($scope.conceptid, $.jStorage.get("user").id, "inq").then(getcardsuccess, getcarderror);

        var readcardbyuserid = function (cid) {
            console.log('i m in readcard function');
            if ($scope.conceptcards[cid].cardread == 0) {
                $scope.conceptcards[cid].cardread = 1;
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


        /* Style cards by rotating*/
        var styleCards = function (key) {
            if ($scope.zindexarray[key] == $scope.conceptcards.length) {
                var deg = '0deg';
            } else {
                if ($scope.zindexarray[key] % 2 == 0) {
                    //var deg = '-' + $scope.zindexarray[key] % 6 + 'deg';
                    var deg = '-3deg';
                } else {
                    //var deg = $scope.zindexarray[key] % 6 + 'deg';
                    var deg = '3deg';
                }
            };
            $('#card' + key).css('transform', 'rotate(' + deg + ')');
        };
        /*Change Card*/
        $scope.changecardindex = function (index) {

            var cardid, left, rotateVal;
            if (index == '1') {
                left = $('.cardspage').width() + 'px';
                rotateVal = '6deg';
                cardid = $scope.cardindex;


            } else {
                left = '-' + $('.cardspage').width() + 'px';
                rotateVal = '-6deg';
                if ($scope.cardindex == 0) {
                    cardid = $scope.conceptcards.length - 1;
                } else {
                    cardid = $scope.cardindex - 1;
                };
            };

            console.log(cardid);



            $('#card' + cardid).css({
                'left': left,
                'transform': 'rotate(' + rotateVal + ')',
            });




            setTimeout(function () {

                _.forEach($scope.conceptcards, function (value, key) {

                    if (index == '1') {
                        if (key == $scope.cardindex) {
                            $scope.zindexarray[key] = 1;
                        } else {
                            $scope.zindexarray[key] += 1;
                        };

                        styleCards(key);

                    } else {

                        if ($scope.zindexarray[key] == '1') {
                            $scope.zindexarray[key] = $scope.conceptcards.length;
                        } else {
                            $scope.zindexarray[key] -= 1;
                        };

                        styleCards(key);

                    };



                });

                $scope.$apply();

                setTimeout(function () {
                    $('#card' + cardid).css({
                        'left': '0px',
                        'transform': 'rotate(0deg)'
                    });
                }, 80);


                if ($scope.cardindex == ($scope.conceptcards.length - 1) && index == '1') {
                    $scope.cardindex = 0;
                } else {
                    if ($scope.cardindex == 0 && index == '-1') {
                        $scope.cardindex = $scope.conceptcards.length - 1;
                    } else {
                        $scope.cardindex = $scope.cardindex + index;

                        /* Call Read Card function when NEXT button is clicked */
                        if (index == '1') {
                            readcardbyuserid($scope.cardindex);
                        };
                    };
                };
            }, 260);


        };
        var getindex = function (glossary) {
            return glossary.word == text;
        }
        var text = "";
        $scope.getselectedtext = function () {

            if (window.getSelection) {
                text = window.getSelection().toString();
                var index = $scope.glossary.findIndex(getindex);
            }
        };

        $scope.addcustomusercard = function () {
            console.log($scope.cardindex);
            console.log($scope.conceptcards);
            $scope.conceptcards.splice($scope.cardindex + 1, 0, { // add the card such that when we click on + the new card is added next to the current card and the index is same as current card's index
                user_id: $.jStorage.get("user").id,
                cardnumber: $scope.conceptcards[$scope.cardindex].cardnumber,
                conceptdata: "You Can Create You Own Notes Here",
                editmode: true,
                concept_id: $scope.conceptid,
                id: 0,
                shared: 0
            });

            $scope.zindexarray.splice($scope.cardindex + 1, 0, $("#card" + $scope.cardindex).zIndex());
            $scope.zindexarray[$scope.cardindex] = $scope.conceptcards.length;

            console.log($("#card" + $scope.cardindex).zIndex() + " " + $("#card" + ($scope.cardindex + 1)).zIndex());
            /*CHANGE CARD INDEX TO +1 */
            $scope.changecardindex(1);
            console.log($scope.cardindex);
        };
        $scope.cancelcustomcard = function (index) {
            $scope.conceptcards.splice(index, 1);
            $scope.zindexarray.splice(index, 1);
            $scope.zindexarray[index] = $scope.conceptcards.length;
            $scope.changecardindex(-1);
        }

        var savecustomcardserror = function (response) {
            console.log(response.data);
        };

        /* SAVE CUSTOM CARD */
        $scope.savecustomusercard = function () {
            var index = $scope.cardindex;
            //CALLING FUNCTION TO ADD CUSTOM CARD IN DATABASE
            console.log($scope.conceptcards[index]);
            NavigationService.savecustomcards($scope.conceptcards[index]).then(function (response) {
                console.log(response.data);
                console.log($scope.conceptcards[index]);
                if (response.data != "false") {
                    $scope.conceptcards[$scope.cardindex].editmode = false;
                    if ($scope.conceptcards[index].id == 0) {
                        $scope.conceptcards[index].id = response.data;

                    }
                }
            }, function (response) {
                /*INTERNET ERROR*/
                console.log(response.data);
            });
        };

        /* EDIT CUSTOMER CARD MODE */
        $scope.editcustomusercard = function () {
            $scope.conceptcards[$scope.cardindex].editmode = true;
        };


        $scope.deletecustomusercard = function (ind) {
            /*ASK FOR CONFIRMATION*/
            $scope.conceptcards[$scope.cardindex].editmode = false;
        };

  }
]);
inqcontroller.controller('commontestsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval', '$q', '$location', '$routeParams', '$controller',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval, $q, $location, $routeParams, $controller) {


        $routeParams.controllername == 'tests' ? $controller('testsCtrl', {
            $scope: $scope
        }) : $controller('reviewsCtrl', {
            $scope: $scope
        });
        $scope.title = "Tests";
        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/tests.html";
        console.log('common ctrl');
        //      common functions
        $scope.change_question = function (ind) {
           
            if (ind == 1 || ind == -1) {
                $scope.test_question_number += ind;
            } else {
                $scope.test_question_number = ind;
            };
             if($scope.showcorrectanswertouser)
                {
                    console.log($scope.test_question_number+" "+$rootScope.test_questions_array[$scope.test_question_number].answergiven)
                     $scope.statusofgivenanswer=$rootScope.test_questions_array[$scope.test_question_number].answergiven == "1" ? 'You have given correct answer' :($rootScope.test_questions_array[$scope.test_question_number].answergiven == "0"?"You didn't answer this ":'You have given wrong answer') ;
                }
        };

  }]);
inqcontroller.controller('reviewsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval', '$q', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval, $q, $location) {
        //      INTIALIZATION

        $scope.test_question_number = 0;
        $scope.showcorrectanswertouser = true;



        //      COLLAPSIBLE INITIALIZATION
        $('.collapsible').collapsible();


        gettestdatabyidsuccess = function (response) {

            $rootScope.test_questions_array = response.data.giventestdata;
            $rootScope.test_questions = response.data.questions;
           $scope.statusofgivenanswer=$rootScope.test_questions_array[$scope.test_question_number].answergiven == "1" ? 'You have given correct answer' :($rootScope.test_questions_array[$scope.test_question_number].answergiven == "0"?"You didn't answer this ":'You have given wrong answer') ;

            for (var index in $rootScope.test_questions_array) {
                $rootScope.test_questions_array[index].optionsorder = $rootScope.test_questions_array[index].optionsorder.split(',')
            }
            console.log($rootScope.test_questions_array);
            console.log($rootScope.test_questions);
            console.log($rootScope.test_questions_array[$scope.test_question_number].answergiven);
        };
        gettestdatabyiderror = function (error) {
            console.log(error);
        }
        NavigationService.gettestdatabyid().then(gettestdatabyidsuccess, gettestdatabyiderror);
  }]);

inqcontroller.controller('testsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval', '$q', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval, $q, $location) {

        /*$scope.title = "Tests";
        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/tests.html";*/

        //INITIALIZATIONS
        $rootScope.test_questions_array = []; //USED to store data of test answers and options order
        $scope.number_of_pauses = 3;
        $scope.attempted_count = 0;

        console.log('tests ctrl called');
        $(document).on("click", ".modal-overlay", function () {
            $scope.resumetimer('#end-modal');
        });

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
            $scope.starttimer = false;
            if (modalname == "#end-modal") {
                $(modalname).modal('open');
                if ($scope.number_of_pauses > 0) {
                    $interval.cancel(timer_interval);
                    $scope.get_count_of_attempted_questions();
                    $scope.starttimer = true;
                    $scope.number_of_pauses--;
                }
            }
            if (modalname == "#doubt-modal") {
                $(modalname).modal('open');
            };
            if (modalname == "#report-modal") {
                $(modalname).modal('open');
            };

        };



        $scope.get_count_of_attempted_questions = function () {
            $scope.attempted_count = 0;
            _.forEach($rootScope.test_questions_array, function (value) {
                console.log(value.answergiven != 0 ? 1 : 0);
                $scope.attempted_count += value.answergiven != 0 ? 1 : 0;
            });
            console.log($scope.attempted_count);
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
            var answeredquestions_length=0;
            $scope.total_questions = 20;
            
            
            
            /*Check if answeredquestions length is greater than 20*/
            for(var index in response.data){
                for(var property in response.data[index].answeredquestions){
                    answeredquestions_length+=response.data[index].answeredquestions[property].length;
                }
            }
            
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
                console.log(answeredquestions_length);

                while ($scope.questions_array.length < question_set && answeredquestions_length>=20) {
                    console.log($scope.questions_data_response);
                  
                    
                    for (var cd = data_start; cd < data_end; cd++) {

                        var answerval = $scope.values_array[$scope.questions_array.length].answerval == 0 ? 'questions' : 'answeredquestions';

                        var levelval = $scope.values_array[$scope.questions_array.length].levelval == 1 ? 'easy' : 'medium';
                        levelval = $scope.values_array[$scope.questions_array.length].levelval == 3 ? 'hard' : levelval;

                        console.log(cd, answerval, levelval);
                        var length_of_set = $scope.questions_data_response[cd][answerval][levelval].length;
                        if (length_of_set != 0) {
                            console.log('i am in random question generator');
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
                                if (question_set == 20) {
                                    cd = data_end;
                                }
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
                    $rootScope.test_questions_array.push({
                        question_id: value.qid,
                        answergiven: 0,
                        optionsorder: optionsorder
                    });
                });
                console.log($rootScope.test_questions_array);
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
                                console.log(response);
                                /*QUESTIONS ARRAY RADY*/
                                if(response.length==20){
                                NavigationService.gettestquestions(response).then(gettestquestionssuccess, gettestquestionserror);
                                }else{
                                    alert("This chapter doesn't have enough test questions !");
                                    window.history.go(-1);
                                }
                            },
                            function (response) {
                                /*QUESTIONS ARRAY ERROR*/
                            });
                    },
                    function (response) {
                        /*ERROR IN CREATING VALUE ARRAY*/
                    });
            } else {
                alert("Not enough Concepts in this chapter");
            };
        };
        var getscoresfromchapterserror = function (response) {
            console.log(response.data);
        };
      

        //      Data To generate Smart Test
        NavigationService.getscorefromchapterids($.jStorage.get('user').id, $rootScope.chaptersarray).then(getscoresfromchapterssuccess, getscoresfromchapterserror);

        /*TIMER FUNCTION*/
        $scope.countdown = {
            minutes: 20,
            seconds: 0
        };
        var timer = function () {
            if ($scope.countdown.minutes == 20) {
                $scope.countdown.minutes--;
                $scope.countdown.seconds = 59;
            }
            timer_interval = $interval(function () {
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
        }
        var timer_interval;
        $interval(timer, 1000, 1);

        /* TO PAUSE TIMER
        $interval.pause(timer_interval);
        */


        /* DISPLAY TEST FUNCTIONALITIES */
        $scope.test_question_number = 0;

        /*$scope.change_question = function (ind) {
            if (ind == 1 || ind == -1) {
                $scope.test_question_number += ind;
            } else {
                $scope.test_question_number = ind;
            };
        };*/

        /*SCORING*/
        $scope.optionselected = function (ind) {
            $rootScope.test_questions_array[$scope.test_question_number].answergiven = $rootScope.test_questions_array[$scope.test_question_number].optionsorder[ind];
            console.log($rootScope.test_questions_array);
            /* if ($scope.test_question_number < 20) {
               $scope.change_question(1);
             };*/
        };
        /* Resume timer on button clicked */
        $scope.resumetimer = function (modalname) {
            if ($scope.starttimer)
                $interval(timer, 10, 1);
            $(modalname).modal('close');

        }

        /*STORE TEST ON SUBMIT*/
        $scope.submittest = function () {
            $('#end-modal').modal('close');
            var store_test_detailssuccess = function (response) {
                 $.jStorage.set('testid', response.data);
                
                console.log($rootScope.navigationfunction);
                if (response.data) {
                    $rootScope.navigationfunction=NavigationService.getpercentofconceptsbytestid();
                    $('#end-modal').modal('close');
                    $location.path("/testresults");
                };
            };
            var store_test_detailserror = function (response) {
                console.log(response.data);
            };

            /*CONVERT optionsorder TO STRING*/
            _.forEach($rootScope.test_questions_array, function (value) {
                value.optionsorder = JSON.stringify(value.optionsorder);
            });

           NavigationService.store_test_details($.jStorage.get("user").id, $rootScope.chaptersarray, "chapter", $rootScope.test_questions_array).then(store_test_detailssuccess,store_test_detailserror);
            $location.path("/testresults");
            //            console.log($rootScope.navigationfunction);
        };

        //        .then(store_test_detailssuccess, store_test_detailserror);
        //         routing

  }
]);

inqcontroller.controller('conceptsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {
        console.log('conceptsCtrl');
        $scope.title = "Concepts";
        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/concepts.html";
        $scope.chapterid = $routeParams.chapterid;
        $scope.math = window.Math;
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

            $rootScope.fullpageview = true;
            $location.path('/conceptcards/' + id);

        };
        $scope.gototest = function () {
            $rootScope.chaptersarray = $scope.chapterid;
            $location.path('/tests/tests');
        };

  }
]);

inqcontroller.controller('testresultsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $location) {
        //INITIALIZATIONS
        $scope.title = "testresults";
        $scope.template = TemplateService;
        TemplateService.content = "views/testresults.html";
        $rootScope.fullpageview = true;
        $scope.conceptwidth = 70;
        $scope.testresult = {};
        $scope.testresult.score = 0;
        $scope.testresult.unanswered = 0;
      $scope.testconceptprogress=[];
        console.log($rootScope.test_questions_array);
      
        for (var index in $rootScope.test_questions_array) {
            console.log($rootScope.test_questions_array[index].answergiven);
            if ($rootScope.test_questions_array[index].answergiven == 1) {
                $scope.testresult.score += 1;
            }
            if ($rootScope.test_questions_array[index].answergiven == 0) {
                $scope.testresult.unanswered += 1;
            }
        }
      console.log($rootScope.navigationfunction);
        if ($rootScope.navigationfunction) {
                
            $scope.testresult.totalmarks = $rootScope.test_questions_array.length;

            $rootScope.navigationfunction.success(function (response) {
                $scope.testconceptprogress=response;
                console.log(response);
               
            });
        } else {
            window.history.go(-2)
        }





        /*function*/
        $scope.gettestreview = function () {
            $location.path('/tests/review');
        }

        // routing


        /*Callback functions*/


        /*Services call*/


  }
]);

inqcontroller.controller('subjectsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location', '$sce',
  function ($scope, TemplateService, NavigationService, $rootScope, $location, $sce) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/subjects.html";
        $scope.navigation = NavigationService.getnav();

        //INITIALIZATIONS

        /*NAVIGATION SET*/
        console.log($.jStorage.get("navigation"));
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
                //  console.log(n);
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
            for (var i in $scope.subjects) {

                $scope.subjects[i].image = $sce.trustAsHtml($scope.subjects[i].image);
            }
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

  }
]);

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

  }
]);

inqcontroller.controller('profileCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/profile.html";
        $scope.navigation = NavigationService.getnav();

  }
]);

inqcontroller.controller('dashboardCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/dashboard.html";
        $scope.navigation = NavigationService.getnav();




        /* INITIAL DATA FETCH */
        var getuserdashboardsuccess = function (response) {
            console.log(response.data);
            $scope.dashboardData = response.data;
        };
        var getuserdashboarderror = function (response) {
            console.log(response.data);


        };
        NavigationService.getuserdashboard($rootScope.user.id, $rootScope.user.standard_id).then(getuserdashboardsuccess, getuserdashboarderror);


        /* INitialize Table */
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




  }
]);

inqcontroller.controller('starredCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/starred.html";
        $scope.navigation = NavigationService.getnav();

  }
]);

inqcontroller.controller('leaderboardCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/leaderboard.html";
        $scope.navigation = NavigationService.getnav();

  }
]);

inqcontroller.controller('menuCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService', '$route',
  function ($scope, TemplateService, $location, $rootScope, NavigationService, $route) {



        $scope.template = TemplateService;

        /*INITIALIZATIONS*/
        $scope.user = $.jStorage.get("user");
        $rootScope.user = $.jStorage.get("user");

        /*ROOTSCOPE VALUES*/
        $rootScope.fullpageview = true;

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

  }
]);

inqcontroller.controller('appCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService', '$route',
  function ($scope, TemplateService, $location, $rootScope, NavigationService, $route) {

        $rootScope.showmenu = true;

  }
]);
