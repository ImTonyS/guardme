const User = require('../models/user-model').User
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { link } = require('fs');
const Contact = require('../models/user-model').Contact;
const { createBot } = require("whatsapp-cloud-api");
const path = require('path');
const { response } = require('express');


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

async function whatsapp(phone, latitude, longitude) {
    const TOKEN = process.env.WHATSAPP_TOKEN;
    const FROM = process.env.WHATSAPP_FROM;

    console.log("token =>", TOKEN);
    console.log("from =>", FROM);

    enlace = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const message = "Your Patient's QR Code Has been scanned this is the known location:" + enlace;

    //wadata es el objeto que se envia a la api de whatsapp
    const waData = {
      to: `+52${phone}`,
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
      return true
    } catch (error) {
      console.log(error)
      return false
  }
};



async function sendInfo(req, res) {
  try {
    const id = req.body.id;
    const longitude = req.body.latitud 
    const latitude = req.body.longitud
    const contact = await Contact.getContactByPatientID(id);
    const phone = contact[0].phone_num;


   const success = await whatsapp(phone, longitude, latitude);
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