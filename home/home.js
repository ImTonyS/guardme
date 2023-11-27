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


//
async function getSessionInfo() {
    try {
        const response = await fetch('/session');
        if (response.ok) {
            const sessionInfo = await response.json();
            return sessionInfo;
        } else {
            console.error('Error fetching session information');
            return null;
        }
    } catch (error) {
        console.error('Request error:', error);
        return null;
    }
}

async function showSessionInfo() {
    try {
        const sessionInfo = await getSessionInfo();

        // Imprimir información de sesión en la consola
        console.log("Sesión autenticada:", sessionInfo.isAuthenticated);
        console.log("ID de usuario:", sessionInfo.userId);

        // Puedes usar sessionInfo.userId como variable más adelante en tu código
    } catch (error) {
        console.error('Error al obtener información de sesión:', error);
    }
}

// Llamar a la función para mostrar la información de la sesión
showSessionInfo();