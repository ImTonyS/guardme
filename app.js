const express = require('express');
const app = express();
const PORT = 3000;
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.sendStatus(401); // Unauthorized
    }
};


//static files
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/main'))


// routes
app.get('/contacts', isAuthenticated, (req, res) => {res.sendFile(__dirname + '/contacts/contacts.html');});
app.get('/home', isAuthenticated, (req, res) => {res.sendFile(__dirname + '/home/home.html');});
app.get('/', (req,res) => {res.sendFile(__dirname + '/main/main.html')});
app.get('/register', isAuthenticated, (req, res) => {res.sendFile(__dirname + '/register/register.html');});


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


//User Registration 
app.use(express.json());

app.post('/registerUser', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Database data inseriton
    const query = 'INSERT INTO users (first_name, last_name, email, password, created_at, active) VALUES (?, ?, ?, ?, CURDATE(), 1)';
    connection.query(query, [firstName, lastName, email, hashedPassword], (error, results) => {
        if (error) {
            console.error('Query Error:', error);
            res.status(500).send('Server Error');
        } else {
            console.log('Registration Successful!');
            res.sendStatus(200);
        }
    });
} catch (error) {
    console.error('Encryptaion Error:', error);
    res.status(500).send('Server Error');
}
});
  

//User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Obtains hash from database to authenticate password
        const query = 'SELECT id_user, password FROM users WHERE email = ?';
        connection.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Query Error:', error);
                res.status(500).send('Server Error');
            } else {
                if (results.length > 0) {
                    const hashedPassword = results[0].password;

                    // Compares user's password with the one stored
                    const match = await bcrypt.compare(password, hashedPassword);

                    if (match) {
                        console.log('Successful Login!');
                        res.sendStatus(200);
                    } else {
                        console.error('Stored Password:', hashedPassword);
                        console.error('Entered Password:', password);
                        // codes to identify login errors
                        // console.error('Incorrect Password');
                        // res.status(401).send('Incorrect Password');
                    }
                } else {
                    console.error('User not');
                    res.status(401).send('Incorrect Credentials');
                }
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send('Server Error');
    }
});



//server
app.listen(PORT,() => {
    console.log('server running on port', PORT)
})