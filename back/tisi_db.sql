
create database "Organize"
template=template0
connection limit = -1;

create sequence seq_tb_usuarios_id_usuario
	increment 1
	minvalue 1
	maxvalue 1000
	start 1
	cache 1;

create table tb_usuarios(
id_usuario integer default nextval('seq_tb_usuarios_id_usuario'),

nome varchar(50)
	constraint nn_projetos_nome not null,
sobrenome varchar(50)
	constraint nn_projetos_nome not null,
username varchar(30)
	constraint nn_projetos_nome not null,
senha varchar(30)
	constraint nn_projetos_nome not null,
fg_ativo integer default 1,

constraint pk_tb_usuarios_id_usuario primary key( id_usuario )
);


create sequence seq_tb_projetos_id_projeto
	increment 1
	minvalue 1
	maxvalue 1000
	start 1
	cache 1;	

create table tb_projetos(
id_projeto integer default nextval('seq_tb_projetos_id_projeto'),
id_usuario integer,
nome varchar(160)
	constraint nn_projetos_nome not null,
descricao varchar(500),
data_inicio date,
data_entrega date,
fg_ativo integer default 1,

constraint pk_projetos_id_projeto primary key( id_projeto ),
constraint fk_projetos_id_usuario foreign key(id_usuario)
		references tb_usuarios(id_usuario)
);



create sequence seq_tb_tarefas_id_tarefa
	increment 1
	minvalue 1
	maxvalue 1000
	start 1
	cache 1;

create table tb_tarefas(
id_tarefa integer default nextval('seq_tb_tarefas_id_tarefa'),
id_projeto integer,
id_usuario integer,
nome varchar(160),
prioridade integer default 1,
descricao varchar(500),
data_inicio date,
data_entrega date,
fg_ativo integer default 1,

constraint pk_tarefas_id_tarefa primary key(id_tarefa),

constraint fk_tarefas_id_projeto foreign key(id_projeto)
		references tb_projetos(id_projeto ),
		
constraint fk_tarefas_id_usuario foreign key(id_usuario)
		references tb_usuarios(id_usuario)
);



create sequence seq_tb_subtarefas_id_subtarefa
	increment 1
	minvalue 1
	maxvalue 1000
	start 1
	cache 1;


create table tb_subtarefas(
id_subtarefa integer default nextval('seq_tb_subtarefas_id_subtarefa'),
id_tarefa integer,
id_usuario integer,
nome varchar(160),
prioridade integer default 1,
descricao varchar(500),
data_inicio date,
data_entrega date,
fg_ativo integer default 1,

constraint pk_subtarefas_id_subtarefa primary key(id_subtarefa),

constraint fk_subtarefas_id_tarefa foreign key(id_tarefa)
		references tb_tarefas(id_tarefa ),
		
constraint fk_subtarefas_id_usuario foreign key(id_usuario)
		references tb_usuarios(id_usuario)
);


