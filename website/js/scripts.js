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

//function to access username
// Function to display a user at a specific index
function displayUserAtIndex(index) {
    const userNameElement = document.getElementById("user-name");  // Target the element where the name will be displayed
    const indexElement = document.getElementById("index");  // Target the element to show the index
    const userList = document.getElementById('user-list');
    const listItems = userList.children;  // Get all the <li> elements (children of the <ul>)

    // Set the displayed index
    indexElement.textContent = index;

    // Check if the index is within the bounds of the array
    if (index >= 0 && index < listItems.length) {
        // Set the text content to the user at the specified index
        userNameElement.textContent = listItems[index].textContent;  // Access the textContent of the <li> at the specified index
    } else {
        // If the index is out of bounds, show an error message
        userNameElement.textContent = "Index out of bounds!";
    }
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