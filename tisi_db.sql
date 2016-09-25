
create database 'TISI'
template=template0
connection limit = -1;


create table tb_usuarios(
id_usuario serial,
nome varchar(20)  
	constraint nn_usuarios_nome not null,
sobrenome varchar(20)
	constraint nn_usuarios_sobrenome not null,
email varchar(20),
username varchar(20)
	constraint nn_usuarios_username not null,
senha varchar(20)
	constraint nn_usuarios_senha not null,
fg_ativo integer,

constraint pk_usuarios_id_usuario primary key(id_usuario)

)

create table tb_projetos(
id_projeto serial,
id_usuario serial,
nome varchar(20)
	constraint nn_projetos_nome not null,
descricao varchar(100),
data_inicio date,
data_entrega date,
data_termino date,
fg_ativo integer,

constraint pk_projetos_id_projeto primary key( id_projeto ),
constraint fk_projetos_id_usuario foreign key(id_usuario)
		references tb_usuarios(id_usuario )
)

create table tb_tarefas(
id_tarefa serial,
id_projeto serial,
id_usario serial,
descricao varchar(100),
data_inicio date,
data_entrega date,
data_termino date,
fg_ativo integer,

constraint pk_tarefas_id_tarefa primary key(id_tarefa),

constraint fk_tarefas_id_projeto foreign key(id_projeto)
		references tb_projetos(id_projeto ),
		
constraint fk_tarefas_id_usuario foreign key(id_usario)
		references tb_usuarios(id_usuario )
)

create table tb_subtarefas(
id_subtarefa serial,
id_tarefa serial,
descricao varchar(100),
data_inicio date,
data_entrega date,
data_termino date,
fg_ativo integer,

constraint pk_subtarefas_id_subtarefa primary key(id_subtarefa),

constraint fk_subtarefas_id_tarefa foreign key(id_tarefa)
		references tb_tarefas(id_tarefa )
)


