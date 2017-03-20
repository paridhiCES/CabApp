var Login = angular.module('login', ['ngCordova', 'angular-md5', 'cabNumberOnly']);
Login.config(function ($stateProvider) {
    $stateProvider.state('login', {
        url: "/login",
        templateUrl: "app/login/login.html",
        controller: "loginController"
    });
});


Login.controller('loginController', function ($scope, $http, $state, $ionicModal, REST_CONFIG, $rootScope, $ionicPopup, $timeout, md5,                  $ionicLoading) {
    $scope.invalidFlag = false;
    $scope.valid = false;
    $scope.email = "pari@cesltd.com";
    $scope.pass = "pari";
    document.addEventListener('deviceready', function () {
        // window.plugin.email is now available
    }, false);
    var init = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    }
    init();
    $ionicLoading.hide();
    $scope.passFlag = false;
    $rootScope.list = {};
    $scope.signUp = {};
    $scope.signUp.name = "";
    var regex = '^[a-z_]{2,16}[.a-z_]{2,16}@cesltd.com';
    var h = new Date().getHours();
    if (h <= 18) {
        $scope.timeOfDay = "day";
    }
    else {
        $scope.timeOfDay = "night";
    }
    
//method to show Alert    
 
    var showAlert = function (textTitle, textBody) {
        var alertPopup = $ionicPopup.alert({
            title: '<h3>' + textTitle + '</h3>'
            , template: '<p>' + textBody + '</p>'
        });
        alertPopup.then(function (res) {});
        $timeout(function () {
            alertPopup.close(); //close the popup after 2 seconds for some reason
        }, 2000);
    };
  
 //method called on clicking Login Button
   
    $scope.loginValidate = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        console.log($scope.email);
        $rootScope.email = $scope.email;
        if (localStorage.getItem("Login") == 'firstTime') {
            // Enter credentials
            if ((typeof $scope.email != 'undefined' && $scope.email != null) && (typeof $scope.pass != 'undefined' && $scope.pass != null)) {
                $scope.pass = md5.createHash($scope.pass);
                // save to localStorage
                localStorage.setItem("email", $scope.email);
                $http.defaults.headers.common['email'] = $scope.email;
                $http.defaults.headers.common['pass'] = $scope.pass;
                $http({
                    method: 'GET'
                    , url: REST_CONFIG.baseURL + '/login'
                }).then(function successCallback(response) {
                    console.log(response);
                    if (response.data.success) {
                        $ionicLoading.hide();
                        $rootScope.uname = $scope.email;
                        if ($rootScope.email == 'cesCabService@gmail.com') {
                            $state.go("adminhome");
                        }
                        else {
                            localStorage.setItem("Login", "NotFirst");
                            $state.go("home");
                            $scope.showConfirmPasswordPopUp();
                        }
                    }
                    else {
                        $ionicLoading.hide();
                        showAlert("Login Failed", "Incorrect credentials");
                    }
                }, function errorCallback(error) {
                    $ionicLoading.hide();
                    console.log(error);
                    console.log("login Error");
                });
            }
            else {
                $ionicLoading.hide();
                showAlert("Login Failed", "Please enter username and password");
            }
            $scope.email = null;
            $scope.pass = null;
        }
        else {
            // Automatic Signin
            if ($scope.email == 'cesCabService@gmail.com') {
                var email = 'cesCabService@gmail.com';
            }
            else if ($scope.email == undefined || $scope.email == null) {
                $ionicLoading.hide();
                var email = $scope.email;
                showAlert("Login Failed", "Incorrect credentials");
            }
            else {
                var email = $scope.email;
            }
            if ($scope.pass.length > 0) {
                var password = md5.createHash($scope.pass);
            }
            else {
                showAlert("Login Failed", "Incorrect credentials");
            }
            console.log(email + "   " + password);
            $http.defaults.headers.common['email'] = email;
            $http.defaults.headers.common['pass'] = password;
            $rootScope.uname = $scope.uname;
            $http({
                method: 'GET'
                , url: REST_CONFIG.baseURL + '/login'
            , }).then(function successCallback(response) {
                $ionicLoading.hide();
                console.log(response);
                if (response.data.success) {
                    // $ionicLoading.hide();
                    $rootScope.uname = $scope.email;
                    if ($scope.email == 'cesCabService@gmail.com') {
                        $state.go("adminhome");
                    }
                    else {
                        $state.go("home");
                    }
                }
                else {
                    $ionicLoading.hide();
                    showAlert("Login Failed", "Incorrect credentials");
                }
            }, function errorCallback(error) {
                console.log("login Error");
            });
        }
    };
    $ionicLoading.hide();
    
    //Forget Password Popup
    //method called on forget password link click
    $scope.forgetPassword = function () {
            console.log("Inside Forget Password");
            $scope.emp = {};
            var forgetPasswordPopUp = $ionicPopup.show({
                template: ' Enter Email <input id="empEmail" type="text" ng-model="emp.empEmail">'
                , title: 'Reset Password'
                , subTitle: ''
                , scope: $scope
                , buttons: [{
                    text: 'Cancel'
      }, {
                    text: '<b>Save</b>'
                    , type: 'button-positive'
                    , onTap: function (e) {
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        console.log($scope.emp.empEmail);
                        if ((typeof $scope.emp.empEmail == 'undefined' || $scope.emp.empEmail == null || $scope.emp.empEmail == "")) {
                            showAlert("Cab Service", "Please Enter Required Fields");
                        }
                        else {
                            if ($scope.emp.empEmail.match(regex)) {
                                console.log("matches");
                                $http({
                                    method: 'POST'
                                    , url: REST_CONFIG.baseURL + '/resetPassword'
                                    , data: {
                                        email: $scope.emp.empEmail
                                    , }
                                }).then(function successCallback(response) {
                                    if (response.data.success) {
                                        $ionicLoading.hide();
                                        showAlert("Cab Service", "Your Password has been sent on your mail");
                                        localStorage.setItem("Login", "firstTime");
                                    }
                                    else {
                                        $ionicLoading.hide();
                                        showAlert("Cab Service", "Please Check Your Email Id");
                                    }
                                }, function errorCallback(error) {
                                    $ionicLoading.hide();
                                    console.log("Error");
                                });
                            }
                            else {
                                e.preventDefault();
                                document.getElementById("empEmail").value = "";
                                showAlert("Cab Service", "Please Check Your Email Id");
                            }
                        }
                    }
      }, ]
            });
        }
    
 //Forget Password Popup
    $scope.ChangePassword = function () {
        var newPassword = md5.createHash($scope.data.userPassword);
        var email = localStorage.getItem("email");
        $http({
            method: 'POST'
            , url: REST_CONFIG.baseURL + '/UpdatePassword'
            , data: {
                password: newPassword
                , email: email
            }
        }).then(function successCallback(response) {
            if (response.data.success) {
                showAlert("Cab Service", "Password Changed Successfully");
                localStorage.setItem("password", newPassword);
            }
            else {
                showAlert("Cab Service", "Problem Updating Password. Please try After Sometime");
            }
        }, function errorCallback(error) {
            console.log("login Error");
        });
    };
   
//Confirm password popup
    
    $scope.showConfirmPasswordPopUp = function () {
        $scope.data = {}
        var confirmPasswordPopUp = $ionicPopup.show({
            template: ' Enter Password<input id="userPassword" type="password" ng-model="data.userPassword">   <br> Enter Confirm Password  <input id="userConfirmPassword" type="password" ng-model="data.confirmPassword" > '
            , title: 'Enter Password'
            , subTitle: 'Please use normal things'
            , scope: $scope
            , buttons: [{
                text: 'Cancel'
      }, {
                text: '<b>Update</b>'
                , type: 'button-positive'
                , onTap: function (e) {
                    if (!$scope.data.userPassword) {
                        e.preventDefault();
                    }
                    else {
                        if ($scope.data.userPassword == $scope.data.confirmPassword) {
                            // do something when pass match
                            $scope.ChangePassword();
                            console.log('PASS MA');
                        }
                        else {
                            e.preventDefault();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Cab Service'
                                , template: 'Please provide matching passwords'
                            });
                            alertPopup.then(function (res) {
                                document.getElementById("userPassword").value = "";
                                document.getElementById("userConfirmPassword").value = "";
                            });
                        }
                    }
                }
      }, ]
        });
    };

//Register Modal
    $ionicModal.fromTemplateUrl('app/login/register.html', {
        scope: $scope
        , animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.register = modal;
    });
    
//method called on Sign Up button Click    
  
    $scope.showRegisterModal = function () {
            console.log('show..')
            $scope.isDisabled = false;
            $scope.invalidFlag = false;
            $scope.signUp = {};
            $scope.signUp.email = null;
            $scope.register.show();
        }
    
//method called on Cancel button of Register Modal
    
  
    $scope.closeRegisterModal = function () {
            $scope.isDisabled = false;
            $scope.invalidFlag = false;
            console.log($scope.signUp);
            $scope.register.hide();
        }
       
    // try watch
    $scope.$watch('signUp.email', function (newVal) {
        $scope.invalidFlag = false;
        if ($scope.signUp.email != undefined) {
            if ($scope.signUp.email.match(regex)) {
                $scope.invalidFlag = false;
            }
            else {
                $scope.invalidFlag = true;
            }
        }
    });
    // try watch
 var messageFlag = false;
    
  //method to submit sign up form
  
    $scope.signUpUser = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        $scope.isDisabled = true;
        if ($scope.signUp.email.match(regex)) {
            localStorage.setItem("email", $scope.signUp.email);
            // call '/save'
            if (typeof $scope.signUp.name != 'undefined' && $scope.signUp.name != null) {
                //$rootScope.uname = $scope.uname;
                $http({
                    method: 'POST'
                    , url: REST_CONFIG.baseURL + '/save'
                    , data: {
                        userData: $scope.signUp
                    }
                }).then(function successCallback(response) {
                    if (response.data.success) {
                        $ionicLoading.hide();
                        if (response.data.mail) {
                            showAlert("Cab Service", "Your Password has been sent to your mail");
                            localStorage.setItem("Login", "firstTime");
                            $scope.register.hide();
                            $state.go("login");
                            messageFlag = true;
                        }
                        else {
                            showAlert("Cab Service", "Problem sending email");
                            $scope.register.hide();
                            $state.go("login");
                        }
                    }
                    else if (messageFlag == false && response.data.message == 'Email Id Exist') {
                        showAlert("Cab Service", "Email Id Already Exist");
                        messageFlag = false;
                    }
                    else {
                        messageFlag = false;
                    }
                }, function errorCallback(error) {
                    console.log("login Error");
                });
            }
            else {
                showAlert("Login Failed", "Please enter username and password");
            }
        }
        else {
            console.log("Not matched");
        }
    };
    
    
});