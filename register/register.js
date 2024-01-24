const menu = document.querySelector('.nav_menu');
const menuList = document.querySelector('.nav_list');
const links = document.querySelectorAll('.nav_link');

// Click on sandwich menu opens the sidebar menu
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
