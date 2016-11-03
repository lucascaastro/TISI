
angular
  .module('app', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider

    .when('/', {
       templateUrl: 'app/views/home.html',
       controller: 'HomeCtrl',
    })

    .otherwise ({ redirectTo: '/' });

  });
