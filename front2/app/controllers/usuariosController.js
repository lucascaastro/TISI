angular
  .module('app')
  .controller('usuariosCtrl', function($scope,$http){
          // Usuarios
          var atualizaTabelaUsuarios = function(){
            $http.get('http://localhost:3000/retrieveUsuarios')
            .then(function (response){
              $scope.listaUsuarios = response.data;
              }
            );
          };


          $scope.consultaUsuarios = function(){
            atualizaTabelaUsuarios();
          };


          $scope.removerUsuario = function(id_usuario){

            var resposta = confirm("Confirma a exclusão deste elemento?");

            if (resposta === true){
              $http.delete('http://localhost:3000/deleteUsuario/'+id_usuario)
              .then(function (response){
                atualizaTabelaUsuarios();
              });
            }
          };


          $scope.inserirUsuario = function(){
            $http.post('http://localhost:3000/createUsuario', $scope.usuario )
            .then(function (response){
              atualizaTabelaUsuarios();
              alert("Inserção com sucesso");
            }
            );

          };


          $scope.atualizarUsuario = function(){
            $http.put('http://localhost:3000/updateUsuario', $scope.usuario )
            .then(function (response){
              atualizaTabelaUsuarios();
              alert("Atualização com sucesso");
            });
          };

          $scope.preparaAtualizarUsuario = function(id_usuario ){
            var posicao = retornaIndiceUsuario(id_usuario);
            $scope.usuario = $scope.listaUsuarios[posicao];
          };

          function retornaIndiceUsuario(id_usuario){
            var i;
            for ( i=0; i < $scope.listaUsuarios.length; i++ ){
              if ($scope.listaUsuarios[i].id_usuario == id_usuario ){
                return i;
              }
            }
            return -1;
          }
  });
