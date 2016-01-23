/**
 * Created by Shivam Mathur on 22-06-2015.
 */
function setDynamicElements(s) {
    if (setDynEle < 2) {
        $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
        $(document).ready(function(){
            // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
            $('.modal-trigger').leanModal();
        });
        hbtab(s);
        $('#article_tabs .tabs').tabs();
        x = 0;
        if (s) {
            //   stickFooter();
        } else {
            //  removeSticky();
        }
        setDynEle = setDynEle + 1;
       // console.log('done');
      //  true_ellipse();
    }
    else{
        routec =0;
    }

}
function stickFooter() {

    if ($('#footer').offset().top + 10 < window.innerHeight) {
        document.getElementById('footer').style.position = 'absolute';
        document.getElementById('footer').style.bottom = '0';
        document.getElementById('footer').style.width = '100%';
    } else {
        removeSticky();
    }
}
function removeSticky() {
    document.getElementById('footer').style.position = 'relative';
}


/***
 * Ajax Calls
 *
 */
function edit($http, $scope, editData) {
    $http({
        method: 'POST',
        url: '/input/edit',
        data: $.param(editData),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
    })
        .success(function (data) {
            //    console.log(data);
            // if successful, bind success message to message
            $scope.msg = data.message;
            alert($scope.msg);
            clearData($scope);

        });
}
function newArticle($http, $scope) {
    $http({
        method: 'POST',
        url: '/input/new',
        data: $.param($scope.formDatain),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
    })
        .success(function (data) {
            //  console.log(data);

            if (!data) {
                // if not successful, bind errors to error variables
                $scope.message = data.message;

            } else {
                // if successful, bind success message to message
                $scope.message = data.message;
                alert($scope.message);
                clearData($scope);
            }
        });
}
function deleteArt($http, $scope) {
    $http({
        method: 'POST',
        url: '/input/delete',
        data: $.param($scope.formDelete),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
    })
        .success(function (data) {
            // console.log(data);

            if (!data) {
                // if not successful, bind errors to error variables
                $scope.message = data.message;

            } else {
                // if successful, bind success message to message
                $scope.message = data.message;
                alert($scope.message);

            }
        });
}
function clearData($scope) {
    $scope.formDatain = {};
    $scope.formDataGet = {};
    $scope.findMessage = null;
}
function find_article($http, $scope) {
    $http({
        method: 'GET',
        url: '/input/find',
        data: $.param($scope.formDataFind),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
    })
        .success(function (data) {
            // console.log(data);

            if (!data) {
                // if not successful, bind errors to error variables
                $scope.findMessage = "Not Found";

            } else {
                // if successful, bind success message to message
                $scope.findMessage = data.message;

                $scope.formDataGet = data.results;
                // console.log(data);
            }
            alert($scope.findMessage);
        }).error(function (data, status) {
            if (status == 404)
                alert(data.message);
            else if (status == 500)
                alert('Internal Server Error');
            else
                console.log(status);
        });
}

function searchArticle($scope, $http, $q, $rootScope) {
    var deferred = $q.defer();
    $rootScope.err = "Loading";
    $rootScope.searchTag = [];
    $http({
        method: 'GET',
        url: '/search',
        params: {tag: $scope.search}
    }).success(function (data) {
        deferred.resolve(data);
        deferred.promise.then(function (data) {
            //  console.log(data);
            $rootScope.searchTag = data;
            console.log(data);
            setDynEle = 0;
            setDynamicElements();
        });
        $rootScope.err = "No Articles Found";
    }).error(function (data, status) {
        if (status == 404)
            $rootScope.err = "No Articles Found";
        if (status == 500)
            $rootScope.err = "Internal Sever Error";
        else
            console.log(data);
    });

}
function searchCat($rootScope, $http, $q, category) {
    var deferred = $q.defer();
    $rootScope.err = "Loading";
    $rootScope.searchCat = [];
    $http({
        method: 'GET',
        url: '/articles',
        params: {main_category: category}
    }).success(function (data) {
        deferred.resolve(data);
        deferred.promise.then(function (data) {
            // console.log(data);
            $rootScope.err = "No Articles Found";
            // console.log($scope.err);
            $rootScope.searchCat = data;
          //  console.log(data);
            setDynEle = 0;
            setDynamicElements();
        })
    })
        .error(function (err, status) {
            if (status == 404)
                $rootScope.err = "Articles Not found";
            else if (status == 500)
                $rootScope.err = "Internal Server Error";

            console.log(err);


        });

}
function getSuggestions($rootScope, $http, $q) {
    var deferred = $q.defer();
    $rootScope.err = "Loading";
    $rootScope.suggestions = [];
    $http({
        method: 'GET',
        url: '/suggestions'
    }).success(function (data) {
        deferred.resolve(data);
        deferred.promise.then(function (data) {
            // console.log(data);
            $rootScope.err = "No Articles Found";
            // console.log($scope.err);
            $rootScope.suggestions = data;
           // console.log(data);
            setDynEle = 0;
            setDynamicElements();
        })
    })
        .error(function (err, status) {
            if (status == 404)
                $rootScope.err = "Articles Not found";
            else if (status == 500)
                $rootScope.err = "Internal Server Error";

            console.log(err);


        });

}

function trans() {
    //  Materialize.showStaggeredList("#article_tabs ul");

}
var x = 0;
var current_open;
var current_liActive;
var routec = 0;
function hbtab(s) {

    var tabList = [];
    var li = document.getElementsByClassName('hb-tabs');
    var test = 0;
    var i = 0;
    var tab;
    var openTab;
    var newTab = {};
    var liActive;
    //console.log(current_open);
    if (current_open) {
        openTab = current_open;
        liActive = current_liActive;
        test = 2;

    }
    if (current_liActive||s==1) {
        test = 2;
    }
    if (routec == 1) {
        test = 0;
    }

    for (x in li) {

        //console.log(li[x]);
        tab = li[x].id + "_tab";
        tabList[i] = document.getElementById(tab);
        if (tabList[i] == null) {
            break;
        }

        if (test == 2) {
        } else if (i != 0) {
            tabList[i].style.display = "none";
        }
        if(s==1){//console.log(test);
        }
        if(test == 0){
            test = 1;
            liActive = li[x];
            liActive.childNodes[2].className = '';
            liActive.childNodes[4].className = '';
            liActive.className = liActive.className + ' active_tab';
            openTab = tabList[0];

           // console.log(openTab);
            openTab.style.display = "block";
           // console.log(liActive.childNodes[1]);
            current_open = openTab;
            current_liActive = liActive;

        }
        li[x].onclick = function(){
            newTab.id = this.id + "_tab";

            liActive.className = liActive.className.replace(/(?:^|\s)active_tab(?!\S)/g, '');
           // console.log(liActive.childNodes);
            liActive.childNodes[2].className = 'grey-text';
            liActive.childNodes[4].className = 'grey-text';
            liActive = this;
            liActive.className = liActive.className + ' active_tab';
            liActive.childNodes[2].className = '';
            liActive.childNodes[4].className = '';
            newTab.element = document.getElementById(newTab.id);
            openTab.style.display = "none";
            openTab = newTab.element;
            openTab.style.display = "block";
            if (test == 2) {
                //console.log('click');
                if (current_open != openTab) {
                    current_open.style.display = "none";
                    current_open = openTab;
                }
                current_liActive = liActive;
            } else {
              //  console.log('click2');
                current_open = openTab;
                current_liActive = liActive;
            }

        };
        i = i + 1;
    }

}
/*
function true_ellipse(){
    var content = document.getElementsByClassName('suggestion_content');
    for(x in content){
        if(content[x].innerHTML){
        var n = content[x].innerHTML.search('br');
        console.log(n);
            if(n!=-1) {
                content[x].innerHTML[n] = ' ';
                console.log(content[x].innerHTML[n]);
                console.log(content[x].innerHTML);
            }
        }
    }
}*/
