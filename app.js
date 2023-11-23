const express = require('express');
const app = express();
const PORT = 3000;
const mysql = require('mysql');
const bodyParser = require('body-parser');


//static files
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/main'))


// routes
app.get('/contacts', (req,res) => {
    res.sendFile(__dirname + '/contacts/contacts.html')
});

app.get('/home', (req,res) => {
    res.sendFile(__dirname + '/home/home.html')
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/main/main.html')
});

app.get('/register', (req,res) => {
    res.sendFile(__dirname + '/register/register.html')
});


// // middleware 
// app.use(bodyParser.urlencoded({ extended:true }));

// //prueba de POST request
// app.post('/', (req,res) => {
//     const firstName = req.body.firstName;
//     const lastName = req.body.lastName;
//     const email = req.body.email;
//     const password = req.body.password;
// })



//database connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: 'rarm',
    database: 'guardme',
  })
  
connection.connect((err) => {
    if(err) {
        console.error('Database connection failed', err);
        return;
    }
    console.log('Database connection succesful')
  })

  app.use(express.json());

  app.post('/registerUser', (req, res) => {
      const { firstName, lastName, email, password } = req.body;
  
      // Aquí deberías agregar la lógica para insertar los datos en la base de datos
      const query = 'INSERT INTO users (first_name, last_name, email, password, created_at, active) VALUES (?, ?, ?, ?, NOW(), 1)';
      connection.query(query, [firstName, lastName, email, password], (error, results) => {
          if (error) {
              console.error('Error en la consulta:', error);
              res.status(500).send('Error en el servidor');
          } else {
              console.log('Usuario registrado exitosamente');
              res.sendStatus(200);
          }
      });
  });
  
  

// // Realizar la consulta SELECT *
// const queryString = 'SELECT * FROM users';

// connection.query(queryString, (err, rows) => {
//   if (err) {
//     console.error('Error en la consulta:', err);
//     return;
//   }

//   // Procesar los resultados
//   console.log('Resultados de la consulta:');
//   console.log(rows);

//   // Cerrar la conexión después de realizar la consulta
//   connection.end();
// });

//server config
app.listen(PORT, () =>{
    console.log('server running on port', PORT)
})