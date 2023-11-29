const qr = require('qr-image');
const fs = require('fs');

// Function to generate and save a QR code
function generateAndSaveQRCode(link, filePath) {
    console.log(link,filePath)
    const qrCode = qr.image(link, { type: 'png' });
    const stream = fs.createWriteStream(filePath);

    qrCode.pipe(stream);

    stream.on('end', function () {
        console.log('QR code generated and saved successfully.');
    });

    stream.on('error', function (error) {
        console.error('Error generating and saving QR code:', error);
    });
}

// Example of usage


module.exports = generateAndSaveQRCode;