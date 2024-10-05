fetch('http://localhost:3000/api/users')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the users list from the Node.js server
        const userList = document.getElementById('user-list');
        data.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = user.name; // Assuming the API returns a list of users with a "name" property
            userList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching data:', error));