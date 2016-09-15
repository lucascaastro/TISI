// cria objeto express - servidor Web (HTTP)
var express = require('express')

// cria objeto bodyParser - dados do usuário do formulário
var bodyParser = require('body-parser')

// cria aplicação express
var app = express()

// cria objeto capaz de manipular documento JSON
var jsonParser = bodyParser.json()

// cria um parser application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended:true})


// rota via POST
app.post('/infopost', urlencodedParser, function(req, res){
	if (!req.body){
		return res.sendStatus(400)
	}
	res.send('id: ' + req.body.id +  " Nome do Projeto: " +  req.body.nomeprojeto + ' Usuario: ' + 
	req.body.usuario + ' Data Inicio: ' + req.body.data_inicio + ' Data Entrega: ' + req.body.data_entrega + 
	' Data Termino: ' + req.body.data_termino)
})

// rota via GET 
app.get('/', function (req, res) {                                  
   res.send('<html><body> id: '+ req.param('id') + '<br/> Nome Projeto: ' + req.param('nomeprojeto') +  '<br/>' + 
	   'Usuario: ' +  req.param('usuario') + '<br/>' + 'Data Inicio: ' + req.param('data_inicio') + '<br/> ' + 
	   'Data Entrega: ' + req.param('data_entrega') + '<br/>' + 'Data Termino: ' + req.param('data_termino') + '</body></html>')
 }) 


app.listen(3000)