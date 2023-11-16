const menu = document.querySelector('.nav_menu');
const menuList = document.querySelector('.nav_list');
const links = document.querySelectorAll('.nav_link');
const wrapper = document.querySelector('.wrapper'),
    signupHeader = document.querySelector('.signup header'),
    loginHeader = document.querySelector('.login header');

loginHeader.addEventListener('click', () => {
    wrapper.classList.add("active");
})
signupHeader.addEventListener('click', () => {
    wrapper.classList.remove("active");
})




menu.addEventListener('click', function(){

    menuList.classList.toggle('nav_list--show');

})

links.forEach(function(link){

    link.addEventListener('click', function(){

        menuList.classList.remove('nav_list--show');

    });
}); 



