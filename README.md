#                   Organize


## Description 
#### This is Organize, a simple web-based application with the sole purpose helping handle your personal Project and Tasks.
#### Like any other undergraduated Project we had the help of few teachers, the web app was coded using a bunch of technologies, more especifically HTML, CSS, Angular, Nodejs, Express and PostgresSQL ~~we should have used MongoDB, but one teacher that we cant name here is jealous about NoSQL Databases~~.



## How to install locally
Make sure you have Nodejs and the PostgreSQL installed in you machine then follow the steps below.

1 - Clone this repo:

 $ git clone https://github.com/g-mello/Organize
 
2 - Go to the Organize folde
 
 $ cd Organize
 
3 - Install all dependencies
 
 $ npm install
 
4 - Install the relational database
 
 $ sudo -u postgres -f tisi_db.sql 
 
5 - Edit the following lines in model.js file

 
var config = {

user: 'postgres', 

  database: 'Organize', 
  
  password: 'your-password-here',
  
  port: 5432,
  
  max: 10, 
  
  idleTimeoutMillis: 30000,  
  
};

6 - Start the backend

$ nodemon back/model.js

7 - Use the Application, using you browser with the following url

http://localhost:3000/home.html

8 - That's all, have fun. Feel free to modify any LoC of this shit. 



