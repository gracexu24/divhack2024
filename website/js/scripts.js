/*!
* Start Bootstrap - Agency v7.0.11 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

//server??
fetch('https://9c74-128-59-178-198.ngrok-free.app/api/users')
  .then(response => response.json())
  .then(data => {
    console.log(data);  // Log the entire object to inspect its structure
    if (Array.isArray(data.users)) {  // Access the 'users' property from the data object
      data.users.forEach(user => {  // Now you can loop through the array
        console.log(user);  // Log each user object
        const listItem = document.createElement('li');
        listItem.textContent = user.name;  // Assuming 'name' is a property of each user
        document.getElementById('user-list').appendChild(listItem);
      });
      updateUserNames();
    } 
    else {
      console.error('Data.users is not an array:', data);
    }
    
  })
  .catch(error => console.error('Error fetching data:', error));
//server??


$(document).ready(function(){
    $("#popup").modal('show');
}) 

function updateUserNames() {
    const userList = document.getElementById('user-list');
    const listItems = userList.children;

    document.getElementById("user-name0").textContent = listItems[0].textContent; // Display first user
    document.getElementById("user-name1").textContent = listItems[1].textContent; 
    document.getElementById("user-name2").textContent = listItems[2].textContent;
    document.getElementById("user-name3").textContent = listItems[3].textContent;

}


window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }

            navbarCollapsible.classList.add('navbar-shrink')


    };

    // Shrink the navbar 
    navbarShrink();


    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };


    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});