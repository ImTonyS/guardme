const menu = document.querySelector('.nav_menu');
const menuList = document.querySelector('.nav_list');
const links = document.querySelectorAll('.nav_link');
const wrapper = document.querySelector('.wrapper'),
    wrapperClose = document.querySelector('.wrapper_close')
    signupHeader = document.querySelector('.signup header'),
    loginHeader = document.querySelector('.login header'),
    signupBtn = document.querySelector('#signupbtn');

    
const hero = document.querySelector('.hero'),
    herocta = document.querySelector('#hero_cta');

// BOTON .hero_cta LLAMA POP SIGN UP
herocta.addEventListener('click', () => {
    wrapper.classList.add("index");
})
// BOTON .wrapper_close LO DESAPARECE
wrapperClose.addEventListener('click', () => {
    wrapper.classList.remove("index");
})

signupBtn.addEventListener('click', () => {
    wrapper.classList.add("index");
    menuList.classList.remove("nav_list--show");
})

// ANIMACION DEL LOGIN Y SIGNUP
loginHeader.addEventListener('click', () => {
    wrapper.classList.add("active");
})
signupHeader.addEventListener('click', () => {
    wrapper.classList.remove("active");
})

// CLICK EN MENU SANDW LLAMA LA LISTA DE OPCIONES
menu.addEventListener('click', function(){

    menuList.classList.toggle('nav_list--show');

})

links.forEach(function(link){

    link.addEventListener('click', function(){

        menuList.classList.remove('nav_list--show');

    });
}); 

///////////////////////////// User registration functionality



const signUpForm = document.querySelector('form');

// "submit" event listener
signUpForm.addEventListener('submit', async function (event) {
    event.preventDefault(); //stops the "submit" from refreshing the page

    const formData = new FormData(signUpForm);

    try {
        const response = await fetch('/registerUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });

        if (response.ok) {
            // if registration successful, redirect to home
            window.location.href = '../home/home.html';
        } else {
            console.error('Registration Error');
        }
    } catch (error) {
        console.error('Request Error:', error);
    }
});


///////////////////////////// User login functionality

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // if registration successful, redirect to home
            window.location.href = '../home/home.html';
        } else {
            console.error('Login Error');
        }
    } catch (error) {
        console.error('Request Error:', error);
    }
});
