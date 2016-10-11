
	var app = angular.module('crudComBD', []);
				app.controller('controlador', 

                   var Projetos = [];
                   var projeto[];
                   var Tarefas = [];
                   var tarefa = [];
                   var Subtarefas = [];
                   var subtarefa = [];
                   var Usuarios = [];
                   var usuario = [];

                    $scope.Projetos = Projetos;
                    $scope.Tarefas = Tarefas;
                    $scope.Subtarefas = Subtarefas;
                    $scope.Usuarios = Usuarios;

	 	    function($scope, $http) {
						
                        // Projeto
						// consulta no banco de dados e atualiza tabela na camada view	
						var atualizaTabelaProjetos = function(){
							$http.get('http://localhost:3000/retrieveProjeto')
							.then(function (response){
								$scope.Projetos = response.data;			
								}
							);
						};

						// consulta os produtos no banco de dados
						$scope.consultaProjetos = function(){
							atualizaTabelaProjetos ();
						};

						// remove do banco de dados
						$scope.removerProjeto = function(id_projeto){
							var resposta = confirm("Confirma a exclusão deste elemento?");
							if (resposta == true){
								$http.delete('http://localhost:3000/deleteProjeto' + id_projeto )
								.then(function (response){
									atualizaTabelaProjetos();
								});
							}
						};

						// insere no banco de dados
						$scope.inserirProjeto = function(){

							$http.post('http://localhost:3000/createProjeto', $scope.projeto)
							.then(function (response){
								atualizaTabelaProjetos();
								alert("Inserção com sucesso");
							}
							);
							
						};

						// atualiza no banco de dados
						$scope.atualizarProjeto = function(){
							$http.put('http://localhost:3000/updateProjeto', $scope.projeto)
							.then(function (response){
								atualizaTabelaProjetos();
								alert("Atualização com sucesso");
							}
							);
							
						};	

						// coloca o produto para edição
					$scope.preparaAtualizarProjeto = function(id){
						var posicao = retornaIndice(id);
						$scope.projeto = $scope.Projetos[posicao];
					}

					// função que retorna a posição de um produto pelo seu código 
					function retornaIndice(id){
						var i;
						for (i=0;i<$scope.Projetos.length;i++){
								if ($scope.Projetos[i].id_projeto == id){
									return i; // retorna posição do produto desejado
								}
						}
						return -1;
					}
						
					}
			);
