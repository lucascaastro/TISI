	var app = angular.module('crudComBD', []);

	app.controller('controlador', function($scope, $http) {

	    var id_projeto;

	    // Login 
	    $scope.mostrarLogin= function(){
			window.location.href = 'view_login.html';
	    };

	    $scope.Login = function(login){

			$http.post('http://localhost:3000/login', login)
			.then(function (response ){
				if( response.data == 1){
				   alert('Login efetuado com sucesso');
					window.location.href = 'view_projetos_tarefas_subtarefas.html';
				}
				else if( response.data == 0 ){
				   alert('Login inválido');
				}
				else{
				   alert('Usuário não cadastrado');
				}
			});
			
		};

	    $scope.Logout = function(login){

			var resposta = confirm("Deseja Sair ?");

			if (resposta == true){

				$http.get('http://localhost:3000/logout')
				.then(function (response ){
			  	   window.location.href = 'view_home.html';
			});
			
			}
		};


	    // Cadastro
	    $scope.mostrarCadastro = function(id_projeto){
			$scope.id_p = id_projeto;
			window.location.href = 'view_cadastro.html';
	    };

	    $scope.cadastrarUsuario = function(usuario){
		
			$http.post('http://localhost:3000/cadastroUsuario', usuario)
			.then( function(response ){

			      if( response.data == 0 ){
				alert('Dados inválidos, preencha novamente');
			      }
			      else if( response.data == 1 ){
				alert('Cadastro realizado com sucesso');
			      }
			      else{
				alert('Nome de usuário já cadastrado');
			      }

			});
	    };



	  // Projetos 
		var atualizaTabelaProjetos_Usuario = function(){
			$http.get('http://localhost:3000/retrieveProjetos_Usuario')
			.then(function (response){
				$scope.listaProjetos = response.data;			
				}
			);
		};

		var atualizaTabelaProjetosFinalizados_Usuario = function(){

			$http.get('http://localhost:3000/retrieveProjetosFinalizados_Usuario')
			.then(function (response){
				$scope.listaProjetosFinalizados = response.data;			
				}
			);
		};


		$scope.consultaProjetos_Usuario = function(){
			atualizaTabelaProjetos_Usuario();
		};

		$scope.consultaProjetosFinalizados_Usuario = function(){
			atualizaTabelaProjetosFinalizados_Usuario();
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

		$scope.removerProjeto_Finalizado = function(id_projeto){

			var resposta = confirm("Confirma a exclusão deste Projeto ?");

			if (resposta == true){
				$http.delete('http://localhost:3000/deleteProjeto_Finalizado/' + id_projeto)
				.then(function (response){
					atualizaTabelaProjetosFinalizados_Usuario();
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
					atualizaTabelaProjetosFinalizados_Usuario();
				});
			}
		};

		$scope.reativarProjeto = function(id_projeto){
			
			var posicao = retornaIndiceProjeto_Finalizado(id_projeto);

			$http.put('http://localhost:3000/reativarProjeto_Usuario', $scope.listaProjetosFinalizados[posicao])
			.then(function (response){
				alert('Projeto Reativado');
				atualizaTabelaProjetos_Usuario();
				atualizaTabelaProjetosFinalizados_Usuario();
			});
		};


		$scope.inserirProjeto = function(){
			$http.post('http://localhost:3000/createProjeto', $scope.projeto )
			.then(function (response){
				atualizaTabelaProjetos_Usuario();
				alert("Inserção com sucesso");
				$scope.projeto = {};
			}
			);
			
		};


		$scope.atualizarProjeto = function(){
			$http.put('http://localhost:3000/updateProjeto', $scope.projeto)
			.then(function (response){
				atualizaTabelaProjetos_Usuario();
				alert("Atualização com sucesso");
				$scope.projeto = {};
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
					return i; 
				}
			}
			return -1;
		}

		function retornaIndiceProjeto_Finalizado(id_projeto){
			var i;
			for ( i=0; i < $scope.listaProjetosFinalizados.length; i++ ){
				if ($scope.listaProjetosFinalizados[i].id_projeto == id_projeto ){
					return i; 
				}
			}
			return -1;
		}


	  	// Tarefas 

		//// Consulta 
		$scope.consultaTarefasUsuario_Projeto = function(id_projeto){
			atualiza_Tabela_Tarefas_Usuario_Projeto(id_projeto);
		};

		$scope.consultaTarefas_Usuario = function(){
			atualiza_Tabela_Tarefas_Usuario();
		};

		$scope.consultaSubtarefas_Tarefa_Usuario = function(id_tarefa){
			atualiza_Tabela_Subtarefas_Tarefa_Usuario(id_tarefa);
		};

		$scope.mostrarTarefas = function(id_projeto){
			atualiza_Tabela_Tarefas_Usuario_Projeto(id_projeto);
		};

		var atualiza_Tabela_Tarefas_Usuario_Projeto = function(id_projeto){
			
			var id = id_projeto;
			var projeto = { id_projeto: id };

			$http.post('http://localhost:3000/retrieveTarefasUsuario_Projeto', projeto )
			.then(function (response){
				$scope.listaTarefas = response.data;			
				}
			);
		};

		var atualiza_Tabela_Tarefas_Usuario = function(){
			$http.get('http://localhost:3000/retrieveTarefas_Usuario')
			.then(function (response){
				$scope.listaTarefas= response.data;			
				}
			);
		};

		var atualiza_Tabela_Subtarefas_Tarefa_Usuario = function(id_tarefa){

			var posicao = retornaIndiceTarefa(id_tarefa);

			$http.get('http://localhost:3000/retrieveSubtarefas_Tarefa_Usuario', id_tarefa)
			.then(function (response){
				$scope.listaSubTarefas = response.data;			
				}
			);
		};

		////////////////

		// Remover	
		$scope.removerTarefa = function(id_tarefa, id_projeto){

			var resposta = confirm("Confirma a exclusão desta Tarefa ?");
			if (resposta == true){
				$http.delete('http://localhost:3000/deleteTarefa/' + id_tarefa )
				.then(function (response){
					atualiza_Tabela_Tarefas_Usuario_Projeto(id_projeto);
				});
			}
		};

		////////////////////////////////

		// Finalizar 
		$scope.finalizarTarefa = function(id_tarefa, id_projeto){

			var posicao = retornaIndiceTarefa(id_tarefa);
			var resposta = confirm("Deseja finalizar esta Tarefa ?");

			$http.put('http://localhost:3000/finalizarTarefa_Usuario', $scope.listaTarefas[posicao])
			.then(function (response){
				atualiza_Tabela_Tarefas_Usuario_Projeto(id_projeto);
				alert("Atualização com sucesso");
			});
		};	
		////////////////////////////////


		// Inserir 
		$scope.inserirTarefa = function(){
			$http.post('http://localhost:3000/createTarefa', $scope.tarefa )
			.then(function (response){
				alert("Inserido com sucesso");
				$scope.tarefa = {};
				atualizar_Tabela_Tarefas_Usuario();
			}
			);
			
		};

		$scope.inserirTarefa2 = function(id_projeto){

			$scope.tarefa.id_projeto = id_projeto;

			$http.post('http://localhost:3000/createTarefa', $scope.tarefa )
			.then(function (response){
				alert("Inserido com sucesso");
				$scope.tarefa = {};
				window.location.href='view_tarefas_subtarefas.html';
			}
			);
			
		};

		$scope.inserirTarefa3 = function(id_projeto){

			$scope.tarefa.id_projeto = id_projeto;

			$http.post('http://localhost:3000/createTarefa', $scope.tarefa )
			.then(function (response){
				alert("Inserido com sucesso");
				$scope.tarefa = {};
			}
			);
			
		};
		////////////////////////////////


		// Atualizar
		$scope.atualizarTarefa = function(id_projeto){

			$http.put('http://localhost:3000/updateTarefa', $scope.tarefa )
			.then(function (response){
				//atualizaTabelaTarefas();
				atualiza_Tabela_Tarefas_Usuario_Projeto(id_projeto);
				alert("Atualização com sucesso");
			});
		};	

		$scope.atualizarTarefa2 = function(){

			$http.put('http://localhost:3000/updateTarefa', $scope.tarefa )
			.then(function (response){
				//atualizaTabelaTarefas();
				atualiza_Tabela_Tarefas_Usuario_Projeto(id_projeto);
				alert("Atualização com sucesso");
			});
		};	

		$scope.editarTarefa= function(id_tarefa, id_projeto){

			var posicao = retornaIndiceTarefa(id_tarefa);
			$scope.tarefa = $scope.listaTarefas[posicao];
		}

		$scope.editarTarefa2 = function(id){
			$scope.tarefa = { id_projeto: id, nome:'Nome da Tarefa', prioridade: 1, descricao: 'Descrição da Tarefa', data_inicio: '1/1/1', data_entrega: '1/1/1' }; 
		}
		////////////////////

		// Auxiliar
		function retornaIndiceTarefa(id_tarefa){
			var i;
			for ( i=0; i < $scope.listaTarefas.length; i++ ){
				if ($scope.listaTarefas[i].id_tarefa == id_tarefa ){
					return i; // retorna posição do produto desejado
				}
			}
			return -1;
		}
		//////////////////////

	  // SubTarefas 

		// Consultar
		$scope.consultaSubtarefasTarefa_Usuario = function(){
			atualiza_Tabela_Subtarefas_Tarefa_Usuario();
		};

		$scope.consultaSubTarefas_Usuario = function(){
			atualiza_Tabela_SubTarefas_Usuario();
		};

		$scope.consultaSubTarefasFinalizadas_Usuario = function(){
			atualiza_Tabela_SubTarefas_Finalizadas_Usuario();
		};

		var atualiza_Tabela_Subtarefas_Tarefa_Usuario = function(id){
			
			var tarefa = { id_tarefa: id };
			$http.post('http://localhost:3000/retrieveSubtarefas_Tarefa_Usuario', tarefa )
			.then(function (response){
				$scope.listaSubTarefas = response.data;			
				}
			);
		};

		var atualiza_Tabela_SubTarefas_Usuario= function(){
			$http.get('http://localhost:3000/retrieveSubTarefas_Usuario')
			.then(function (response){
				$scope.listaSubTarefas = response.data;			
				}
			);
		};


		var atualiza_Tabela_SubTarefas_Finalizadas_Usuario= function(){
			$http.get('http://localhost:3000/retrieveSubTarefasFinalizadas_Usuario')
			.then(function (response){
				$scope.listaSubTarefas = response.data;			
				}
			);
		};


		$scope.mostrarSubtarefas = function(id_tarefa){
			atualiza_Tabela_Subtarefas_Tarefa_Usuario(id_tarefa);
		};

		$scope.editarSubtarefa= function(id){
			$scope.subtarefa = { id_tarefa: id, nome:'Nome da Subtarefa', prioridade: 1, descricao: 'Descrição da Subtarefa', data_inicio: '1/1/1', data_entrega: '1/1/1' }; 
		}


		////////////////////////////////////////////////////////////////

		// Remover
		$scope.removerSubTarefa = function(id_subtarefa){

			var resposta = confirm("Confirma a exclusão desta Subtarefa ?");

			if (resposta == true){
				$http.delete('http://localhost:3000/deleteSubTarefa/' + id_subtarefa )
				.then(function (response){
					alert("Subtarefa removida com sucesso");
				       atualiza_Tabela_Subtarefas_Tarefa_Usuario(); 
				});
			}
		};

		///////////////////////////////////////////////////////////////////

		// Finalizar
		$scope.finalizarSubTarefa = function(id_subtarefa){

			var posicao = retornaIndiceSubTarefa(id_subtarefa);

			var resposta = confirm("Deseja finalizar esta Subtarefa ?");

			$http.put('http://localhost:3000/finalizarSubtarefa', $scope.listaSubTarefas[posicao])
			.then(function (response){
				alert("Subtarfa Finalizada com sucesso");
				atualiza_Tabela_Subtarefas_Tarefa_Usuario(); 
			});
		};	
		///////////////////////////////////////////////////////////////////


		// Inserir
		$scope.inserirSubTarefa = function(){
			$http.post('http://localhost:3000/createSubTarefa', $scope.subtarefa )
			.then(function (response){
				alert("Inserção com sucesso");
				atualiza_Tabela_Subtarefas_Tarefa_Usuario(); 
				$scope.subtarefa = {};
			});
			
		};

		$scope.inserirSubTarefa2 = function(id_tarefa){
			
			$scope.subtarefa.id_tarefa = id_tarefa;

			$http.post('http://localhost:3000/createSubTarefa', $scope.subtarefa )
			.then(function (response){
				alert("Inserção com sucesso");
				atualiza_Tabela_Subtarefas_Tarefa_Usuario(); 
				window.location.href='view_tarefas_subtarefas.html';
			});
			
		};

		$scope.inserirSubTarefa3 = function(id_tarefa){
			
			$scope.subtarefa.id_tarefa = id_tarefa;

			$http.post('http://localhost:3000/createSubTarefa', $scope.subtarefa )
			.then(function (response){
				alert("Inserção com sucesso");
				atualiza_Tabela_Subtarefas_Tarefa_Usuario(); 
			});
			
		};

		///////////////////////////////////////////////////////////////////


		// Atualizar
		$scope.atualizarSubTarefa = function(){

			$http.put('http://localhost:3000/updateSubTarefa', $scope.subtarefa )
			.then(function (response){
				alert("Atualização com sucesso");
				atualiza_Tabela_Subtarefas_Tarefa_Usuario(); 
			});
		};	

		$scope.preparaAtualizarSubTarefa = function(id_subtarefa){
			var posicao = retornaIndiceSubTarefa(id_subtarefa);
			$scope.subtarefa = $scope.listaSubTarefas[posicao];
		}

		///////////////////////////////////////////////////////////////////

		
		// Auxiliar
		function retornaIndiceSubTarefa(id_subtarefa){
			var i;
			for ( i=0; i < $scope.listaSubTarefas.length; i++ ){
				if ($scope.listaSubTarefas[i].id_subtarefa == id_subtarefa ){
					return i; // retorna posição do produto desejado
				}
			}
			return -1;
		}
		///////////////////////////////////////////////////////////////////

	  // Usuarios 
		var atualizaTabela_MinhaConta = function(){
			$http.get('http://localhost:3000/retrieveMinhaConta')
			.then(function (response){
				$scope.MeusDados = response.data;			
				}
			);
		};

		var atualizaTabela_Usuarios = function(){
			$http.get('http://localhost:3000/retrieveUsuarios')
			.then(function (response){
				$scope.listaUsuarios = response.data;			
				}
			);
		};

		$scope.consultaUsuarios = function(){
			atualizaTabela_Usuarios();
		};

		$scope.consultaMinhaConta= function(){
			atualizaTabela_MinhaConta();
			atualizaTabela_Usuarios();
		};


		$scope.removerConta = function(id_usuario){

			var resposta = confirm("Confirma a exclusão deste elemento?");

			if (resposta == true){
				$http.delete('http://localhost:3000/deleteUsuario/'+id_usuario)
				.then(function (response){
					atualizaTabela_MinhaConta();
				});
			}
		};


		$scope.cadastrarUsuario = function(){
			$http.post('http://localhost:3000/cadastroUsuario', $scope.usuario )
			.then(function (response){}
			);
		};


		$scope.atualizarMinhaConta= function(){
			$http.put('http://localhost:3000/updateUsuario', $scope.dado)
			.then(function (response){
				atualizaTabela_MinhaConta();
				alert("Atualização com sucesso");
			});
		};	

		$scope.atualizarMinhaSenha = function(){
			$http.put('http://localhost:3000/updateNovaSenha', $scope.dado)
			.then(function (response){
				if( response.data == 0 ){
				   alert('Senha Inválida');
				}
				else{
				   atualizaTabela_MinhaConta();
				   alert("Atualização com sucesso");
				}
			});
		};	

		$scope.preparaAtualizar_MinhaConta = function(id_usuario ){

			var posicao = retornaIndiceUsuario(id_usuario);
			$scope.dado = $scope.listaUsuarios[posicao];
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
