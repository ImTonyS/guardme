const mysql = require("mysql");
const bcrypt = require("bcrypt");


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
  });

const User = {
    async createUser(data) {
        console.log(data)
        
        // Database data inseriton
        const query =
          "INSERT INTO users (first_name, last_name, email, password, created_at, active) VALUES (?, ?, ?, ?, CURDATE(), 1)";
        connection.query(
          query,
          data,
          (error, results) => {
            if (error) {
                return {error : true, msg: error}
            } else {
              return {error : false, msg: ''}
            }
          }
        );

    } 
}

const Contact = {
  getContactByPatientID: function(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM contacts JOIN patients ON patients.id_patient = contacts.id_contact WHERE id_contact = ?',
        [id],
        (error, contactResults) => {
          if (error) {
            console.error('Contact Error:', error);
            reject('Server Error');
          } else {
            // Extract relevant information
            const contacts = contactResults.map(contact => ({
              id_contact: contact.id_contact,
              first_name: contact.first_name,
              last_name: contact.last_name,
              phone_num: contact.phone_num,
              email: contact.email,
              link: contact.link
            }));

            resolve(contacts);
          }
        }
      );
    });
  }
};



module.exports = {
    User,
    Contact
}