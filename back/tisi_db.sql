
create database 'TISI'
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


insert into tb_usuarios( nome, sobrenome, username, senha, fg_ativo)
values
('AAA', 'AAA', 'aaa@gmail.com','12345', 1),
('BBB', 'BBB', 'bbbgmail.com','12345', 1);


insert into tb_projetos( id_usuario, nome, descricao, data_inicio, data_entrega, fg_ativo)
values
(1, 'Projeto A', 'Descrição Projeto A', '1/1/2016', '2/1/2016', 1),
(2, 'Projeto B', 'Descrição Projeto B', '1/1/2016', '2/1/2016', 1);


insert into tb_tarefas( id_projeto, id_usuario, nome, prioridade, descricao, data_inicio, data_entrega, fg_ativo )
values
(1, 1, 'Tarefa A', 3, 'Minha Tarefa A', '1/1/2016', '2/2/2016', 1),
(1, 1, 'Tarefa B', 3, 'Minha Tarefa B', '1/1/2016', '2/2/2016', 1),
(1, 1, 'Tarefa C', 3, 'Minha Tarefa C', '1/1/2016', '2/2/2016', 1),
(2, 2, 'Tarefa D', 3, 'Minha Tarefa D', '1/1/2016', '2/2/2016', 1),
(2, 2, 'Tarefa E', 3, 'Minha Tarefa E', '1/1/2016', '2/2/2016', 1),
(2, 2, 'Tarefa F', 3, 'Minha Tarefa F', '1/1/2016', '2/2/2016', 1);

insert into tb_subtarefas( id_tarefa, id_usuario, nome, prioridade, descricao, data_inicio, data_entrega, fg_ativo)
values
(1, 1, 'Subtarefa A', 1, 'Minha Subtarefa A', '1/1/2016', '2/1/2016', 1),
(2, 1, 'Subtarefa B', 2, 'Minha Subtarefa B', '1/1/2016', '2/1/2016', 1),
(3, 1, 'Subtarefa C', 3, 'Minha Subtarefa C', '1/1/2016', '2/1/2016', 1),
(4, 2, 'Subtarefa D', 1, 'Minha Subtarefa D', '1/1/2016', '2/1/2016', 1),
(5, 2, 'Subtarefa E', 2, 'Minha Subtarefa E', '1/1/2016', '2/1/2016', 1),
(6, 2, 'Subtarefa F', 3, 'Minha Subtarefa F', '1/1/2016', '2/1/2016', 1);
