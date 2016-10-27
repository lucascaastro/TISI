	var app = angular.module('crudComBD', []);

	app.controller('controlador', function($scope, $http) {
			

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


		$scope.removerProjeto = function(id_projeto){

			var resposta = confirm("Confirma a exclusão deste elemento?");

			if (resposta == true){
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
		}

		function retornaIndiceProjeto(id_projeto){
			var i;
			for ( i=0; i < $scope.listaProjetos.length; i++ ){
				if ($scope.listaProjetos[i].id_projeto == id_projeto ){
					return i; // retorna posição do produto desejado
				}
			}
			return -1;
		}


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

			if (resposta == true){
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
		}

		function retornaIndiceTarefa(id_tarefa){
			var i;
			for ( i=0; i < $scope.listaTarefas.length; i++ ){
				if ($scope.listaTarefas[i].id_tarefa == id_tarefa ){
					return i; // retorna posição do produto desejado
				}
			}
			return -1;
		}

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

			if (resposta == true){
				$http.delete('http://localhost:3000/deleteSubTarefa/' + id_subtarefa )
				.then(function (response){
					atualizaTabelaTarefas();
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
		}

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
