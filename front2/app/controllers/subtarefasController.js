angular
  .module('app')
  .controller('SubTarefasCtrl',function($scope,$http){
    // SubTarefas
    var atualizaTabelaSubTarefas= function(){
      $http.get('http://localhost:3000/retrieveSubTarefas')
      .then(function (response){
        $scope.listaSubTarefas = response.data;
        }
      );
    };


    $scope.consultaSubTarefas= function(){
      atualizaTabelaSubTarefas();
    };


    $scope.removerSubTarefa = function(id_subtarefa){

      var resposta = confirm("Confirma a exclusão deste elemento?");

      if (resposta === true){
        $http.delete('http://localhost:3000/deleteSubTarefa/' + id_subtarefa )
        .then(function (response){
          atualizaTabelaSubTarefas();
        });
      }
    };


    $scope.inserirSubTarefa = function(){
      $http.post('http://localhost:3000/createSubTarefa', $scope.subtarefa )
      .then(function (response){
        atualizaTabelaSubTarefas();
        alert("Inserção com sucesso");
      }
      );

    };


    $scope.atualizarSubTarefa = function(){
      $http.put('http://localhost:3000/updateSubTarefa', $scope.subtarefa )
      .then(function (response){
        atualizaTabelaSubTarefas();
        alert("Atualização com sucesso");
      });
    };

    $scope.preparaAtualizarSubTarefa = function(id_subtarefa){
      var posicao = retornaIndiceSubTarefa(id_subtarefa);
      $scope.subtarefa = $scope.listaSubTarefas[posicao];
    };

    function retornaIndiceSubTarefa(id_subtarefa){
      var i;
      for ( i=0; i < $scope.listaSubTarefas.length; i++ ){
        if ($scope.listaSubTarefas[i].id_subtarefa == id_subtarefa ){
          return i; // retorna posição do produto desejado
        }
      }
      return -1;
    }
  });
