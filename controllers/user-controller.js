const User = require('../models/user-model').User
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { link } = require('fs');
const Contact = require('../models/user-model').Contact;
const { createBot } = require("whatsapp-cloud-api");
const path = require('path');
const { response } = require('express');
const nodemailer = require('nodemailer');


async function createUser(req,res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const data = [firstName, lastName, email, hashedPassword]
        
      console.log(data)
        const user = User.createUser(data);
        if (user.error) {
            console.error("Query Error:", user.msg);
            res.status(500).send("Server Error");
          } else {
            console.log("Registration Successful!");
            res.sendStatus(200);
          }
    } catch (error) {
        console.error("Encryptaion Error:", error);
        res.status(500).send("Server Error");
    }
}


async function LocationPage(req, res) {
  try {
    const filePath = path.join(__dirname, '..', 'view', 'maps.html');
    res.sendFile(filePath);
  } catch (error) {
    // Manejar el error
  }
}

async function sendLocationByEmail(email, latitude, longitude) {
  try {

    let transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false, // No se establece una conexión segura
      auth: {
        user: 'guardmeteam123@hotmail.com', // Tu dirección de correo electrónico de Outlook
        pass: 'guardme123',
      },
      tls: {
        rejectUnauthorized: false // Deshabilitar la verificación del certificado SSL
      }
    });
    
    
    let mailOptions = {
      from: 'guardmeteam123@hotmail.com',
      to: email,
      subject: 'GuardMe:  Patient Location',
      text: `Greetings,\n\nSomeone has scanned your patient's QR code. Enter the following link to view the location on Google Maps:\n\nHere's the link: https://www.google.com/maps?q=${longitude},${latitude}\n\nBest wishes,\nGuardMe Team`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Correo electrónico enviado:', info.response);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    return false;
  } 
}


async function sendInfo(req, res) {
  try {
    const id = req.body.id;
    const longitude = req.body.latitud;
    const latitude = req.body.longitud;
    const contact = await Contact.getContactByPatientID(id);
    const email = contact[0].email;

    const success = await sendLocationByEmail(email, latitude, longitude);

    res.status(200).json({ success: success, message: 'Ubicación enviada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}



const redirectToDownload = (req, res) => {
  try {
      // Aquí puedes acceder a los parámetros de la consulta (query parameters)
      const { name, id } = req.query;
      const filePath = path.join(__dirname, '..', 'main', 'qrDownload.html');
      res.sendFile(filePath);

  } catch (error) {
      console.error('Error en el controlador de redirección:', error);
      res.status(500).send('Error en el servidor');
  }
};



module.exports = {
    createUser,
    sendInfo,
    LocationPage,
    redirectToDownload
  }