
angular
  .module('app', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider

    .when('/projetos', {
       templateUrl: 'app/views/projetos.html',
       controller: 'ProjetosCtrl',
    })

    .otherwise ({ redirectTo: '/projetos' });

  });
