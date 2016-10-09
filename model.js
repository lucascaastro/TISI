// cria objeto express - servidor Web (HTTP)
var express = require('express');

// cria objeto bodyParser - dados do usuário do formulário
var bodyParser = require('body-parser');

// cria aplicação express
var app = express();
app.listen(3000)

// cria objeto capaz de manipular documento JSON
var jsonParser = bodyParser.json();

// cria um parser application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended:true})

var pg = require('pg');


var config = {
  user: 'postgres', //env var: PGUSER 
  database: 'TISI', //env var: PGDATABASE 
  password: '123456', //env var: PGPASSWORD 
  port: 5432, //env var: PGPORT 
  max: 10, // max number of clients in the pool 
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};

// Configure the pool
var pool = new pg.Pool(config);


// CRUD Projetos
// Create 
app.post('/createProjeto', urlencodedParser, function (req, res) {
	
	  var data = { id_projeto: req.body.id_projeto, id_usuario: req.body.id_usuario, nome: req.body.nome, 
		      objetivos: req.body.objetivos, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega, 
		      data_termino: req.body.data_termino }

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_projetos(id_projeto, id_usuario, nome, descricao, data_inicio, data_entrega, data_termino) values($1,$2,$3,$4,$5,$6,$7)", 
			[data.id_projeto, data.id_usuario, data.nome, data.descricao, data.data_inicio, data.data_entrega, data.data_termino])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

  });
});

// Retrieve
app.get('/retrieveProjeto', function(req, res) {

	var saida = "<table border=\"1\">";

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

	   for( i=0; i < result.rows.length; i++){
		saida = saida + "<tr><td>" + result.rows[i].id_projeto + "</td><td>"+ result.rows[i].id_usuario + "</td><td>" + result.rows[i].descricao + "</td><td" + result.rows[i].data_inicio + "</td><td> " + result.rows[i].data_entrega + "</td><td>" + result.rows[i].data_termino + "</td></tr>";
	   }

	   saida = saida + "</table>";
	   res.send(saida);

        });

    });

});

// Update
app.put('/updateProjeto', urlencodedParser, function(req, res) {


    var id = req.body.id_projeto;

    var data = { nome: req.body.nome, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega:req.body.data_entrega, data_termino: req.body.data_termino};

    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

	client.query('update tb_projetos set nome = \'' + data.nome + '\', descricao = \'' + data.descricao + '\', data_inicio = \'' + data.data_inicio + '\', data_entrega = \'' + data.data_entrega + '\', data_termino = \'' + data.data_termino +'\' where id_projeto = ' + id,  function(err, result){

	  done();

	  if(err){
		return console.error('error running query', err);
	  } 

	  res.send("Projeto Atualizado com Sucesso");
	});
      });
});


// Delete
app.post('/deleteProjeto', urlencodedParser, function(req, res) {


    // Grab data from the URL parameters
    var id = req.body.id_projeto;

    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {

        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query('DELETE FROM tb_projetos WHERE id_projeto = ' + id, function(err, result) {

	  done();

	  if( err ){
		return console.error('error running query', err);
	  }

	  res.send("Projeto removido com sucesso");

	});

     });
});


// CRUD Tarefas
// Create 
app.post('/createTarefa', urlencodedParser, function (req, res) {
	
	  var data = { id_tarefa: req.body.id_tarefa, id_projeto: req.body.id_projeto, id_usuario: req.body.id_usuario, nome: req.body.nome, 
		      descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega, 
		      data_termino: req.body.data_termino }

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_tarefas(id_tarefa, id_projeto, id_usuario, nome, descricao, data_inicio, data_entrega, data_termino) values($1,$2,$3,$4,$5,$6,$7,$8)", 
			[data.id_tarefa, data.id_projeto, data.id_usuario, data.nome, data.descricao, data.data_inicio, data.data_entrega, data.data_termino])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

  });
});

// Retrieve
app.get('/retrieveTarefa', function(req, res) {

	var saida = "<table border=\"1\">";

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

	   for( i=0; i < result.rows.length; i++){
		saida = saida + "<tr><td>" + result.rows[i].id_tarefa + "</td><td>"+ result.rows[i].id_projeto + "</td><td>" + result.rows[i].id_usuario + "</td><td" + result.rows[i].descricao + "</td><td> " + result.rows[i].data_inicio + "</td><td>" + result.rows[i].data_entrega + "</td><td>" + result.rows[i].data_termino + "</td></tr>";
	   }

	   saida = saida + "</table>";
	   res.send(saida);

        });

    });

});

// Update
app.put('/updateTarefa', urlencodedParser, function(req, res) {


    var id = req.body.id_tarefa;

    var data = { nome: req.body.descricao, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega:req.body.data_entrega, data_termino: req.body.data_termino};

    pool.connect(function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

	client.query('update tb_tarefas set nome = \'' + data.nome + '\', descricao = \'' + data.descricao + '\', data_inicio = \'' + data.data_inicio + '\', data_entrega = \'' + data.data_entrega + '\', data_termino = \'' + data.data_termino +'\' where id_tarefa = ' + id,  
	  function(err, result){

	  done();

	  if(err){
		return console.error('error running query', err);
	  } 

	  res.send("Tarefa atualizada");
	});
      });
});


// Delete
app.post('/deleteTarefa', urlencodedParser, function(req, res) {

    var id = req.body.id_tarefa;

    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {

        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query('DELETE FROM tb_tarefas WHERE id_tarefa = ' + id, function(err, result) {

	  done();

	  if( err ){
		return console.error('error running query', err);
	  }

	  res.send("Tarefa removida com sucesso");

	});

     });
});

//CRUD Subtarefas
// Create 
app.post('/createSubTarefa', urlencodedParser, function (req, res) {
	
	  var data = { id_subtarefa: req.body.id_subtarefa, id_tarefa: req.body.id_tarefa, nome: req.body.nome, 
		      descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega, 
		      data_termino: req.body.data_termino }

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_subtarefas(id_subtarefa, id_tarefa, nome, descricao, data_inicio, data_entrega, data_termino) values($1,$2,$3,$4,$5,$6,$7)", 
			[data.id_subtarefa, data.id_tarefa, data.nome, data.descricao, data.data_inicio, data.data_entrega, data.data_termino])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

  });
});

// Retrieve
app.get('/retrieveSubTarefa', function(req, res) {

	var saida = "<table border=\"1\">";

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

	   for( i=0; i < result.rows.length; i++){
		saida = saida + "<tr><td>" + result.rows[i].id_tarefa + "</td><td>"+ result.rows[i].id_projeto + "</td><td>" + result.rows[i].id_usuario + "</td><td" + result.rows[i].descricao + "</td><td> " + result.rows[i].data_inicio + "</td><td>" + result.rows[i].data_entrega + "</td><td>" + result.rows[i].data_termino + "</td></tr>";
	   }

	   saida = saida + "</table>";
	   res.send(saida);

        });

    });

});

// Update
app.put('/updateSubTarefa', urlencodedParser, function(req, res) {


    var id = req.body.id_subtarefa;

    var data = { nome: req.body.nome, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega:req.body.data_entrega, data_termino: req.body.data_termino};


    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

	client.query('update tb_subtarefas set nome = \'' + data.nome + '\', descricao = \'' + data.descricao + '\', data_inicio = \'' + data.data_inicio + '\', data_entrega = \'' + data.data_entrega + '\', data_termino = \'' + data.data_termino +'\' where id_subtarefa = ' + id,  
	  function(err, result){

	  done();

	  if(err){
		return console.error('error running query', err);
	  } 

	  res.send("Subtarefa atualizado");
	});
      });
});

// Delete
app.post('/deleteSubTarefa', urlencodedParser, function(req, res) {

    var id = req.body.id_subtarefa;

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

	  res.send("Subtarefa removida com sucesso");

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

	var saida = "<table border=\"1\">";

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

	   for( i=0; i < result.rows.length; i++){
		saida = saida + "<tr><td>" + result.rows[i].id_usuario + "</td><td>"+ result.rows[i].nome + "</td><td>" + result.rows[i].sobrenome + "</td><td" + result.rows[i].username + "</td><td> " + result.rows[i].senha + "</td></tr>";
	   }

	   saida = saida + "</table>";
	   res.send(saida);

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

	  res.send("Usuario atualizado");
	});
      });
});

// Delete
app.post('/deleteUsuario', urlencodedParser, function(req, res) {

    var id = req.body.id_usuario;


    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done) {

        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query('DELETE FROM tb_usuarios WHERE id_usuario = ' + id, function(err, result) {

	  done();

	  if( err ){
		return console.error('error running query', err);
	  }

	  res.send("Subtarefa removida com sucesso");

	});

     });
});

