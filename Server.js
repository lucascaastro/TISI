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
<<<<<<< HEAD
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://root:92528109@localhost:5432/TISI')
//var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

//banco de dados 
var User = sequelize.define('tb_usuarios', {
	nome:{
		type: Sequelize.STRING	
	},
	sobrenome: Sequelize.STRING
});
User.sync({force:true})
	.then(function(){
		nome:'Lucas',
		sobrenome:'Castro'
	});
});
=======

var pg = require('pg');
>>>>>>> cc2045f82c1d6cd69d76dbdda653789ae4ded4fe

app.listen(3000)

<<<<<<< HEAD
// rota via GET 
app.get('/', function (req, res) {                                  
   res.send('<html><body> id: '+ req.param('id') + '<br/> Nome Projeto: ' + req.param('nomeprojeto') +  '<br/>' + 
	   'Usuario: ' +  req.param('usuario') + '<br/>' + 'Data Inicio: ' + req.param('data_entregainicio') + '<br/> ' + 
	   'Data Entrega: ' + req.param('data_entrega') + '<br/>' + 'Data Termino: ' + req.param('data_termino') + '</body></html>')
 }) 
=======
var config = {
  user: 'postgres', //env var: PGUSER 
  database: 'TISI', //env var: PGDATABASE 
  password: '123456', //env var: PGPASSWORD 
  port: 5432, //env var: PGPORT 
  max: 10, // max number of clients in the pool 
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};
>>>>>>> cc2045f82c1d6cd69d76dbdda653789ae4ded4fe

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

// Retrieve
app.get('/retrieve', function(req, res) {

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

app.post('/update', urlencodedParser, function(req, res) {


    var id = req.body.id_projeto;

    var data = { nome: req.body.nomeprojeto, descricao: req.body.descricao, data_inicio: req.body.data_inicio, data_entrega:req.body.data_entrega, data_termino: req.body.data_termino};

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

	  res.send("Projeto atualizado");
	});
      });
});


app.post('/delete', urlencodedParser, function(req, res) {


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

<<<<<<< HEAD

app.listen(3000)
=======
>>>>>>> cc2045f82c1d6cd69d76dbdda653789ae4ded4fe
