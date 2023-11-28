const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MySQLStore = require("express-mysql-session")(session);
const bcrypt = require("bcrypt");
const { createBot } = require("whatsapp-cloud-api");
require("dotenv").config();


// // Middleware to check if the user is authenticated

// const isAuthenticated = (req, res, next) => {
//   if (req.session && req.session.userId) {
//     return next();
//   } else {
//     return res.sendStatus(401); // Unauthorized
//   }
// };

//static files
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/main"));

// routes
app.get("/contacts", (req, res) => {
  res.sendFile(__dirname + "/contacts/contacts.html");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/home/home.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main/main.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register/register.html");
});


// app.use(express.static(__dirname));
// app.use(express.static(__dirname + "/main"));

// // routes
// app.get("/contacts", isAuthenticated, (req, res) => {
//   res.sendFile(__dirname + "/contacts/contacts.html");
// });

// app.get("/home", isAuthenticated, (req, res) => {
//   res.sendFile(__dirname + "/home/home.html");
// });

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/main/main.html");
// });

// app.get("/register", isAuthenticated, (req, res) => {
//   res.sendFile(__dirname + "/register/register.html");
// });

// app.get("/session", (req, res) => {
//   if (req.session && req.session.userId) {
//     // The user is authenticated
//     res.json({ isAuthenticated: true });
//   } else {
//     // The user is not authenticated
//     res.json({ isAuthenticated: false });
//   }
// });


app.get("/emergencylink", async (req, res) => {
  console.log("whatsapptest");
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const FROM = process.env.WHATSAPP_FROM;

  console.log("token =>", TOKEN);
  console.log("from =>", FROM);

  const phoneNumber = "+526146169533";
  const message = "Se ha escaneado el codigo de su paciente, por favor, revise la ubicacion";

  //wadata es el objeto que se envia a la api de whatsapp
  const waData = {
    to: phoneNumber,
    template: "notificacionesdgv",
    locale: "es_MX",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: message,
          },
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
  port: "3308",
  user: "root",
  password: "rarm",
  database: "guardme",
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed", err);
    return;
  }
  console.log("Database connection succesful");

  // Initialize session store after successful database connection
  const sessionStore = new MySQLStore({}, connection);

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    session({
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    }));
  });



//Setup Passport por sessions


passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: true },
    async (email, password, done) => {
      try {
        const query = "SELECT id_user, password FROM users WHERE email = ?";
        connection.query(query, [email], async (error, results) => {
          if (error) {
            return done(error);
          } else {
            if (results.length > 0) {
              const hashedPassword = results[0].password;
              const match = await bcrypt.compare(password, hashedPassword);

              if (match) {
                return done(null, { id: results[0].id_user });
              } else {
                return done(null, false, { message: "Incorrect password" });
              }
            } else {
              return done(null, false, { message: "User not found" });
            }
          }
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const query = "SELECT id_user, email FROM users WHERE id_user = ?";
  connection.query(query, [id], (error, results) => {
    if (error) {
      return done(error);
    }
    const user = results[0];
    done(null, user);
  });
});




//User Registration
app.post("/registerUser", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

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
          // Registration successful, redirect to home
          res.redirect("/home");
        }
      }
    );
  } catch (error) {
    console.error("Encryption Error:", error);
    res.status(500).send("Server Error");
  }
});


//User Login
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  })
);


// Patient, contact registration

// Handle user registration
app.post('/ContPatRegister', async (req, res) => {
  const { patient, contact } = req.body;

  try {
      // Code to insert patient information into the database
      const patientQuery =
          'INSERT INTO patients (first_name, last_name, gender, birth_date, created_at, active) VALUES (?, ?, ?, ?, NOW(), 1)';
      connection.query(
          patientQuery,
          [patient.firstName, patient.lastName, patient.gender, patient.birthDate],
          (error, patientResults) => {
              if (error) {
                  console.error('Patient Registration Error:', error);
                  res.status(500).send('Server Error');
              } else {
                  // Code to insert contact information into the database
                  const contactQuery =
                      'INSERT INTO contacts (first_name, last_name, phone_num, email, created_at, active) VALUES (?, ?, ?, ?, NOW(), 1)';
                  connection.query(
                      contactQuery,
                      [contact.firstName, contact.lastName, contact.phoneNum, contact.email],
                      (error, contactResults) => {
                          if (error) {
                              console.error('Contact Registration Error:', error);
                              res.status(500).send('Server Error');
                          } else {
                              console.log('User Registration Successful!');
                              res.sendStatus(200);
                          }
                      }
                  );
              }
          }
      );
  } catch (error) {
      console.error('User Registration Error:', error);
      res.status(500).send('Server Error');
  }
});



//server
app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
