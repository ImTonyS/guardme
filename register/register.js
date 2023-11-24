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

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(this);

    try {
        const response = await fetch('/registerPatient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });

        if (response.ok) {
            // If registration successful, redirect to home or any other page
            window.location.href = '../home/home.html';
        } else {
            console.error('Registration Error');
        }
    } catch (error) {
        console.error('Request Error:', error);
    }
});