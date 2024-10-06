// Function to fetch and display the time spent on each social media site
function displayTimeSpent() {
    // Get the stored time data from chrome.storage.local
    chrome.storage.local.get(['siteTimes'], (result) => {
      const siteTimes = result.siteTimes || {};
      const timeDisplay = document.getElementById('social-media-time');
      
      // Clear previous content
      timeDisplay.innerHTML = '';
  
      // If no time data is available, show a message
      if (Object.keys(siteTimes).length === 0) {
        timeDisplay.innerHTML = "<p>No time tracked yet.</p>";
      } else {
        // Iterate over the sites and display the time spent
        for (let domain in siteTimes) {
          const timeSpent = siteTimes[domain];
          
          const siteDiv = document.createElement('div');
          siteDiv.classList.add('site-time');
          
          const siteName = document.createElement('div');
          siteName.classList.add('site-name');
          siteName.textContent = domain;
  
          const siteDuration = document.createElement('div');
          siteDuration.classList.add('site-duration');
          siteDuration.textContent = `Time: ${timeSpent.toFixed(2)} seconds`;
  
          siteDiv.appendChild(siteName);
          siteDiv.appendChild(siteDuration);
          timeDisplay.appendChild(siteDiv);
        }
      }
    });
  }
  
  // Run the function to display the time when the popup is opened
  document.addEventListener('DOMContentLoaded', displayTimeSpent);
  
