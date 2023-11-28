const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { createBot } = require("whatsapp-cloud-api");
require("dotenv").config();

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
app.use(express.static(__dirname + "/main"));

// routes
app.get("/contacts", isAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/contacts/contacts.html");
});

app.get("/home", isAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/home/home.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main/main.html");
});

app.get("/register", isAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/register/register.html");
});

app.get("/session", (req, res) => {
  if (req.session && req.session.userId) {
    // The user is authenticated
    res.json({ isAuthenticated: true });
  } else {
    // The user is not authenticated
    res.json({ isAuthenticated: false });
  }
});

app.get("/whatsapptest", async (req, res) => {
  console.log("whatsapptest");
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const FROM = process.env.WHATSAPP_FROM;

  console.log("token =>", TOKEN);
  console.log("from =>", FROM);

  const phoneNumber = "+526143673827";
  const message = "Muchas gracias por su apoyo! De parte de el equipo de guardme";
  const link = "https://www.google.com/maps?q=28.617364,-106.044986";
  res.sendFile(__dirname + "/whatsapptest/whatsapptest.html");

  //wadata es el objeto que se envia a la api de whatsapp
  const waData = {
    to: phoneNumber,
    template: "guardme",
    locale: "es_MX",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: message,
          },
          {
            type: "text",
            text: link,
          }
        ],
      },
    ],
  };

  console.log("wadata =>", waData);

  try {
    const bot = createBot(FROM, TOKEN);
    const { to, template, locale, components } = waData;
    const response = await bot.sendTemplate(to, template, locale, components);
    console.log("WA Message Sent =>", response);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
});

//database connection
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "guardme",
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed", err);
    return;
  }
  console.log("Database connection succesful");
});

//User Registration
app.use(express.json());

app.post("/registerUser", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Database data inseriton
    const query =
      "INSERT INTO users (first_name, last_name, email, password, created_at, active) VALUES (?, ?, ?, ?, CURDATE(), 1)";
    connection.query(
      query,
      [firstName, lastName, email, hashedPassword],
      (error, results) => {
        if (error) {
          console.error("Query Error:", error);
          res.status(500).send("Server Error");
        } else {
          console.log("Registration Successful!");
          res.sendStatus(200);
        }
      }
    );
  } catch (error) {
    console.error("Encryptaion Error:", error);
    res.status(500).send("Server Error");
  }
});

//User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Obtains hash from database to authenticate password
    const query = "SELECT id_user, password FROM users WHERE email = ?";
    connection.query(query, [email], async (error, results) => {
      if (error) {
        console.error("Query Error:", error);
        res.status(500).send("Server Error");
      } else {
        if (results.length > 0) {
          const hashedPassword = results[0].password;

          // Compares user's password with the one stored
          const match = await bcrypt.compare(password, hashedPassword);

          if (match) {
            console.log("Successful Login!");
            res.sendStatus(200);
          } else {
            console.error("Stored Password:", hashedPassword);
            console.error("Entered Password:", password);
            // codes to identify login errors
            // console.error('Incorrect Password');
            // res.status(401).send('Incorrect Password');
          }
        } else {
          console.error("User not");
          res.status(401).send("Incorrect Credentials");
        }
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Server Error");
  }
});

//server
app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
