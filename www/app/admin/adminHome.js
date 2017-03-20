var adminhome = angular.module('adminhome', ['cabNumberOnly','ionic']);
    adminhome.config(function ($stateProvider) {
            $stateProvider.state('adminhome', {
            url: "/adminhome",
            templateUrl: "app/admin/adminHome.html",
            controller: "adminController"
          });
    });

adminhome.controller('adminController',function($scope,$http,$rootScope,$ionicPopover,$filter,$ionicModal,$state,$ionicPopup,$ionicActionSheet, REST_CONFIG, $timeout){

    var empData = {};
    $scope.confirmDelete = false;
    $scope.allUsers = [];
    $scope.allUsersData = [];
    $scope.bookedCabList = [];
    $scope.canceledMorningCabs = [];
    $scope.canceledNightCabs = [];
    $scope.routeChanges = [];
    $scope.showbtn = false;
    $scope.today = new Date();
    $scope.tommorowDate = new Date();
    $scope.tommorowDate.setDate($scope.tommorowDate.getDate() + 1);

    $scope.tommorowDate = $filter('date')($scope.tommorowDate, "dd MM yyyy");
    console.log($scope.tommorowDate);

    $scope.today = $filter('date')($scope.today, "dd MM yyyy");
    $scope.show = false;
    $scope.model = {};
    $scope.model.name = "";
    $scope.flag = false;
    $scope.data = {
         showDelete: false
    };

    $scope.showPopup = function() {
        $scope.data ={};
      // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
        template: '<p>Are you sure, you want to delete this user?</p>',
        title: 'Cab Service',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'No',
            type: 'button-assertive',
            onTap: function(e) {
            }
          },
          {
            text: '<b>Yes</b>',
            type: 'button-assertive',
            onTap: function(e) {
            $scope.confirmDelete = true;
            }
          }
        ]
      });
    };


    $scope.onItemDelete = function(item) {
        // popup

        var myPopup = $ionicPopup.show({
        template: '<p>Are you sure, you want to delete this user?</p>',
        title: 'Cab Service',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'No',
            type: 'button-assertive',
            onTap: function(e) {
            }
          },
          {
            text: '<b>Yes</b>',
            type: 'button-assertive',
            onTap: function(e) {
                    $http.defaults.headers.common['email'] = item.emp_email;
                    $http({
                                method: "POST",
                                url: REST_CONFIG.baseURL+'/delete',
                                data: {
                                name : item
                            }
                    }).then(function successCallback(response) {
                        if(response.data.success){
                            $scope.allUsersData = [];
                            $scope.data.showDelete = false;
                            //$scope.allUsers.splice($scope.allUsers.indexOf(item), 1);
                            if(response.data.data != null){
                                angular.forEach(response.data.data, function(row){
                                         $scope.allUsersData.push(row);
                                });
                            }
                            showAlert("Ces Cab Service","User Deleted Successfully");
                       }else{
                           console.log("Server Error");
                       }

                    });
            }
          }
        ]
      });
    };


    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };

    var showAlert = function(textTitle, textBody) {
     var alertPopup = $ionicPopup.alert({
       title: '<h3>'+textTitle+'</h3>',
       template: '<p class="para">'+textBody+'</p>'
     });
     alertPopup.then(function(res) {

     });
   };

    $scope.selectedName = function(userData){
        $scope.flag = true;
        $scope.model1.name = userData.emp_name;
        $scope.model1.email = userData.emp_email;
        $scope.show = false;
        //$scope.model1.route = userData.route_no;
        $scope.model1.mob = userData.emp_mob;
        $scope.model1.pickup = userData.pick_up;
        $scope.model1.route = userData.route_no;
        $scope.filled = true;



        /*$scope.flag = true;
        $scope.model1.name = name;
        $scope.show = false;
          $http({
                    method: "GET",
                    url: REST_CONFIG.baseURL+'/search',
                    headers: {
                          uname :  name,
                          email :  localStorage.getItem("email")
                    }
                }).then(function successCallback(response){
                 empData = response.data.result;
                $scope.model1.uname = ""+empData[0].username;
                $scope.model1.mob = ""+empData[0].emp_mob;
                $scope.model1.pickup = empData[0].pick_up;
                $scope.model1.route = empData[0].route_no;
                $scope.filled = true;
          });*/
    }


     $scope.search = function(){
         $scope.count = 0;
         if(angular.isDefined($scope.model1.name) && $scope.model1.name != "" && $scope.model1.name != null){
             $scope.arr = [];
             for(var i = 0; i< $scope.allUsers.length; i++){
               if($scope.allUsers[i].indexOf($scope.model1.name) != -1){
                   $scope.arr.push($scope.allUsersData[i]);
                   console.log("Sara data Array :"+$scope.arr[i]);
                   $scope.show = true;
               }
              }
         }else if(!angular.isDefined($scope.model1.name) || $scope.model1.name == null || $scope.model1.name == ""){
              $scope.show = false;
         }
        }

     /*$scope.insertEmp = function(){
         console.log($scope.model);
         if($scope.model.name != null && $scope.model.mob != null && $scope.model.pickup && $scope.model.mob.length == '10' ){
            $http({
                    method: "POST",
                    url: REST_CONFIG.baseURL+'/insert',
                    data: {
                    model : $scope.model
                }
            }).then(function successCallback(response) {
                console.log(response.data.data);
            });
                $scope.model = null;
                $scope.insertModal.hide();
                init();
             }else{
                 showAlert("Cab Service","Please fill the fields");
             }

    }*/

    $scope.check = function(){
        console.log($scope.bookedCabList.length);
        if($scope.bookedCabList.length == 0){
            showAlert("Cab Service","No Data");
        }
    }

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };


    $scope.showActionSheet = function() {
        $ionicActionSheet.show({
          buttons: [
            { text: '<i class="icon ion-android-create"></i> Update Record' },
            /*{ text: '<i class="icon ion-android-delete"></i> Delete' },*/
          ],
          buttonClicked: function(index) {
              if(index==0){
                  $scope.showUpdateModal();
              }
             /* if(index==1){
                  $scope.showDeleteModal();
              }*/
            //console.log('BUTTON CLICKED', index);
            return true;
          }
        });
      };

    $scope.triggerActionSheet = function() {

      // Show the action sheet
      var showActionSheet = $ionicActionSheet.show({
         buttons: [
            { text: 'Edit 1' },
            { text: 'Edit 2' }
         ],

         destructiveText: 'Delete',
         titleText: 'Action Sheet',
         cancelText: 'Cancel',

         cancel: function() {
            // add cancel code...
         },

         buttonClicked: function(index) {
            if(index === 0) {
               // add edit 1 code
            }

            if(index === 1) {
               // add edit 2 code
            }
         },

         destructiveButtonClicked: function() {
            // add delete code..
         }
      });
   };




    $scope.updateEmp = function(){
       if($scope.flag){
        if(($scope.model1.name != null) && ($scope.model1.mob != null && $scope.model1.mob != "") && ($scope.model1.pickup!=null && $scope.model1.pickup!="") && ($scope.model1.route!=null && $scope.model1.route!="")){
            console.log($scope.model1);
          /*$http.defaults.headers.common['email'] = localStorage.getItem("email");*/
          $http({
                    method: "POST",
                    url: REST_CONFIG.baseURL+'/update',
                    data: {
                    email : $scope.model1.email,
                    model1 : $scope.model1
                    }
            }).then(function successCallback(response) {
              if(response.data.success){
                  console.log(response);
                  $scope.updateModal.hide();
              }else{
                  console.log("Update Error");
              }

            });

       }else{
           showAlert('Cab Service',"Please fill all the fields");
       }

       }else{
           showAlert('Cab Service',""+$scope.model1.name+" Does not exist");
            $scope.updateModal.hide();
       }
    }


    var init = function(){
          $scope.allUsers = [];
          $scope.allUsersData = [];
          $http.defaults.headers.common['email'] = localStorage.getItem("email");
         $http({
                        method: "GET",
                        url: REST_CONFIG.baseURL+'/getAllDetails',
                        headers: {
                            'Content-Type': 'application/json',
                              uname : $rootScope.uname
                        }
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        if(response.data.success){
                            angular.forEach(response.data.data[0], function(row, key){
                                row.date = $filter('date')(row.date, "dd MM yyyy");
                                console.log(row.date);
                                if(row.date == $scope.today || row.date == $scope.tommorowDate)
                                    $scope.bookedCabList.push(row);
                            });
                            angular.forEach(response.data.data[1], function(row, key){
                                    $scope.allUsers.push(row.emp_name);
                                console.log(row.emp_name);
                                    $scope.allUsersData.push(row);
                            });
                            angular.forEach(response.data.data[2], function(row, key){
                                row.date = $filter('date')(row.date, "dd MM yyyy");
                                if(row.date == $scope.today)
                                    $scope.canceledMorningCabs.push(row);
                            });
                             angular.forEach(response.data.data[3], function(row, key){
                                row.date = $filter('date')(row.date, "dd MM yyyy");
                                if(row.date == $scope.today)
                                    $scope.canceledNightCabs.push(row);
                             });
                             angular.forEach(response.data.data[4], function(row, key){
                                row.date = $filter('date')(row.date, "dd MM yyyy");
                                if(row.date == $scope.today)
                                    $scope.routeChanges.push(row);
                            });
                        }
             console.log($scope.bookedCabList);
               });
    }

    init();

    //Booked Night Cabs Modal
        $ionicModal.fromTemplateUrl('app/adminmodals/bookedcabs.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.bookedcabs = modal;
        });

        $scope.showBookCabsModal = function(){
            $scope.bookedcabs.show();
        }

        $scope.closebookedcabs = function(){
            $scope.bookedcabs.hide();
        }

    //Cancelled Night Cabs Modal

        $ionicModal.fromTemplateUrl('app/adminmodals/nightcabs.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.nightcabs = modal;
        });

         $scope.showNightCabsModal = function(){
            $scope.nightcabs.show();
         }

         $scope.closeNightCabsModal = function(){
            $scope.nightcabs.hide();
         }

    // Route Details Page

   /*     $ionicModal.fromTemplateUrl('app/adminmodals/routechanged.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.routechanged = modal;
        });
        */
        $scope.routeDetails = function(){
            $state.go("routedetails");
        }

        $scope.closeChangedRouteModal = function(){
            $scope.routechanged.hide();
        }

    //Cancelled Morning Cabs Modal

        $ionicModal.fromTemplateUrl('app/adminmodals/morningcabs.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.morningcabs = modal;
        });

        $scope.showMorningCabsModal = function(){
            $scope.morningcabs.show();
         }

         $scope.closeMorningCabsModal = function(){
            $scope.morningcabs.hide();
         }


         //Update Modal

        $ionicModal.fromTemplateUrl('app/admin/updateModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
             }).then(function(modal){
                    $scope.updateModal = modal;
            });

        $scope.showUpdateModal = function(){
           // $scope.refreshResource();
            $scope.filled = false;
            $scope.show =false;
            $scope.flag = false;
            $scope.model1 = {};
            $scope.updateModal.show();
        }

        $scope.closeUpdateModal = function(){
            $scope.updateModal.hide();
            //$scope.refreshResource();
        }

        //Delete Modal
        $ionicModal.fromTemplateUrl('app/admin/deleteModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
        }).then(function(modal){
                    $scope.deleteModal = modal;
        });
        $scope.showDeleteModal = function(){
            //$scope.refreshResource();
            $scope.filled = false;
            $scope.show =false;
            $scope.flag = false;
            $scope.deleteModal.show();
        }
        $scope.closedeleteModal = function(){
            $scope.deleteModal.hide();
           // $scope.refreshResource();
        }

    //Insert Modal

        $ionicModal.fromTemplateUrl('app/admin/insertModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
         }).then(function(modal){
                    $scope.insertModal = modal;
        });

        $scope.showInsertModal = function(){
            $scope.model = {};
            $scope.insertModal.show();
        }
        $scope.closeModal = function(){
            $scope.insertModal.hide();
           // $scope.refreshResource();
        }

        $scope.logout = function(){
            $state.go("login");
        }

        $scope.showBtn = function(){
            if($scope.showbtn == false){
                $scope.showbtn = !$scope.showbtn;
            }else{
                $scope.showbtn = !$scope.showbtn;
            }
        }

        $scope.refreshResource = function(){
            //init();
            $scope.$broadcast('scroll.refreshComplete');
        }

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
          }).then(function(popover) {
            $scope.popover = popover;
          });


        $scope.openPopover = function($event, item){
          //$('.popover').css('height', '170px');
            $('.popover').css('height', '300px');
            $scope.popover.show($event);
        };



});
