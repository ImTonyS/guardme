const menu = document.querySelector('.nav_menu');
const menuList = document.querySelector('.nav_list');
const links = document.querySelectorAll('.nav_link');

// CLICK EN MENU SANDW LLAMA LA LISTA DE OPCIONES
menu.addEventListener('click', function(){

    menuList.classList.toggle('nav_list--show');

})

links.forEach(function(link){

    link.addEventListener('click', function(){

        menuList.classList.remove('nav_list--show');

    });
}); 

///////////////////////////// Patient Registration functionality

const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(registrationForm);

    const userData = {
        patient: {
            firstName: formData.get('PatFirstName'),
            lastName: formData.get('PatLastName'),
            gender: formData.get('gender'),
            birthDate: formData.get('BirthDate'),
            // Add other patient-related fields here
        },
        contact: {
            firstName: formData.get('ConFirstName'),
            lastName: formData.get('ConLastName'),
            phoneNum: formData.get('ConPhoneNumber'),
            email: formData.get('ConEmail'),
            // Add other contact-related fields here
        },
    };

    try {
        const response = await fetch('/ContPatRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const responseData = await response.json();  // Parsea la respuesta como JSON
            console.log('Registration Successful!');
            const baseUrl = window.location.origin;

        // Armar la URL con los parámetros necesarios
            const downloadUrl = `${baseUrl}/download?name=${responseData.name}&id=${responseData.id}`;
            window.location.href = downloadUrl; 
        } else {
            console.error('Registration Error');
        }
    } catch (error) {
        console.error('Request Error:', error);
    }
});


// Obtener el elemento select de los asilos
const nursingHomeSelect = document.getElementById('nursingHome');

// Función para obtener los datos de la API y poblar el select
async function fetchNursingHomes() {
    try {
        console.log('Iniciando solicitud a la API externa...');
        const response = await fetch('/viewasilos');
        if (!response.ok) {
            throw new Error('La solicitud no se completó correctamente');
        }
        console.log('Datos recibidos correctamente de la API externa.');
        const data = await response.json();
        console.log('Datos obtenidos:', data);

        // Accedemos a la primera matriz que contiene los datos de los asilos
        const nursingHomesData = data[0];

        const nursingHomeSelect = document.getElementById('nursingHome');
        nursingHomeSelect.innerHTML = ""; // Limpiar el select antes de agregar las nuevas opciones
        nursingHomesData.forEach(asilo => {
            const option = document.createElement('option');
            option.value = asilo.id_asilo;
            option.textContent = asilo.nombre_asilo;
            nursingHomeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener los datos de la API externa:', error);
    }
}


// Llamar a la función para obtener los datos de la API externa al cargar la página
fetchNursingHomes();


//     try {
//         // Send patient data to the server
//         const patientResponse = await fetch('/registerPatient', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(patientData),
//         });

//         // Send contact data to the server
//         const contactResponse = await fetch('/registerContact', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(contactData),
//         });

//         if (patientResponse.ok && contactResponse.ok) {
//             console.log('Registration Successful!');
//         } else {
//             console.error('Registration Error');
//         }
//     } catch (error) {
//         console.error('Request Error:', error);
//     }
// });
