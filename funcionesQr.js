var latitud;
var longitud;

// Función para obtener la ubicación y mostrar el código QR
function obtenerYMostrarUbicacion() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;

            console.log("Latitud:", latitud);
            console.log("Longitud:", longitud);

            // Llama a la función para generar el código QR y el enlace de Google Maps
            generarCodigoYEnlace();
        }, function (error) {
            mostrarErrorGeolocalizacion(error);
        });
    } else {
        mostrarError("Geolocalization is not available on this browser.");
    }
}

// Función para generar un código QR dinámico
function generarCodigoQR(contenido) {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: contenido,
        width: 500,
        height: 500
    });
}

// Función para generar un enlace de Google Maps
function generarEnlaceGoogleMaps(latitud, longitud) {
    const enlace = `https://www.google.com/maps?q=${latitud},${longitud}`;
    console.log("Enlace de Google Maps:", enlace);
    return enlace;
}

// Función para enviar el enlace por correo electrónico
function enviarCorreoElectronico(enlace) {
    const serviceID = 'default_service';
    const templateID = 'template_x3vj23l';
    const emailData = {enlace:enlace};

    emailjs.send(serviceID, templateID, emailData)
        .then(function(response) {
            console.log('Correo electrónico enviado con éxito:', response);
        }, function(error) {
            console.error('Error al enviar el correo electrónico:', error);
        });
}

// Función para generar el código QR y el enlace de Google Maps
function generarCodigoYEnlace() {
    const enlaceGoogleMaps = generarEnlaceGoogleMaps(latitud, longitud);
    generarCodigoQR(enlaceGoogleMaps);

    // Envía el enlace por correo electrónico
    enviarCorreoElectronico(enlaceGoogleMaps);
}

// Asigna evento al botón utilizando el modelo de eventos
document.getElementById("generateBtn").addEventListener("click", function(event) {
    event.preventDefault();

    // Tu código de obtención de ubicación y generación de enlace aquí
    obtenerYMostrarUbicacion();
});
