var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function ($http) {


    //MACBOOK AND HOME LAPTOP
    var adminurl = "http://localhost/rest/index.php/";
    //PC
    //var adminurl = "http://localhost/inqrest/rest/index.php/";
    //SERVER
    //        var adminurl = "http://learnwithinq.com/adminpanel/rest/index.php/";
    //    SERVER TEST
    //    var adminurl = "http://learnwithinq.com/adminpanel/testrest/index.php/";
    //HOME LAPTOP

    var navigation = [{
        name: "Home",
        classis: "active",
        link: "#/home",
        subnav: []
    }, {
        name: "About",
        active: "",
        link: "#/about",
        subnav: []
    }, {
        name: "Services",
        classis: "",
        link: "#/services",
        subnav: []
    }, {
        name: "Portfolio",
        classis: "",
        link: "#/portfolio",
        subnav: []
    }, {
        name: "Contact",
        classis: "",
        link: "#/contact",
        subnav: []
    }];

    return {
        getnav: function () {
            return navigation;
        },
        makeactive: function (menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        getdatabyid: function (table, id) {
            return $http.get(adminurl + table + '/getbyid', {
                params: {
                    id: id
                }
            });
        },
        getsubjectsbyuserid: function (id) {
            return $http.get(adminurl + 'subjects/getmanyby', {
                params: {
                    field: 'standard_id',
                    value: id
                }
            })

        },
        getchaptersbysubjectid: function (id) {

            return $http.get(adminurl + 'chapters/getchaptersbysubjectid', {
                params: {
                    subjectid: id
                }
            })
        },
        dologin: function (contact, password) {
            return $http.get(adminurl + 'users/scawlogin', {
                params: {
                    contact: contact,
                    password: password
                }
            })
        },

        getstandardsbyboardid: function (id) {
            return $http.get(adminurl + 'standards/getmanyby', {
                params: {
                    field: 'board_id',
                    value: id
                }
            })
        },

        getconceptsbychapterid: function (uid, chptid) {
            return $http.get(adminurl + 'concepts/getconceptsbychapterid', {
                params: {
                    userid: uid,
                    chapterid: chptid
                }
            })
        },
        getcardsbyconceptid: function (id, userid, cardtype) {
            return $http.get(adminurl + 'concepts/getcardsbyconceptid', {
                params: {
                    conceptid: id,
                    userid: userid,
                    cardtype: cardtype

                }
            })
        },
        readcardbyuserid: function (uid, cid) {
            return $http.get(adminurl + 'concepts/readcardbyuserid', {
                params: {
                    userid: uid,
                    cardid: cid
                }
            })
        },
        getconceptname: function (id) {
            return $http.get(adminurl + 'concepts/getbyid', {
                params: {
                    id: id
                }
            })
        },
        savecustomcards: function (card) {
            return $http.get(adminurl + 'concepts/savecustomcard', {
                params: {
                    user_id: card.user_id,
                    cardnumber: card.cardnumber,
                    concept_id: card.concept_id,
                    conceptdata: card.conceptdata,
                    image: card.image,
                    id: card.id
                        //shared:card.shared
                }
            })
        },
        getscorefromchapterids: function (user, chapterid) {
            return $http.get(adminurl + 'tests/getscorefromchapterids', {
                params: {
                    'user': user,
                    'chapters': chapterid
                }
            });
        },
        gettestquestions: function (questions) {
            return $http.get(adminurl + 'tests/gettestquestions', {
                params: {
                    questionsarray: JSON.stringify(questions)
                }
            });
        },
        store_test_details: function (userid, chaptersarray, type, testdetails) {
            console.log(chaptersarray);
            return $http.get(adminurl + 'tests/storetestdetails', {
                params: {
                    testtype: type,
                    userid: userid,
                    chapters: JSON.stringify(chaptersarray),
                    testdetails: JSON.stringify(testdetails)
                }
            });
        },
        getimagename: function (file) {
            return $http({
                url: adminurl + 'images/returnimagename',
                method: "POST",
                headers: {
                    'Content-Type': undefined,
                },
                data: file,
                transformRequest: angular.identity
            });
        },
        getuserdashboard: function (userid, standardid) {
            return $http.get(adminurl + 'users/getuserdashboard', {
                params: {
                    user: $.jStorage.get('user').id,
                    standard: $.jStorage.get('user').standard_id
                }
            });
        },
        removeimage: function (imagename) {
            console.log(imagename);
            return $http({
                url: adminurl + 'images/removeimage',
                method: "GET",
                params: {
                    'imagename': imagename
                }
            });

        },
        changesharestatus: function (cardid) {
            return $http({
                url: adminurl + 'concepts/updateshared',
                method: "GET",
                params: {
                    'user_id': $.jStorage.get('user').id,
                    'card_id': cardid
                }
            });

        },
        removestar: function (cardid, userid) {
            return $http({
                url: adminurl + 'concepts/removefieldfromstarred',
                method: "GET",
                params: {
                    'user_id': userid,
                    'card_id': cardid
                }
            });

        },
        addstar: function (cardid, userid) {
            return $http({
                url: adminurl + 'concepts/addfieldinstarred',
                method: "GET",
                params: {
                    'user_id': userid,
                    'card_id': cardid
                }
            });

        },
        gettestdatabyid: function () {
            return $http({
                url: adminurl + 'tests/gettestreviewdata',
                method: "GET",
                params: {
                    test_id: $.jStorage.get('testid')
                }
            });
        },
        getpercentofconceptsbytestid: function () {
            return $http({
                url: adminurl + 'tests/getpercentofconceptsbytestid',
                method: "GET",
                params: {
                    test_id: $.jStorage.get('testid')
                }
            });
        },
        getpractisecards: function (conceptid) {
            return $http({
                url: adminurl + 'questions/getpractisequestions',
                method: "GET",
                params: {
                    conceptid: conceptid
                }
            });
        },
        getchaptersgroupbysubject: function () {
            return $http({
                url: adminurl + 'User_conceptcards_starred/getchaptersgroupbysubjects',
                method: "GET",
                params: {
                    user_id: $.jStorage.get('user').id,
                    standard_id: $.jStorage.get('user').standard_id
                }
            });
        },

        getstarredcards: function (conceptid) {
            return $http({
                url: adminurl + 'User_conceptcards_starred/getstarredcardsbyconceptanduserid',
                method: "GET",
                params: {
                    user_id: $.jStorage.get('user').id,
                    concept_id: conceptid
                }
            });
        },




    }
});