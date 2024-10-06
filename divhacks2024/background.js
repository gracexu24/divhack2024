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

// Function to upload the tracking data to your website
function uploadTrackingData() {
  const dataToUpload = JSON.stringify(siteTimes); // Convert the data to JSON format

  // Use Fetch API to send the data to your server
  fetch('https://your-website.com/upload-data', {
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
