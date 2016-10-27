// cria objeto express - servidor Web (HTTP)
var express = require('express');

// cria objeto bodyParser - dados do usuário do formulário
var bodyParser = require('body-parser');

// cria aplicação express
var app = express();
app.listen(3000)

var core_use = require('cors');
app.use(core_use());

app.use( bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// cria objeto capaz de manipular documento JSON
var jsonParser = bodyParser.json();

// cria um parser application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended:true})

var pg = require('pg');

var config = {
  user: 'postgres', 
  database: 'TISI', 
  password: '123456',
  port: 5432,
  max: 10, 
  idleTimeoutMillis: 30000, 
};

// Configure the pool
var pool = new pg.Pool(config);


// CRUD Projetos
// Create
app.post('/createProjeto', urlencodedParser, function (req, res) {

	  var data = { id_usuario: req.body.id_usuario, nome: req.body.nome,
		       descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega
		       }

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_projetos( id_usuario, nome, descricao, data_inicio, data_entrega) values($1,$2,$3,$4,$5)",
			[ data.id_usuario, data.nome, data.descricao, data.data_inicio, data.data_entrega ])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

  });
});

// Retrieve
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
});


// CRUD Tarefas
// Create
app.post('/createTarefa', urlencodedParser, function (req, res) {

	  var data = {  id_projeto: req.body.id_projeto, id_usuario: req.body.id_usuario, nome: req.body.nome,
		      prioridade: req.body.prioridade, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega,
		       }

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_tarefas( id_projeto, id_usuario, nome, prioridade, descricao, data_inicio, data_entrega) values($1,$2,$3,$4,$5,$6,$7)",
			[data.id_projeto, data.id_usuario, data.nome, data.prioridade, data.descricao, data.data_inicio, data.data_entrega])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

  });
});

// Retrieve
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

// Update
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
});


// Delete
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
});

//CRUD Subtarefas
// Create
app.post('/createSubTarefa', urlencodedParser, function (req, res) {

	  var data = { id_tarefa: req.body.id_tarefa, id_usuario: req.body.id_usuario, nome: req.body.nome,
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
});

// Retrieve
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

// Update
app.put('/updateSubTarefa', urlencodedParser, function(req, res) {


    var id = req.body.id_subtarefa;

    var data = { nome: req.body.nome, descricao: req.body.descricao, prioridade: req.body.prioridade, data_inicio: req.body.data_inicio, data_entrega:req.body.data_entrega, data_termino: req.body.data_termino};


    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

	client.query('update tb_subtarefas set nome = \'' + data.nome + '\', descricao = \'' + data.descricao + '\', prioridade = '+data.prioridade+', data_inicio = \'' + data.data_inicio + '\', data_entrega = \'' + data.data_entrega + '\' where id_subtarefa = ' + id,
	  function(err, result){

	  done();

	  if(err){
		return console.error('error running query', err);
	  }

	});
      });
});

// Delete
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
});


//CRUD Uusuario 
// Create 
app.post('/createUsuario', urlencodedParser, function (req, res) {
	
	  var data = { nome: req.body.nome, sobrenome: req.body.sobrenome, 
		      username: req.body.username, senha: req.body.senha, fg_ativo: req.body.fg_ativo};

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
});

// Retrieve
app.get('/retrieveUsuario', function(req, res) {

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

// Update
app.put('/updateUsuario', urlencodedParser, function(req, res) {


    var id = req.body.id_usuario;

    var data = { nome: req.body.nome, sobrenome: req.body.sobrenome, username: req.body.username, senha:req.body.senha };


    // Get a Postgres client from the connection pool
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
});

// Delete
app.delete('/deleteUsuario', urlencodedParser, function(req, res) {

    var id = req.body.id_usuario;


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
});


// Selects
// Seleciona todos os projetos do Usuario
app.put('/retrieveProjetos_Usuario', urlencodedParser, function(req, res) {

	var username = req.body.username; 

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT p.nome, p.descricao, p.data_inicio, p.data_entrega  FROM tb_projetos p inner join tb_usuarios u on ( p.id_usuario = u.id_usuario and u.username = $1) order by 1 ASC', [username], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});


// Seleciona todas Tarefas do Usuario ordenando por Prioridade
app.post('/retrieveTarefas_Usuario', urlencodedParser, function(req, res) {

	var username = req.body.username; 

    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT t.prioridade, t.nome, t.descricao, t.data_inicio, t.data_entrega from tb_tarefas t inner join tb_usuarios u on ( u.id_usuario = t.id_usuario and u.username = $1 ) order by t.prioridade desc',[username], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});

// Seleciona todas Subtarefas do Usuario ordenando por Prioridade
app.post('/retrieveSubtarefas_Usuario', urlencodedParser, function(req, res) {

	var username = req.body.username; 


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT st.prioridade, st.nome, st.descricao, st.data_inicio, st.data_entrega from tb_subtarefas st inner join tb_usuarios u on ( u.id_usuario = st.id_usuario and u.username = $1 ) order by st.prioridade desc',[username], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});


// Seleciona todos os Projetos já finalizados 
app.post('/retrieveProjetosFinalizados_Usuario', urlencodedParser, function(req, res) {

	var username = req.body.username; 


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('select p.nome, p.descricao, p.data_inicio, p.data_entrega from tb_projetos p inner join tb_usuarios u on ( p.id_usuario = u.id_usuario ) and u.username = $1 and p.fg_ativo = 0', [username], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});

// Seleciona todos as Tarefas já finalizadas pelo Usuario
app.post('/retrieveTarefasFinalizadas_Usuario', urlencodedParser, function(req, res) {

	var username = req.body.username; 


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT t.nome, t.descricao, t.data_inicio, t.data_entrega from tb_tarefas t inner join tb_usuarios u on (t.id_usuario = u.id_usuario) and u.username = $1 and t.fg_ativo = 0',[username], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});

// Seleciona todos as Subtarefas já finalizadas pelo Usuario
app.post('/retrieveSubtarefasFinalizadas_Usuario', urlencodedParser, function(req, res) {

	var username = req.body.username; 


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT st.nome, st.descricao, st.data_inicio, st.data_entrega from tb_subtarefas st inner join tb_usuarios u on (st.id_usuario = u.id_usuario) and u.username = $1 and st.fg_ativo = 0',[username], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});

// Seleciona todos as Tarefas já finalizadas pelo Usuario dentro de um Projeto 
app.post('/retrieveTarefasFinalizadasUsuario_Projeto', urlencodedParser, function(req, res) {

	var username = req.body.username; 
	var proj_nome = req.body.proj_nome;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT t.nome, t.descricao, t.data_inicio, t.data_entrega from tb_tarefas t inner join tb_usuarios u on (t.id_usuario = u.id_usuario) inner join tb_projetos p on ( p.id_usuario = u.id_usuario) where u.username = $1 and p.nome = $2  and t.fg_ativo = 0',[username, proj_nome], function(err,result){

            done();

            if(err){
                return console.error('error running query', err);
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(result.rows);

        });

    });

});

// Seleciona todos as Subtarefas já finalizadas pelo Usuario dentro de um Projeto 
app.post('/retrieveSubtarefasFinalizadasUsuario_Projeto', urlencodedParser, function(req, res) {

	var username = req.body.username; 
	var proj_nome = req.body.proj_nome;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('SELECT st.nome, st.descricao, st.data_inicio, st.data_entrega from tb_subtarefas st inner join tb_usuarios u on (st.id_usuario = u.id_usuario) inner join tb_projetos p on ( p.id_usuario = u.id_usuario) where u.username = $1 and p.nome = $2 and st.fg_ativo = 0',[username, proj_nome], function(err,result){

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
app.post('/CancelarProjeto_Usuario', urlencodedParser, function(req, res) {

	var id_usuario = req.body.id_usuario;
	var id_projeto = req.body.id_projeto;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('update tb_projetos set fg_ativo = 0 from tb_usuarios where tb_usuarios.id_usuario = tb_projetos.id_usuario and tb_usuarios.id_usuario = $1 and tb_projetos.id_projeto = $2',[id_usuario, id_projeto], function(err,result){
            done();
            if(err){
                return console.error('error running query', err);
            }
          });

         client.query('update tb_tarefas set fg_ativo = 0 from tb_projetos where tb_projetos.id_projeto = tb_tarefas.id_projeto and tb_projetos.id_usuario = $1 and tb_projetos.id_projeto = $2',[id_usuario, id_projeto], function(err,result){
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

    });

});


// Cancela uma Tarefa de um Usuario dentro de um Projeto, incluindo todas suas subtarefas  
app.post('/CancelarTarefa_Usuario', urlencodedParser, function(req, res) {

	var id_usuario = req.body.id_usuario;
	var id_projeto = req.body.id_projeto;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('update tb_tarefas set fg_ativo = 0 from tb_projetos where tb_projetos.id_projeto = tb_tarefas.id_projeto and tb_projetos.id_usuario = $1 and tb_projetos.id_projeto = $2',[id_usuario, id_projeto], function(err,result){
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

    });

});

// Cancela uma Subtarefa de um Usuario dentro de uma Tarefa 
app.post('/CancelarSubtarefa_Usuario', urlencodedParser, function(req, res) {

	var id_usuario = req.body.id_usuario;
	var id_projeto = req.body.id_projeto;


    pool.connect(function(err, client, done) {

        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         client.query('update tb_subtarefas set fg_ativo = 0 from tb_tarefas where tb_subtarefas.id_tarefa = tb_tarefas.id_tarefa and tb_tarefas.id_usuario = $1 and tb_tarefas.id_projeto = $2',[id_usuario, id_projeto], function(err,result){
            done();
            if(err){
                return console.error('error running query', err);
            }
          });

    });

});




