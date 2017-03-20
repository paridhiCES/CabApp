 var sideMenu = angular.module('sideMenu', []);

    sideMenu.config(function($stateProvider) {

		$stateProvider.state('main', {
			url: "/main",
			abstract: true,
			templateUrl: "app/sidemenu/sidemenu.html",
			controller: "SideMenuController"
		})
	});

sideMenu.controller('SideMenuController',function($scope, $ionicSideMenuDelegate){
    
    
    
});