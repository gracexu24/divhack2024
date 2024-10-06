let openTabs = {};  // Object to store the start time for each tab

// Your list of social media sites (limited to Facebook, Twitter, Instagram, and TikTok)
const socialMediaSites = new Set([
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "tiktok.com"
]);

// Helper function to check if the URL belongs to a social media site
function isSocialMedia(url) {
  try {
    const domain = new URL(url).hostname;
    console.log(`Checking if ${domain} is a social media site`);  // Debugging line
    return socialMediaSites.has(domain);
  } catch (error) {
    console.error(`Error parsing URL: ${url}`, error);  // Debugging line
    return false;
  }
}

// Function to start tracking time for a given tab
function startTracking(tabId, url) {
  if (!openTabs[tabId]) {
    openTabs[tabId] = {
      startTime: Date.now(),
      url: url
    };
    console.log(`Tracking started for tab ID: ${tabId}, URL: ${url}`);
  } else {
    console.log(`Already tracking tab ${tabId} with URL: ${url}`);
  }
}

// Function to end tracking for a given tab and log the time spent
function endTracking(tabId) {
  if (openTabs[tabId]) {
    const endTime = Date.now();
    const duration = (endTime - openTabs[tabId].startTime) / 1000; // Duration in seconds
    console.log(`Ending tracking for tab ID: ${tabId}`);
    console.log(`Duration: ${duration.toFixed(2)} seconds`);

    // Get the URL and store time spent in chrome.storage
    chrome.tabs.get(tabId, (tab) => {
      if (tab && tab.url) {
        const url = new URL(tab.url).hostname;

        // Update the time spent on the website
        chrome.storage.local.get(["siteTimes"], (result) => {
          let siteTimes = result.siteTimes || {}; // Initialize with an empty object if undefined
          siteTimes[url] = (siteTimes[url] || 0) + duration;

          // Save the updated siteTimes back to local storage
          chrome.storage.local.set({ siteTimes }, () => {
            console.log(`Time spent on ${url}: ${duration}s`);
          });
        });
      } else {
        console.log("Tab has no valid URL");
      }
    });

    // Remove the tab from openTabs after tracking is completed
    delete openTabs[tabId];
  } else {
    console.log("No start time found for tab.");
  }
}

// Event listener for when a tab is updated (e.g., URL change or tab reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab updated: ${tabId}, URL: ${tab.url}`);  // Debugging line

  // Track time when a social media site is loaded
  if (changeInfo.status === 'complete' && tab.url && isSocialMedia(tab.url)) {
    console.log(`Starting tracking for tab ${tabId}`);
    startTracking(tabId, tab.url);  // Start tracking when a social media site is fully loaded
  }

  // Open the popup when a social media tab is loaded
  openPopup(tab);
});

// Function to open the popup when a social media site is loaded
function openPopup(tab) {
  const url = new URL(tab.url);
  
  // Check if the hostname matches any of the specified social media domains
  if (isSocialMedia(tab.url)) {
    chrome.action.openPopup();  // Open the popup
    console.log(`Opening popup for: ${tab.url}`);
  }
}

// Event listener for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`Tab removed: ${tabId}`);  // Debugging line

  // End tracking for the tab when it is closed
  if (openTabs[tabId]) {
    console.log(`Tab ${tabId} closed, ending tracking.`);
    endTracking(tabId);  // End tracking if the tab is closed
  } else {
    console.log('Removed tab is not being tracked.');
  }

  // Verify storage after ending tracking
  chrome.storage.local.get(["siteTimes"], (result) => {
    console.log("Stored site times:", result.siteTimes);  // Log the updated site times
  });
});

// Helper to verify storage contents
function verifyStorage() {
  chrome.storage.local.get(["siteTimes"], (result) => {
    console.log("Current stored site times:", result.siteTimes);  // Verify storage
  });
}
