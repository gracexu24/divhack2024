/*fetch('http://localhost:3000/api/users')
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
*/ 

const userList = [
    {id: 1, name: 'Faceboo'}, {id: 2, name: 'Twitte'}, {id: 2, name: 'Tikto'}, {id: 2, name: 'Insta'}
];

// Send the list to the server
fetch('https://d902-128-59-178-198.ngrok-free.app/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userList })  // Sending the list as JSON
})
.then(response => response.json())
.then(data => {
    console.log('Server Response:', data);
    alert('Users sent to the server!');
})
.catch(error => {
    console.error('Error:', error);
});