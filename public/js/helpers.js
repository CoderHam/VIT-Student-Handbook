/**
 * Created by Shivam Mathur on 22-06-2015.
 */
function setDynamicElements() {

    $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
}


/***
 * Ajax Calls
 *
 */
function edit($http,$scope,editData){
    $http({
        method: 'POST',
        url: '/input/edit',
        data: $.param(editData),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
    })
        .success(function (data) {
            console.log(data);

            if (!data) {
                // if not successful, bind errors to error variables
                $scope.msg = data.message;

            } else {
                // if successful, bind success message to message
                $scope.msg = data.message;
                alert($scope.msg);
                clearData($scope);
            }
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
            console.log(data);

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
function deleteArt($http, $scope){
    $http({
        method: 'POST',
        url: '/input/delete',
        data: $.param($scope.formDelete),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
    })
        .success(function (data) {
            console.log(data);

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
        method: 'POST',
        url: '/input/find',
        data: $.param($scope.formDataFind),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
    })
        .success(function (data) {
            console.log(data);

            if (!data) {
                // if not successful, bind errors to error variables
                $scope.findMessage = "Not Found";

            } else {
                // if successful, bind success message to message
                $scope.findMessage = data.message;

                $scope.formDataGet = data.results;
                console.log(data);
            }
            alert($scope.findMessage);
        });
}
