var Home = angular.module('home', ['ionic-timepicker']);
    Home.config(function ($stateProvider) {
            $stateProvider.state('home', {
                url: "/home",
                templateUrl: "app/employee/empHome.html",
                controller: "empController"
            });
    });

Home.controller('empController',function($scope, $http, $rootScope, $ionicActionSheet, $state, REST_CONFIG, $ionicModal,$ionicPopup, $filter, $ionicPopup , $window){

      //Disable browser back button
    $scope.$on('$locationChangeStart', function(event, next, current){
    event.preventDefault();
    });
    $scope.isDisable = false;
    $scope.items = [{name:'Book Now', id:'book'} ,{name:'Cancel Now', id:'cancel'},{name:'Contact', id:'contact'}];
    $scope.showModal = false;
    $scope.detail = {};
    $scope.emptyRoutedetails = false;
    $scope.todayDate = new Date();
    $scope.todayDate = $filter('date')( $scope.todayDate, 'yyyy/MM/dd');
    $scope.date = new Date();
    $scope.tommorrow = new Date($scope.date);
    $scope.tommorrow = ($scope.tommorrow.getFullYear()+"/"+($scope.tommorrow.getMonth()+1)+"/"+($scope.tommorrow.getDate()+1));
    console.log($scope.tommorrow);
    $scope.routeNumber = "";
    $scope.newUser = {};
    $scope.address = {};
    $scope.bookingDetail = {};
    $scope.routeMembers = [];
    var radioDate;
    var booking_flag = false;
    var bookDate = null;
    var bookingDetails = [];
    var cancelNi8flag = false;
    var showAlert = function(textTitle, textBody) {
     var alertPopup = $ionicPopup.alert({
       title: '<h3>'+textTitle+'</h3>',
       template: '<p class="para">'+textBody+'</p>'
     });
        alertPopup.then(function(res) {
    });
   };

    $scope.$watch('newUser.birthDate', function(unformattedDate){
        $scope.newUser.formattedBirthDate = $filter('date')(unformattedDate, 'dd/MM/yyyy HH:mm');
    });

    $scope.data = {
         selectedFilter: null,
         options: [
            {id: '1', name: 'Avadi'},
           {id: '2', name: 'Valencia'},
           {id: '3', name: 'Valecherry'},
           {id: '4', name: 'Radience'}
         ],
        };



        console.log($scope.routeNumber);
        $http({
                    method: "GET",
                    url: REST_CONFIG.baseURL+'/routeDetails',
                    headers: {
                        'Content-Type': 'application/json',
                         route_no : $scope.routeNumber,
                        email : $rootScope.uname
                    }
                }).then(function successCallback(response) {
                    if(response.data.success){
                        angular.forEach(response.data.data,function(row,key){
                           $scope.routeMembers.push(row);
                           $scope.emptyRoutedetails = false;
                        });
                   }else{
                        $scope.emptyRoutedetails = true;
                        console.log("Route Details Error");
                    }
            });





    var init = function(){
         $http({
                    method: "GET",
                    url: REST_CONFIG.baseURL+'/getDetails',
                    headers: {
                        'Content-Type': 'application/json',
                         uname : $rootScope.email
                    }
                }).then(function successCallback(response) {
                    if(response.data.success){
                        console.log(response.data.data[0].date);
                        booking_flag = true;
                        for(var i=0; i<response.data.data.length; i++){
                           bookingDetails.push(response.data.data[i]);
                        }
                         console.log(bookingDetails);
                   }else{
                       console.log("Nothing in db");
                   }
            });
        console.log(bookingDetails);
  }

    init();


  $scope.logout = function(){
    $state.go("login");
  }

  $scope.closeModal = function(){
       $scope.refreshResource();
       $scope.bookingmodal.hide();
       $scope.bookingTime = null;
  }

   $scope.refreshResource = function(){
        $scope.$broadcast('scroll.refreshComplete');
   }

   var saveNew = function(){
      if($scope.bookingTime > $scope.todayDate){
           radioDate =  document.getElementById("paraToday").innerHTML;
      }else{
           radioDate = document.getElementById("paraTommorow").innerHTML;
      }

       console.log(radioDate);
       console.log($scope.bookingTime);

       var dateObj = new Date(radioDate);

       dateObj.setHours($scope.selectedTimeUTC.getUTCHours());
       dateObj.setMinutes($scope.selectedTimeUTC.getUTCMinutes());
       console.log(dateObj);

       $http({
                    method: "POST",
                    url: REST_CONFIG.baseURL+'/booking',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data:{
                        date: radioDate,
                        time: $scope.bookingTime,
                        uname: $rootScope.email
                    }
                }).then(function successCallback(response) {
                        console.log(response);
                        $scope.closeModal();
                   });
       $scope.bookingTime = null;
    }


    $scope.saveModal = function(){


            if($scope.bookingTime != null){
            if(cancelNi8flag == false){
                showAlert("Cab Service","Booking Late Night Cab will Cancel your Night Cab");
            }else{
                showAlert("Cab Service","Booked late night cab ");
            }

            $scope.isDisable = true;
            saveNew();
        }else{
            showAlert("Cab Service","Please select time");
        }
        }


    $scope.closeRouteModal = function(){
       $scope.refreshResource();
       $scope.routemodal.hide();
       $scope.address.newRoute = null;
    }

    $scope.saveRouteModal = function(routeObj){
        if($scope.address.newRoute!=null){
                $scope.route = routeObj.newRoute;
                console.log($rootScope.uname);
                if(typeof $rootScope.uname != undefined &&  $rootScope.uname != null ){
                /*$http.defaults.headers.common['email'] = localStorage.getItem("email");*/
                $http({
                            method: "POST",
                            url: REST_CONFIG.baseURL+'/saveRoute',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data:{
                                name : $rootScope.uname,
                                route : $scope.route,
                                date : $scope.todayDate
                            }
                        }).then(function successCallback(response) {
                            $scope.closeRouteModal();
                        });
               /* $scope.address.currentRoute = null;*/
                $scope.address.newRoute = null;
            }
        }else{
            showAlert("Cab Service","Please enter new route");
        }
    }


     $scope.timePickerCallback = function(val) {
        var hours = null;
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          }else {
              var selectedTime = new Date(val * 1000);
              $scope.selectedTimeUTC = selectedTime;
              console.log(selectedTime.getUTCHours());
              if(selectedTime.getUTCHours() > 23 || (selectedTime.getUTCMinutes() >= 30 && selectedTime.getUTCHours() == 23 ) || selectedTime.getUTCHours() <= 3){
                console.log("No problem");
                 if(selectedTime.getUTCHours()<10){
                     hours = '0'+selectedTime.getUTCHours();
                     console.log(hours);
                 }else{
                     hours = selectedTime.getUTCHours();
                 }
                if(selectedTime.getUTCMinutes() == '0'){
                    $scope.bookingTime = hours +':'+'0'+selectedTime.getUTCMinutes();
                }else{
                    $scope.bookingTime = hours +':'+selectedTime.getUTCMinutes();
                }
              }else{
                 showAlert("Cab Service","Can be booked from 11:30 PM to 3.00 AM");
              }

            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
          }
    }

    $scope.timePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 12,  //Optional
      titleLabel: '12-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        $scope.timePickerCallback(val);
      }
    };

    /*if($scope.date.getHours()>12){
      $scope.hours =  "0" + ($scope.date.getHours() - 12);
      $scope.time.setTime($scope.hours +":"+ $scope.date.getMinutes());
    }else{
        $scope.time.setTime($scope.date.getHours() +":"+$scope.date.getMinutes());
    }*/

    $scope.show = function(){
        if(angular.isDefined($scope.isDisabled))
            $scope.isDisabled = !$scope.isDisabled;
        else
            $scope.isDisabled = true;
    }

    $scope.hide = function(){
        if(angular.isDefined($scope.isHide))
            $scope.isHide = !$scope.isHide;
        else
            $scope.isHide = true;
    }

    $scope.nightCab = function(){
        var addZero;
        if($scope.date.getHours() < 23){
            console.log(bookingDetails);
            if(bookingDetails.length <= 0){
                console.log("Nothing");
                $scope.bookingmodal.show();
            }else{
            var FormatChangedDate = $filter('date')(bookingDetails[0].date, "dd MM yyyy");
            console.log(FormatChangedDate);
            var dateToday = new Date();
            dateToday = $filter('date')(dateToday, "dd MM yyyy");

            var tommorowDate = new Date($scope.date);
               console.log(tommorowDate.getDate());
                if((tommorowDate.getMonth()+1) < 10 && tommorowDate.getDate() < 10){
                    addZero = "";
                }else{
                    addZero = '0';
                }
            tommorowDate = (addZero+(tommorowDate.getDate()+1)+" "+addZero+(tommorowDate.getMonth()+1)+" "+tommorowDate.getFullYear());
            console.log(tommorowDate);
            var splitTime  = bookingDetails[0].time.split(':');
                console.log(splitTime);
                var hours = splitTime[0];

        if(bookingDetails[0].time == null || (FormatChangedDate == dateToday && hours < 10) && FormatChangedDate != tommorowDate || bookingDetails[0].time == 'undefined'){
               $scope.refreshResource();
               $scope.date = new Date();
               $scope.time = null;
               $scope.bookingmodal.show();
        }else{
            showAlert('Cab Service',"You have already booked night cab for "+FormatChangedDate+" "+bookingDetails[0].time);
        }
            }
       /* if(bookingDetails[0] == null && bookingDetails[0] == 'undefined'){

        }else{

        }*/
        }else{
                showAlert('Cab Service',"Should be booked before 11 PM");
        }
        init();
    }

    $scope.routeDetails = function(){
        if($scope.emptyRoutedetails ){
           showAlert("Cab Service","No members");
        }else{
            $scope.routemodal.show();
        }


        console.log($rootScope.uname);
        console.log(localStorage.getItem("email"));

       /* $http({
                method: "GET",
                url: REST_CONFIG.baseURL+'/routeDetails',
                headers: {
                     email : $rootScope.uname
                        }
                        }).then(function successCallback(response) {
                            if(response.data.success){
                                angular.forEach(response.data.data,function(row,key){
                                    $scope.routeMembers.push(row);
                                });

                            }else{
                                showAlert("Cab Service","No Members");
                            }
                        });*/

    }

   $scope.cancelMorningCab = function(){
    if($scope.date.getHours() < 22){ // < 10
        var todayDate = new Date();
            $http({
                        method: "GET",
                        url: REST_CONFIG.baseURL+'/checkcancelcab',
                        headers: {
                             /*uname : $rootScope.uname,*/
                             type : "morning",
                             //date : todayDate,
                             email : $rootScope.uname /*localStorage.getItem("email")*/
                        }
                        }).then(function successCallback(response) {
                            if(response.data.success){
                                showAlert("Cab Service","Already cancelled cab");
                            }else{
                                insertMornRecord();
                            }
                        });

        var insertMornRecord = function(){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Cancel Morning Cab',
                template: 'Are you sure you want to cancel morning cab?'
            });

            confirmPopup.then(function(res) {
            if(res) {
             var todayDate = new Date();
                console.log(todayDate);

                $http({
                    method: "POST",
                    url: REST_CONFIG.baseURL+'/cancelcab',
                    data: {
                         uname : $rootScope.uname,
                         type : "morning",
                         date : todayDate
                    }
                    }).then(function successCallback(response) {
                        if(response.data.success == true){
                            showAlert("Cab Service","Cancelled cab");
                        }
                });

            } else {
                console.log('no');
            }
            });

        }

    }else{
        showAlert("Cab Service","Should be cancelled before 10 AM");
    }
   }


   var insertRecord = function(){
        if($scope.isDisable == false){
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Cancel Night Cab',
                    template: 'Are you sure you want to cancel night cab?'
                });
                confirmPopup.then(function(res){
                if(res) {
                    var todayDate = new Date();
                    console.log(todayDate);
                    $http({
                        method: "POST",
                        url: REST_CONFIG.baseURL+'/cancelcab',
                        data: {
                             uname : $rootScope.uname,
                             type : "night",
                             date : todayDate
                        }
                        }).then(function successCallback(response) {
                            if(response.data.success){
                               showAlert("Cab Service","Cancelled Night Cab");
                            }else{
                               showAlert("Cab Service","Already cancelled cab");
                            }
                        });
                } else
                    console.log('no');
                });
            }else{
                showAlert("Cab Service","Already booked Night Cab");
            }
   }

    $scope.cancelNightCab = function(){
        bookDate = $filter('date')(bookDate, "dd MM yyyy");
        console.log($scope.date.getHours());
        if($scope.date.getHours() >= 13  && $scope.date.getHours() <= 22){
            var todayDate = new Date();
            todayDate = $filter('date')(todayDate, "dd MM yyyy");
            console.log(bookDate + " " + todayDate);
            if(booking_flag == false && bookDate != todayDate){
            $http({
                        method: "GET",
                        url: REST_CONFIG.baseURL+'/checkcancelcab',
                        headers: {
                             uname : $rootScope.email,
                             type : "night",
                             date : todayDate
                        }
                        }).then(function successCallback(response) {
                            if(response.data.success){
                                showAlert("Cab Service","Already cancelled cab");
                                cancelNi8flag = false;
                            }else{
                                insertRecord();
                                cancelNi8flag = true;
                            }
                        });
            }else{
               showAlert("Cab Service","You have already booked late night cab");
            }
        }else{
            showAlert("Cab Service","Should be cancelled after 1 PM and before 8 PM");
        }
        }



     $ionicModal.fromTemplateUrl('app/routemodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.routemodal = modal;
    });

    $ionicModal.fromTemplateUrl('app/bookingmodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.bookingmodal = modal;
    });




});
