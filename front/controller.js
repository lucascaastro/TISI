	var app = angular.module('crudComBD', []);

	app.controller('controlador', function($scope, $http) {
			

	  // Projetos 
		var atualizaTabelaProjetos_Usuario = function(){
			$http.get('http://localhost:3000/retrieveProjetos_Usuario')
			.then(function (response){
				$scope.listaProjetos = response.data;			
				}
			);
		};


		$scope.consultaProjetos_Usuario = function(){
			atualizaTabelaProjetos_Usuario();
		};


		$scope.removerProjeto = function(id_projeto){

			var resposta = confirm("Confirma a exclusão deste Projeto ?");

			if (resposta == true){
				$http.delete('http://localhost:3000/deleteProjeto/' + id_projeto)
				.then(function (response){
					atualizaTabelaProjetos_Usuario();
				});
			}
		};

		$scope.finalizarProjeto = function(id_projeto){
			
			var posicao = retornaIndiceProjeto(id_projeto);
			var resposta = confirm("Deseja finalizar este Projeto ?");

			if (resposta == true){
				$http.put('http://localhost:3000/finalizarProjeto_Usuario', $scope.listaProjetos[posicao])
				.then(function (response){
					atualizaTabelaProjetos_Usuario();
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
				atualizaTabelaProjetos_Usuario();
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
		var atualizaTabelaTarefas_Usuario = function(){
			$http.get('http://localhost:3000/retrieveTarefas_Usuario')
			.then(function (response){
				$scope.listaTarefas= response.data;			
				}
			);
		};


		$scope.consultaTarefas_Usuario = function(){
			atualizaTabelaTarefas_Usuario();
		};

		var atualiza_Tabela_Subtarefas_Tarefa_Usuario = function(id_tarefa){
			var posicao = retornaIndiceTarefa(id_tarefa);
			//$http.post('http://localhost:3000/retrieveSubtarefas_Tarefa_Usuario', $scope.listaTarefas[posicao])
			$http.get('http://localhost:3000/retrieveSubtarefas_Tarefa_Usuario', id_tarefa)
			.then(function (response){
				$scope.listaSubTarefas = response.data;			
				}
			);
		};

		$scope.consultaTarefas_Usuario = function(){
			atualizaTabelaTarefas_Usuario();
		};



		$scope.removerTarefa = function(id_tarefa){

			var resposta = confirm("Confirma a exclusão desta Tarefa ?");

			if (resposta == true){
				$http.delete('http://localhost:3000/deleteTarefa/' + id_tarefa )
				.then(function (response){
					atualizaTabelaTarefas();
				});
			}
		};

		$scope.finalizarTarefa = function(id_tarefa){

			var posicao = retornaIndiceTarefa(id_tarefa);

			var resposta = confirm("Deseja finalizar esta Tarefa ?");

			$http.put('http://localhost:3000/finalizarTarefa_Usuario', $scope.listaTarefas[posicao])
			.then(function (response){
				atualizaTabelaTarefas_Usuario();
				alert("Atualização com sucesso");
			});
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

		var atualizaTabelaSubTarefas_Usuario= function(){
			$http.get('http://localhost:3000/retrieveSubTarefas_Usuario')
			.then(function (response){
				$scope.listaSubTarefas = response.data;			
				}
			);
		};


		$scope.consultaSubTarefas_Usuario = function(){
			atualizaTabelaSubTarefas_Usuario();
		};

		var atualizaTabelaSubTarefasFinalizadas_Usuario= function(){
			$http.get('http://localhost:3000/retrieveSubTarefasFinalizadas_Usuario')
			.then(function (response){
				$scope.listaSubTarefas = response.data;			
				}
			);
		};


		$scope.consultaSubTarefasFinalizadas_Usuario = function(){
			atualizaTabelaSubTarefasFinalizadas_Usuario();
		};


		$scope.removerSubTarefa = function(id_subtarefa){

			var resposta = confirm("Confirma a exclusão desta Subtarefa ?");

			if (resposta == true){
				$http.delete('http://localhost:3000/deleteSubTarefa/' + id_subtarefa )
				.then(function (response){
					atualizaTabelaSubTarefas_Usuario();
				});
			}
		};


		$scope.inserirSubTarefa = function(){
			$http.post('http://localhost:3000/createSubTarefa', $scope.subtarefa )
			.then(function (response){
				atualizaTabelaSubTarefas_Usuario();
				alert("Inserção com sucesso");
			}
			);
			
		};


		$scope.atualizarSubTarefa = function(){
			$http.put('http://localhost:3000/updateSubTarefa', $scope.subtarefa )
			.then(function (response){
				atualizaTabelaSubTarefas_Usuario();
				alert("Atualização com sucesso");
			});
		};	

		$scope.preparaAtualizarSubTarefa = function(id_subtarefa){
			var posicao = retornaIndiceSubTarefa(id_subtarefa);
			$scope.subtarefa = $scope.listaSubTarefas[posicao];
		}

		$scope.finalizarSubTarefa = function(id_subtarefa){

			var posicao = retornaIndiceSubTarefa(id_subtarefa);

			var resposta = confirm("Deseja finalizar esta Subtarefa ?");

			$http.put('http://localhost:3000/finalizarSubtarefa', $scope.listaSubTarefas[posicao])
			.then(function (response){
				atualizaTabelaSubTarefas_Usuario();
				alert("Atualização com sucesso");
			});
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

			if (resposta == true){
				$http.delete('http://localhost:3000/deleteUsuario/'+id_usuario)
				.then(function (response){
					atualizaTabelaUsuarios();
				});
			}
		};


		$scope.cadastrarUsuario = function(){
			$http.post('http://localhost:3000/cadastroUsuario', $scope.usuario )
			.then(function (response){
				atualizaTabelaUsuarios();
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
		}

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
