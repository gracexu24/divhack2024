/*!
* Start Bootstrap - Agency v7.0.11 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

//server??
fetch('http://localhost:3000/api/users')
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
    } else {
      console.error('Data.users is not an array:', data);
    }
  })
  .catch(error => console.error('Error fetching data:', error));
//server??


$(document).ready(function(){
    $("#popup").modal('show');
}) 


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