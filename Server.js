// cria objeto express - servidor Web (HTTP)
var express = require('express');

// cria objeto bodyParser - dados do usuário do formulário
var bodyParser = require('body-parser');

// cria aplicação express
var app = express();

// cria objeto capaz de manipular documento JSON
var jsonParser = bodyParser.json();

// cria um parser application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended:true})

var pg = require('pg');

app.listen(3000)

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

// CRUD
// Create 
app.post('/create', urlencodedParser, function (req, res) {
	
	  var data = { id_projeto: req.body.id_projeto, id_usuario: req.body.id_usuario, nome: req.body.nomeprojeto, 
		      objetivos: req.body.objetivos, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega: req.body.data_entrega, 
		      data_termino: req.body.data_termino }

	  pool.connect(function(err, client, done) {

	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }

	  client.query( "INSERT INTO tb_projetos(id_projeto, id_usuario, nome, objetivos, descricao, data_inicio, data_entrega, data_termino) values($1,$2,$3,$4,$5,$6,$7,$8)", 
			[data.id_projeto, data.id_usuario, data.nome, data.objetivos, data.descricao, data.data_inicio, data.data_entrega, data.data_termino])

	  done();

	  if(err) {
	    return console.error('error running query', err);
	  }

  });
});

