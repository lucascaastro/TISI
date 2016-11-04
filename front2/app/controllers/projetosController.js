angular
  .module("app")
  .controller("ProjetosCtrl", function($scope, $http){
    console.log($scope);

    // Projetos
    var atualizaTabelaProjetos = function(){
      $http.get('http://localhost:3000/retrieveProjetos')
      .then(function (response){
        $scope.listaProjetos = response.data;
        }
      );
    };

    $scope.consultaProjetos = function(){
      atualizaTabelaProjetos();
    };

    $scope.consultaProjetos();

    $scope.removerProjeto = function(id_projeto){

      var resposta = confirm("Confirma a exclusão deste elemento?");

      if (resposta === true){
        $http.delete('http://localhost:3000/deleteProjeto/' + id_projeto)
        .then(function (response){
          atualizaTabelaProjetos();
        });
      }
    };

    $scope.inserirProjeto = function(){
      $http.post('http://localhost:3000/createProjeto', $scope.projeto )
      .then(function (response){
        atualizaTabelaProjetos();
        alert("Inserção com sucesso");
      }
      );

    };

    $scope.atualizarProjeto = function(){
      $http.put('http://localhost:3000/updateProjeto', $scope.projeto)
      .then(function (response){
        atualizaTabelaProjetos();
        alert("Atualização com sucesso");
      });
    };

    $scope.preparaAtualizarProjeto = function(id_projeto){
      var posicao = retornaIndiceProjeto(id_projeto);
      $scope.projeto = $scope.listaProjetos[posicao];
    };

    function retornaIndiceProjeto(id_projeto){
      var i;
      for ( i=0; i < $scope.listaProjetos.length; i++ ){
        if ($scope.listaProjetos[i].id_projeto == id_projeto ){
          return i; // retorna posição do produto desejado
        }
      }
      return -1;
    }

  });
