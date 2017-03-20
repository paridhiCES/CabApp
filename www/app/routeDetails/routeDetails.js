var routeDetails = angular.module('routedetails', ['ui.bootstrap']);
routeDetails.config(function ($stateProvider) {
    $stateProvider.state('routedetails', {
        url: "/routedetails"
        , templateUrl: "app/routeDetails/routeDetails.html"
        , controller: "routeController"
    });
});
routeDetails.controller('routeController', function ($http, REST_CONFIG, $scope, $state, $ionicModal, $rootScope, $ionicPopup) {
    $scope.addMemberFlag = false;
    $scope.data = {};
    $scope.flag = false;
    $scope.selected = false;
    $scope.ShowField = true;
    $scope.listNames = [];
    $scope.routeList = [];
    $scope.emp = [];
    $scope.empNames = [];
    $scope.empAddress = [];
    $scope.showEmpList = false;
    var routeNo;
 
//Method to show Alert
//_______________________________________________________________________________________________________________________________________    
   
    var showAlert = function (textTitle, textBody) {
        var alertPopup = $ionicPopup.alert({
            title: '<h3>' + textTitle + '</h3>'
            , template: '<p class="para">' + textBody + '</p>'
        });
        alertPopup.then(function (res) {});
    };
    
//Method to call service "getAllRoutes" from routes table
 //_______________________________________________________________________________________________________________________________________   
    var getAllRoutes = function () {
        $http({
            method: "GET"
            , url: REST_CONFIG.baseURL + '/getAllRoutes'
        , }).then(function successCallback(response) {
            if (response.data.success) {
                $scope.routeList = response.data.data;
                console.log($scope.routeList);
            }
            else {
                console.log("no response");
            }
        });
    }
    
//Method to call service "getAllEmployee" from employee table  
//_______________________________________________________________________________________________________________________________________
    var getAllEmployee = function () {
        $http({
            method: "GET"
            , url: REST_CONFIG.baseURL + '/getAllEmployee'
        , }).then(function successCallback(response) {
            if (response.data.success) {
                $scope.names = response.data.data;
                console.log($scope.names);
                angular.forEach($scope.names, function (row, key) {
                    $scope.empNames.push(row.emp_name);
                    $scope.empAddress.push(row.pick_up);
                });
                console.log($scope.empNames);
                console.log($scope.empAddress);
            }
            else {
                $scope.names = "Nothing";
            }
        });
    }

//execution initiated from init() method
//_______________________________________________________________________________________________________________________________________
    var init = function () {
        getAllRoutes();
        $scope.showRouteDiv = false;
    }
    init();

//Method to move back
_______________________________________________________________________________________________________________________________________    
    
    $scope.back = function () {
            $state.go('adminhome');
        }

//show Member Name & address
//_______________________________________________________________________________________________________________________________________
         
    $scope.showTypeaheadPopUp = function () {
        $scope.data = {}
        var typeAheadPopup = $ionicPopup.show({
            template: 'Enter Name <input id="EmpNameAdd" type="text" ng-model="data.EmpNameAdd" ng-change="searchNames()"><br><ul class="list list_typeahd" ng-show="showEmpList"><li class="item" ng-repeat="item in emp"><p>{{item}}</p></li></ul>'
            , title: 'Add Member'
            , subTitle: ''
            , scope: $scope
            , buttons: [{
                text: 'Cancel'
      }, {
                text: '<b>Save</b>'
                , type: 'button-positive'
                , onTap: function (e) {}
      }, ]
        });
    };
  
//Method called on logout button click    
//_______________________________________________________________________________________________________________________________________
    
    $scope.logout = function () {
        $state.go('login');
    }

    
//_______________________________________________________________________________________________________________________________________    
    $scope.showAddMemberModal = function (routeNum) {
        routeNo = routeNum;
        console.log(routeNo);
        $scope.addRouteModal.show();
        $scope.routeNo = routeNo;
        $http({
            method: "GET"
            , url: REST_CONFIG.baseURL + '/getRouteMembers'
            , headers: {
                'Content-Type': 'application/json'
                , routeno: $scope.routeNo
            }
        }).then(function successCallback(response) {
            if (response.data.success) {
                console.log(response.data.data);
                $scope.listNames = response.data.data;
                /* angular.forEach(response.data.data, function(row, key){
                                if(row.routeMembers == null){
                                    showAlert("Cab Service","No Records Found");
                                }else{
                                    $scope.listNames = response.data.data;
                                }
                            });
                        var names = $scope.listNames[0].routeMembers.replace("[","").replace("]","").replace(/\"/g,"").split(",");
                        
                     var temp1 = names.replace("[","").replace("]","").replace(/\"/g,"").split(",");
                       var temp2 = temp1.replace("]","");
                       var temp3 = temp2.replace(/\"/g,"");
                       var array = temp3.split(",");
                        
                        $scope.listNames[0].routeMembers = names.toString() */
            }
            else {
                console.log("no response");
            }
        });
    }    
//_______________________________________________________________________________________________________________________________________    
    $scope.searchNames = function () {
        $scope.flag = true;
        $scope.emp = [];
        if (angular.isDefined($scope.data.employee) && $scope.data.employee != "" && $scope.data.employee != null) {
            for (var i = 0; i < $scope.names.length; i++) {
                if ($scope.empNames[i].indexOf($scope.data.employee) != -1) {
                    $scope.emp.push($scope.names[i]);
                    $scope.showEmpList = true;
                }
            }
        }
        else {
            $scope.flag = false;
        }
        console.log($scope.emp);
    }
    
_______________________________________________________________________________________________________________________________________
    $scope.addMember = function () {
        getAllEmployee();
        $scope.addMemberFlag = !$scope.addMemberFlag;
    }
    
    /**
    @param employee - 
    
    */
    
    $scope.addNewEmployee = function (employee) {
        var valueExist = false;
        angular.forEach($scope.listNames, function (row, key) {
            if (row.emp_name == employee.emp_name && row.pick_up == employee.pick_up) {
                showAlert("Cab Service", "Value Exist");
                valueExist = true;
                $scope.flag = false;
                $scope.data.employee = "";
                $scope.addMemberFlag = false;
            }
        });
        if (valueExist == false) {
            console.log(routeNo);
            $scope.listNames.push(employee);
            $http({
                method: "POST"
                , url: REST_CONFIG.baseURL + '/updateEmployee'
                , data: {
                    newMember: employee
                    , routeNum: routeNo
                }
            }).then(function successCallback(response) {
                if (response.data.success) {
                    $scope.flag = false;
                    $scope.data.employee = "";
                }
                else {}
            });
        }
        else {
            console.log("Problem");
        }
        console.log($scope.listNames);
        console.log(employee);
        /* $scope.listNames.push(employee);
           console.log($scope.listNames);
           $scope.selected = true;
           $scope.addMemberFlag = false;
           $scope.flag = false;
           console.log(employee);*/
    }
_______________________________________________________________________________________________________________________________________

    $scope.clearSearch = function () {
        $scope.data.employee = null;
        $scope.flag = false;
    }
_______________________________________________________________________________________________________________________________________
   
    $scope.addRoute = function () {
        $scope.showRouteDiv = !$scope.showRouteDiv;
        //$scope.addRouteModal.show();  
        $scope.flag = false;
    }
_______________________________________________________________________________________________________________________________________
    $scope.routeNumberAssign = function (routeNo) {
            console.log(routeNo);
            if (routeNo != null && routeNo != 0 && routeNo != 'undefined') {
                $http({
                    method: "POST"
                    , url: REST_CONFIG.baseURL + '/addRouteNo'
                    , data: {
                        routeNo: routeNo
                    }
                }).then(function successCallback(response) {
                    if (response.data.success) {
                        console.log(response);
                        $scope.routeList.push(routeNo);
                        getAllRoutes();
                        $scope.routeList.sort();
                        $scope.showAddMember = true;
                        $scope.showRouteDiv = false;
                    }
                    else {
                        console.log("Adding route Number Error");
                        showAlert("Cab Service", "Route Number Already Exist");
                        $scope.showRouteDiv = false;
                    }
                });
            }
            else {
                showAlert("Cab Service", "Please Check Route Number");
            }
            document.getElementById("routeNumber").value = "";
        }

_______________________________________________________________________________________________________________________________________
    
    //Add Route Modal
    $ionicModal.fromTemplateUrl('app/routeDetails/addRouteModal.html', {
        scope: $scope
        , animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.addRouteModal = modal;
    });
    
_______________________________________________________________________________________________________________________________________    
    $scope.closeAddRouteModal = function () {
            $scope.addMemberFlag = false;
            $scope.addRouteModal.hide();
        }
        //Add Route Modal
        //pop up for Members name
});