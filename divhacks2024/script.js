fetch('http://localhost:3000/api/users')
  .then(response => response.json())
  .then(data => {
    console.log(data);  // Log the data to check its structure
    if (Array.isArray(data)) {
      data.forEach(user => {
        console.log(user);  // Log each user object
        const listItem = document.createElement('li');
        listItem.textContent = user.name; // Assuming 'name' is a property of each user
        document.getElementById('user-list').appendChild(listItem);
      });
    } else {
      console.error('Data is not an array:', data);
    }
  })
  .catch(error => console.error('Error fetching data:', error));