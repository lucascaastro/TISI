
var express = require('express');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressValidator = require('express-validator');

var core_use = require('cors');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:true})
var pg = require('pg');
var app = express();
var User = {id:-1};



app.listen(3000);

app.use(core_use());

app.use( bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// configura express-session
app.use(expressSession({

    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized:false,
    resave:false,

}));

app.use(expressValidator());


// Configure o acesso ao banco 
var config = {
  user: 'postgres', 
  database: 'TISI', 
  password: '123456',
  port: 5432,
  max: 10, 
  idleTimeoutMillis: 30000, 
};

var pool = new pg.Pool(config);



// Rota Login
app.post('/login', urlencodedParser, function (req, res) {

       var username=req.body.username;
       var senha=req.body.senha;
       var confirmaSenha =req.body.confirmaSenha;
      
       //var User = {id:-1};
       var usuario_existe;
       req.session.id_usuario = -1; // o usuario ainda não está logado na sessão 

	// Validação dos Dados
	//req.check('username', 'Nome de usuário Inválido.').isEmail();
	//req.check('senha', 'Senha inválida').isLength({min:4}).equals(confirmaSenha);
	req.check('senha', 'Senha inválida').isLength({min:4});

	// Verificar se houve erros na validação
	// se não procurar pelo usuario no banco

	var errors = req.validationErrors();
	if(errors){
	  req.session.erros = errors;
	  console.log(errors);
	  res.send('Not Working');
	}
	else{
	   //res.send('Working');

	  // verificar se o usuario existe no banco
	  pool.connect(function(err, client, done){

		  if(err) {
		    return console.error('error fetching client from pool', err);
		  }

		  var query = client.query("SELECT COUNT(*) FROM tb_usuarios where tb_usuarios.username = $1 and tb_usuarios.senha = $2", [username, senha], function(err,row){
		    done();

		    if(err){
			return console.error('error running query', err);
		    }

		  }); // end query

		  query.on('row', function(row){

			usuario_existe = row.count;

			  // Usuario existe
			  console.log('usuario existe: ' + usuario_existe);
			  if( usuario_existe == 1){
				
				// Criar objeto User para a sessão
				var query = client.query("SELECT id_usuario FROM tb_usuarios where tb_usuarios.username = $1", [username], function(err, result){
					 done();

					 if(err){
					    return console.error('error running query', err);
					  }

					  console.log('id_usuario no banco:' + result.rows[0].id_usuario);
					  User.id = result.rows[0].id_usuario;
					  req.session.id_usuario = result.rows[0].id_usuario;

				   
				 });

				 res.send('Usuario Existe e sessão iniciada');
			  }
			  else{
				res.send('Usuario Não existe\n');
			  }
		  });

  	  }); // end connect
	} // end else
}); // end rota login

app.get('/dashboard', function(req, res){

	console.log('Dashboard User.id: ' + User.id);

	//Verifica se o usuario não está logado
	if(User.id == -1 ){
		res.status(404).send("Não está logado.");
	}
	res.status(200).send("Deu certo, vc está logado !! ");
});

app.get('/logout', function(req, res){

	//Verifica se o usuario não está logado
	if(User.id == -1){
		res.status(404).send("Não está logado.");
	}
	else{
	   User.id = -1; 
	   req.session.destroy( function(err){
	    if(err){
	    	return console.error('erro na hora de destruir a sessão', err);
	    }

	    res.send("Não está mais logado.");
	   });
	   
	}
});

//////////// CRUD Projetos

// Seleciona todos os projetos do Usuario -- Funciona
app.get('/retrieveProjetos_Usuario', function(req, res) {

    var id = User.id; 

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT p.id_projeto, p.id_usuario, p.nome, p.descricao, p.data_inicio, p.data_entrega, p.fg_ativo  FROM tb_projetos p inner join tb_usuarios u on ( p.id_usuario = u.id_usuario and u.id_usuario = $1) where p.fg_ativo = 1 order by 1 ASC', [id], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});


// Seleciona todos os Projetos já finalizados -- Funciona
app.get('/retrieveProjetosFinalizados_Usuario', function(req, res) {

	//var username = req.body.username; 
	var id = User.id;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('select p.id_projeto, p.id_usuario, p.nome, p.descricao, p.data_inicio, p.data_entrega, p.fg_ativo from tb_projetos p inner join tb_usuarios u on ( p.id_usuario = u.id_usuario ) and u.id_usuario = $1 and p.fg_ativo = 0', [id], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});



// Cancela um Projeto de um Usuario incluindo todas suas Tarefas e Subtarefas
// -- Funciona 
app.put('/finalizarProjeto_Usuario', urlencodedParser, function(req, res) {

	//var id_usuario = req.body.id_usuario;
	var id = User.id;
	var id_projeto = req.body.id_projeto;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('update tb_projetos set fg_ativo = 0 from tb_usuarios where tb_usuarios.id_usuario = tb_projetos.id_usuario and tb_usuarios.id_usuario = $1 and tb_projetos.id_projeto = $2',[id, id_projeto], function(err,result){
            done();
            if(err){
                return console.error('error running query', err);
            }
          });

         client.query('update tb_tarefas set fg_ativo = 0 from tb_projetos where tb_projetos.id_projeto = tb_tarefas.id_projeto and tb_projetos.id_usuario = $1 and tb_projetos.id_projeto = $2',[id, id_projeto], function(err,result){
            done();
            if(err){
                return console.error('error running query', err);
            }
          });

         client.query('update tb_subtarefas set fg_ativo = 0 from tb_tarefas where tb_subtarefas.id_tarefa = tb_tarefas.id_tarefa and tb_tarefas.id_usuario = $1 and tb_tarefas.id_projeto = $2',[id, id_projeto], function(err,result){
            done();
            if(err){
                return console.error('error running query', err);
            }
          });

    });

    res.send("Projeto finalizado");

});


// Create -- Funciona
app.post('/createProjeto', urlencodedParser, function (req, res) {

	  var data = { id_usuario: User.id, nome: req.body.nome, fg_ativo: 1,
		       descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega
		       }

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_projetos( id_usuario, nome, descricao, data_inicio, data_entrega, fg_ativo) values($1,$2,$3,$4,$5, $6)",
			[ data.id_usuario, data.nome, data.descricao, data.data_inicio, data.data_entrega, data.fg_ativo])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

  	  });
	
          res.send('Projeto criado com sucesso');
});

// Retrieve -- Não Usar
app.get('/retrieveProjetos', function(req, res) {

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT * FROM tb_projetos ORDER BY id_projeto ASC', function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);
        });

    });

});

// Update
app.put('/updateProjeto', urlencodedParser, function(req, res) {

    var id = req.body.id_projeto;
    var data = { nome: req.body.nome, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega:req.body.data_entrega, fg_ativo:req.body.fg_ativo };

    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

	client.query('update tb_projetos set nome = \'' + data.nome + '\', descricao = \'' + 
		    data.descricao + '\', data_inicio = \'' + data.data_inicio + 
		    '\', data_entrega = \'' + data.data_entrega + '\' where tb_projetos.id_projeto = ' + id,  function(err, result){
	  done();
	  if(err){
		return console.error('error running query', err);
	  }

	});
    });
    res.send('Projeto Atualizado com sucesso');
});


// Delete
//app.delete('/deleteProjeto', urlencodedParser, function(req, res) {
app.delete('/deleteProjeto/:id_projeto', function(req, res) {


    // Grab data from the URL parameters
    //var id = req.body.id_projeto;

    var id = req.params.id_projeto;

    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

    client.query('DELETE FROM tb_subtarefas USING tb_tarefas where tb_tarefas.id_tarefa = tb_subtarefas.id_tarefa and tb_tarefas.id_projeto  = ' + id, function(err, result) {
	  done();
	  if( err ){
		return console.error('error running query', err);
	  }
	});

    client.query('DELETE FROM tb_tarefas WHERE tb_tarefas.id_projeto = ' + id, function(err, result) {
	  done();
	  if( err ){
		return console.error('error running query', err);
	  }
	});

    client.query('DELETE FROM tb_projetos WHERE tb_projetos.id_projeto = ' + id, function(err, result) {
	  done();
	  if( err ){
		return console.error('error running query', err);
	  }
	});

     });

     res.send("Projeto deletado com Sucesso");
});
//////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////// CRUD Tarefas


// Seleciona todas Tarefas do Usuario ordenando por Prioridade -- Funciona
app.get('/retrieveTarefas_Usuario', function(req, res) {

    var id = User.id; 

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT t.id_tarefa, t.id_projeto, t.id_usuario, t.prioridade, t.nome, t.descricao, t.data_inicio, t.data_entrega from tb_tarefas t inner join tb_usuarios u on ( u.id_usuario = t.id_usuario and u.id_usuario = $1 and t.fg_ativo = 1) order by t.prioridade desc',[id], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});


// Seleciona todas as Tarefas já finalizadas pelo Usuario -- Funciona
app.get('/retrieveTarefasFinalizadas_Usuario', function(req, res) {

    var id = User.id; 

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT t.nome, t.descricao, t.data_inicio, t.data_entrega from tb_tarefas t inner join tb_usuarios u on (t.id_usuario = u.id_usuario) and u.id_usuario = $1 and t.fg_ativo = 0',[id], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});


// Seleciona todas as Tarefas já finalizadas pelo Usuario dentro de um Projeto
// -- Funciona
app.post('/retrieveTarefasFinalizadasUsuario_Projeto', urlencodedParser, function(req, res) {

	//var username = req.body.username; 
	var id = User.id;
	var proj_nome = req.body.proj_nome;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT t.nome, t.descricao, t.data_inicio, t.data_entrega from tb_tarefas t inner join tb_usuarios u on (t.id_usuario = u.id_usuario) inner join tb_projetos p on ( p.id_usuario = u.id_usuario) where u.id_usuario = $1 and p.nome = $2  and t.fg_ativo = 0',[id, proj_nome], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});



// finaliza uma Tarefa de um Usuario dentro de um Projeto, incluindo todas suas
// subtarefas -- Funciona 
app.put('/finalizarTarefa_Usuario', urlencodedParser, function(req, res) {

	var id_usuario = User.id;
	var id_projeto = req.body.id_projeto;
	var id_tarefa = req.body.id_tarefa;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('update tb_tarefas set fg_ativo = 0 from tb_projetos where tb_projetos.id_projeto = tb_tarefas.id_projeto and tb_projetos.id_usuario = $1 and tb_projetos.id_projeto = $2 and tb_tarefas.id_tarefa = $3',[id_usuario, id_projeto, id_tarefa], function(err,result){
            done();
            if(err){
                return console.error('error running query', err);
            }
          });

         client.query('update tb_subtarefas set fg_ativo = 0 from tb_tarefas where tb_subtarefas.id_tarefa = tb_tarefas.id_tarefa and tb_tarefas.id_usuario = $1 and tb_tarefas.id_projeto = $2',[id_usuario, id_projeto], function(err,result){
            done();
            if(err){
                return console.error('error running query', err);
            }
          });

	 res.send("Tarefas finalizadas");

    });

});

// Create -- Funciona
app.post('/createTarefa', urlencodedParser, function (req, res) {

	  var data = {  id_projeto: req.body.id_projeto, id_usuario: User.id, nome: req.body.nome, fg_ativo: 1,
		      prioridade: req.body.prioridade, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega,
		       }

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_tarefas( id_projeto, id_usuario, nome, prioridade, descricao, data_inicio, data_entrega, fg_ativo) values($1,$2,$3,$4,$5,$6,$7, $8)",
			[data.id_projeto, data.id_usuario, data.nome, data.prioridade, data.descricao, data.data_inicio, data.data_entrega, data.fg_ativo])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

 	 });
	
         res.send('Tarefa criada com sucesso');
  
});

// Retrieve -- Não usar 
app.get('/retrieveTarefas', function(req, res) {


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT * FROM tb_tarefas ORDER BY id_tarefa ASC', function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});

// Update -- Funciona
app.put('/updateTarefa', urlencodedParser, function(req, res) {


    var id = req.body.id_tarefa;

    var data = { nome: req.body.descricao, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega:req.body.data_entrega, prioridade: req.body.prioridade, fg_ativo: req.body.fg_ativo};

    pool.connect(function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

	client.query('update tb_tarefas set nome = \'' + data.nome + '\', descricao = \'' + data.descricao + '\', prioridade = '+data.prioridade+', data_inicio = \'' + data.data_inicio + '\', data_entrega = \'' + data.data_entrega + '\' where id_tarefa = ' + id,
	  function(err, result){

	  done();

	  if(err){
		return console.error('error running query', err);
	  }

	});
      });

      res.send('Tarefa atualizada com sucesso');
});


// Delete -- Funciona
app.delete('/deleteTarefa/:id_tarefa', function(req, res) {

    //var id = req.body.id_tarefa;
    var id = req.params.id_tarefa;

    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {

        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query('DELETE FROM tb_subtarefas USING tb_tarefas WHERE tb_tarefas.id_tarefa = tb_subtarefas.id_tarefa and tb_subtarefas.id_tarefa = ' + id, function(err, result) {
	  done();
	  if( err ){
		return console.error('error running query', err);
	  }
	});

        client.query('DELETE FROM tb_tarefas WHERE tb_tarefas.id_tarefa  = ' + id, function(err, result) {
	  done();
	  if( err ){
		return console.error('error running query', err);
	  }
	});

     });

     res.send('Tarefa deletada com sucesso');
});
//////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////CRUD Subtarefas


// Seleciona todas Subtarefas do Usuario ordenando por Prioridade -- Funciona
app.get('/retrieveSubtarefas_Usuario', function(req, res) {

    //var username = req.body.username; 
    var id = User.id; 

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT st.id_subtarefa, st.id_tarefa, st.id_usuario, st.nome, st.prioridade, st.descricao, st.data_inicio, st.data_entrega, st.fg_ativo from tb_subtarefas st inner join tb_usuarios u on ( u.id_usuario = st.id_usuario and u.id_usuario = $1 and st.fg_ativo = 1) order by st.prioridade desc',[id], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});



// Seleciona todas as Subtarefas já finalizadas pelo Usuario -- Funciona 
app.get('/retrieveSubtarefasFinalizadas_Usuario', function(req, res) {

    //var username = req.body.username; 
    var id = User.id;

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT st.id_usuario, st.nome, st.descricao, st.data_inicio, st.data_entrega from tb_subtarefas st inner join tb_usuarios u on (st.id_usuario = u.id_usuario) and u.id_usuario = $1 and st.fg_ativo = 0',[id], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});



// Seleciona todas as Subtarefas do Usuario dentro de um
// Tarefa -- Funciona  
//app.post('/retrieveSubtarefas_Tarefa_Usuario', urlencodedParser, function(req, res) {
app.get('/retrieveSubtarefas_Tarefa_Usuario', function(req, res) {

	//var username = req.body.username; 
        var id = User.id;
	//var id_tarefa = req.body.id_tarefa; 
	var id_tarefa = req.params.id_tarefa; 


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT st.id_subtarefa, st.id_tarefa, st.id_usuario, st.nome, st.prioridade, st.descricao, st.data_inicio, st.data_entrega, st.fg_ativo from tb_subtarefas st inner join tb_tarefas t on ( st.id_tarefa = t.id_tarefa) inner join tb_usuarios u on ( t.id_usuario = u.id_usuario ) where u.id_usuario = $1 and t.id_tarefa = $2 and st.fg_ativo = 1',[User.id, id_tarefa], function(err,result){
            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});


// Cancela uma Subtarefas -- Funciona 
app.put('/finalizarSubtarefa', urlencodedParser, function(req, res) {

     var id = User.id;
     var id_subtarefa = req.body.id_subtarefa;
    
    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query("update tb_subtarefas set fg_ativo = 0 where id_usuario = $1 and id_subtarefa = $2", [id, id_subtarefa], function(err,result){
            done();

            if(err){
                return console.error('error running query', err);
            }
          });
	 res.send("Subtarefa cancelada com sucesso");

    });

});

// Create SubTarefa para uma Tarefa de um usuário logado -- Funciona
app.post('/createSubTarefa', urlencodedParser, function (req, res) {
	  
          var id = User.id;

	  if( User.id == -1 ){
		res.send("Vc não esta logado");
	  }

	  var data = { id_tarefa: req.body.id_tarefa, id_usuario: id, nome: req.body.nome,
		      descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega,
		       }                               

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_subtarefas(id_tarefa, id_usuario, nome, descricao, data_inicio, data_entrega) values($1,$2,$3,$4,$5,$6)",
			[ data.id_tarefa, data.id_usuario, data.nome, data.descricao, data.data_inicio, data.data_entrega])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

  	 });

	res.send('Subtarefa criada com sucesso');
});

// Retrieve todas tarefas de todos usuarios -- Funciona
app.get('/retrieveSubTarefas', function(req, res) {

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT * FROM tb_subtarefas ORDER BY id_subtarefa ASC', function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});

// Update uma SubTarefa de um Usuário -- Funciona
app.put('/updateSubTarefa', urlencodedParser, function(req, res) {


    var id = req.body.id_subtarefa;

    var data = { id_tarefa: req.body.id_tarefa, nome: req.body.nome, descricao: req.body.descricao, prioridade: req.body.prioridade, data_inicio: req.body.data_inicio, data_entrega:req.body.data_entrega, data_termino: req.body.data_termino};


    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

	client.query('update tb_subtarefas set id_tarefa = '+data.id_tarefa+', nome = \'' + data.nome + '\', descricao = \'' + data.descricao + '\', prioridade = '+data.prioridade+', data_inicio = \'' + data.data_inicio + '\', data_entrega = \'' + data.data_entrega + '\' where id_subtarefa = ' + id,
	  function(err, result){

	  done();

	  if(err){
		return console.error('error running query', err);
	  }

	});
    });

    res.send('Subtarefa atualizada com sucesso');
});

// Delete -- Funciona
app.delete('/deleteSubTarefa/:id_subtarefa', function(req, res) {

    var id = req.params.id_subtarefa;

    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {

        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query('DELETE FROM tb_subtarefas WHERE id_subtarefa = ' + id, function(err, result) {

	  done();

	  if( err ){
		return console.error('error running query', err);
	  }

	});

    });

    res.send('Subtarefa deletada com sucesso');
});


////////////////////////////////////////////////CRUD Usuario 

// Cadastro  -- Funciona
app.post('/cadastroUsuario', urlencodedParser, function (req, res) {

       var nome = req.body.nome;
       var sobrenome = req.body.sobrenome; 
       var username=req.body.username;
       var senha=req.body.senha;
       var confirmaSenha =req.body.confirmaSenha;
      
       //var User = {id:-1};
       var usuario_existe;
       req.session.id_usuario = -1; // o usuario ainda não está logado na sessão 

	// Validação dos Dados
	req.check('username', 'Nome de usuário Inválido.').isEmail();
	req.check('senha', 'Senha inválida').isLength({min:4}).equals(confirmaSenha);
	req.check('senha', 'Senha inválida').isLength({min:4});

	// Verificar se houve erros na validação
	// se não procurar pelo usuario no banco

	var errors = req.validationErrors();
	if(errors){
	  req.session.erros = errors;
	  console.log(errors);
	  res.send('Not Working');
	}
	else{

	  // verificar se o usuario ja existe no banco
	  pool.connect(function(err, client, done){

		  if(err) {
		    return console.error('error fetching client from pool', err);
		  }

		  var query = client.query("SELECT COUNT(*) FROM tb_usuarios where tb_usuarios.username = $1 and tb_usuarios.senha = $2", [username, senha], function(err,row){
		    done();

		    if(err){
			return console.error('error running query', err);
		    }

		  }); // end query

		  query.on('row', function(row){

			usuario_existe = row.count;

			  // Usuario não existe, cadastrar usuario
			  if( usuario_existe == 0){

				  var data = { nome: req.body.nome, sobrenome: req.body.sobrenome, 
					      username: req.body.username, senha: req.body.senha, fg_ativo: 1};

				  pool.connect(function(err, client, done) {

				  if(err) {
				    return console.error('error fetching client from pool', err);
				  }

				  client.query( "INSERT INTO tb_usuarios( nome, sobrenome, username, senha, fg_ativo ) values($1,$2,$3,$4,$5)", 
						[ data.nome, data.sobrenome, data.username, data.senha, data.fg_ativo ])

				  done();

				  if(err) {
				    return console.error('error running query', err);
				  }
					
			  	  });
				 res.send('Usuario Criado');
			  }
			  else{
				res.send('Usuario já existe');
			  }
		  });

  	  }); // end connect
  } // end else
});

// Retrieve -- Não usar
app.get('/retrieveUsuarios', function(req, res) {

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT * FROM tb_usuarios ORDER BY id_usuario ASC', function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});

// Update -- Funciona
app.put('/updateUsuario', urlencodedParser, function(req, res) {

    var id = User.id;

    var data = { nome: req.body.nome, sobrenome: req.body.sobrenome, username: req.body.username, senha:req.body.senha };

    pool.connect(function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

	client.query('update tb_usuarios set nome = \'' + data.nome + '\', sobrenome = \'' + data.sobrenome + '\', username = \'' + data.username+ '\', senha= \'' + data.senha + '\'  where id_usuario = ' + id,  
	  function(err, result){

	  done();

	  if(err){
		return console.error('error running query', err);
	  } 

	});
      });

    res.send('Usuario atualizado com sucesso');

});

// Delete -- Funciona
app.delete('/deleteUsuario/:id_usuario', function(req, res) {

    var id = req.params.id_usuario;

    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {

        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query('DELETE FROM tb_subtarefas USING tb_tarefas where tb_tarefas.id_usuario = tb_subtarefas.id_usuario and tb_tarefas.id_usuario = ' + id, function(err, result) {
	  done();
	  if( err ){
		return console.error('error running query', err);
	  }
	});

        client.query('DELETE FROM tb_tarefas WHERE tb_tarefas.id_usuario = ' + id, function(err, result) {
	  done();
	  if( err ){
		return console.error('error running query', err);
	  }
	});

        client.query('DELETE FROM tb_projetos WHERE tb_projetos.id_usuario = ' + id, function(err, result) {
	  done();
	  if( err ){
		return console.error('error running query', err);
	  }
	});
        client.query('DELETE FROM tb_usuarios WHERE id_usuario = ' + id, function(err, result) {

	  done();

	  if( err ){
		return console.error('error running query', err);
	  }

	});

     });
  
     res.send('Usuario deletado com sucesso');
});

//////////////////////////////////////////////////////////////////////////////////////////////////






