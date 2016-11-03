angular
 .module('app')
 .controller('tarefasCtrl',function($scope,$http){

   // Tarefas
   var atualizaTabelaTarefas= function(){
     $http.get('http://localhost:3000/retrieveTarefas')
     .then(function (response){
       $scope.listaTarefas= response.data;
       }
     );
   };


   $scope.consultaTarefas= function(){
     atualizaTabelaTarefas();
   };


   $scope.removerTarefa = function(id_tarefa){

     var resposta = confirm("Confirma a exclusão deste elemento?");

     if (resposta === true){
       $http.delete('http://localhost:3000/deleteTarefa/' + id_tarefa )
       .then(function (response){
         atualizaTabelaTarefas();
       });
     }
   };


   $scope.inserirTarefa = function(){
     $http.post('http://localhost:3000/createTarefa', $scope.tarefa )
     .then(function (response){
       atualizaTabelaTarefas();
       alert("Inserção com sucesso");
     }
     );

   };

   $scope.atualizarTarefa = function(){
     $http.put('http://localhost:3000/updateTarefa', $scope.tarefa )
     .then(function (response){
       atualizaTabelaTarefas();
       alert("Atualização com sucesso");
     });
   };

   $scope.preparaAtualizarTarefa = function(id_tarefa){
     var posicao = retornaIndiceTarefa(id_tarefa);
     $scope.tarefa = $scope.listaTarefas[posicao];
   };

   function retornaIndiceTarefa(id_tarefa){
     var i;
     for ( i=0; i < $scope.listaTarefas.length; i++ ){
       if ($scope.listaTarefas[i].id_tarefa == id_tarefa ){
         return i; // retorna posição do produto desejado
       }
     }
     return -1;
   }

 });
