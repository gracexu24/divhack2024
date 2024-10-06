// Global variable to store the time spent on social media sites
let siteTimes = {};

// Tracking variables
let activeTabUrl = null;
let tabStartTime = null;

// List of social media sites (you can modify/add more as needed)
const socialMediaSites = new Set([
  "facebook.com",
  "twitter.com",
  "tiktok.com",
  "instagram.com",
  "reddit.com",
  "snapchat.com",
  "youtube.com",
  "linkedin.com",
  "discord.com",
  "pinterest.com"
  "facebook.com",
  "twitter.com",
  "tiktok.com",
  "instagram.com",
  "reddit.com",
  "snapchat.com",
  "youtube.com",
  "linkedin.com",
  "discord.com",
  "pinterest.com"
]);

// Function to check if the current URL is a social media site
function isSocialMedia(url) {
  const domain = new URL(url).hostname;
  return socialMediaSites.has(domain);
}

// Function to start tracking time for a given website
function startTracking(url) {
  if (activeTabUrl !== url) {
    // If we're switching to a new website, stop tracking the previous one
    if (activeTabUrl !== null && tabStartTime !== null) {
      endTracking(activeTabUrl);
    }

    // Start tracking the new website
    activeTabUrl = url;
    tabStartTime = Date.now();
    console.log(`Started tracking time for: ${activeTabUrl}`);
  }
}

// Function to end tracking for the website and log the time spent
function endTracking(url) {
  if (tabStartTime !== null) {
    const endTime = Date.now();
    const duration = (endTime - tabStartTime) / 1000; // Duration in seconds

    // Log the duration to the console
    console.log(`Time spent on ${url}: ${duration.toFixed(2)} seconds`);

<<<<<<< HEAD
    chrome.tabs.get(tabId, (tab) => {
      const domain = new URL(tab.url).hostname.replace('www.', '');  // Normalize URL to domain
        console.log(`Tracking time for: ${domain}, Duration: ${duration}s`);

      // Update the time spent on the website
      chrome.storage.local.get(["siteTimes"], (result) => {
        let siteTimes = result.siteTimes || {};
        siteTimes[domain] = (siteTimes[domain] || 0) + duration;

        chrome.storage.local.set({ siteTimes }, () => {
          console.log(`Time spent on ${domain}: ${siteTimes[domain]}s`);
          });
      });
    });
  }
}

// Event listener for when a tab is updated (e.g., URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab updated: ${tabId}, Change Info: ${JSON.stringify(changeInfo)}`);  // Debugging line
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    // Open the popup when a matching URL is detected
    chrome.action.openPopup();
    // Start tracking if it's a social media site
    startTracking(tabId);
=======
    // Update the total time spent on this site
    if (!siteTimes[url]) {
      siteTimes[url] = 0;
    }
    siteTimes[url] += duration;

    // Log the updated site times object
    console.log("Updated site times:", siteTimes);
  }
}

// Monitor tab changes
function monitorTabChanges() {
  const currentUrl = window.location.href;

  // If the site is a social media site, start tracking
  if (isSocialMedia(currentUrl)) {
    startTracking(currentUrl);
  } else if (activeTabUrl !== null) {
    // If we're leaving the site, stop tracking
    endTracking(activeTabUrl);
    activeTabUrl = null;
>>>>>>> 446e82139ed3e5eb5d5d52b45196aa6ba9f976eb
  }
}

// Run the monitoring function every 30 seconds
setInterval(monitorTabChanges, 30000);

// Initial check when the script runs
monitorTabChanges();

// Manually stop tracking (useful when the script runs)
function stopTracking() {
  if (activeTabUrl !== null) {
    endTracking(activeTabUrl);
    activeTabUrl = null;
  }
  clearInterval(monitorTabChanges); // Stop the interval
}

// Function to upload the tracking data to your local server
function uploadTrackingData() {
  const dataToUpload = JSON.stringify(siteTimes); // Convert the data to JSON format

  // Replace with your local server's endpoint
  const localServerUrl = 'http://localhost:8000'; // Update with your local server's URL

  // Use Fetch API to send the data to your local server
  fetch(localServerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: dataToUpload
  })
  .then(response => response.json())
  .then(data => {
    console.log("Data uploaded successfully:", data);
  })
  .catch(error => {
    console.error("Error uploading data:", error);
  });
}

// Example: You can run uploadTrackingData() later in the console to upload the data
// uploadTrackingData();

