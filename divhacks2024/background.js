let activeTabId = null;  // Declare globally for active tab ID
let tabStartTime = null;  // Declare globally for tab start time

// List of social media sites
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

// Helper function to check if the URL belongs to a social media site
function isSocialMedia(url) {
  const domain = new URL(url).hostname;
  return socialMediaSites.has(domain);  // Return true if the domain is in the list
}

// Function to start tracking time for a given tab
function startTracking(tabId, url) {
  if (activeTabId !== tabId) {
    // If activeTabId is different from the tabId, end the previous tracking session
    if (activeTabId !== null && tabStartTime !== null) {
      endTracking(activeTabId);  // End tracking for the previous tab
    }

    // Set the new active tab
    activeTabId = tabId;
    tabStartTime = Date.now();
    console.log(`Tracking started for tab ID: ${activeTabId} on ${url}`);
  }
}

// Function to end tracking for a given tab and log the time spent
function endTracking(tabId) {
  if (tabStartTime !== null && activeTabId !== null) {
    const endTime = Date.now();
    const duration = (endTime - tabStartTime) / 1000; // Duration in seconds

    console.log(`Ending tracking for tab ID: ${tabId}`);
    console.log(`Time spent on ${tabId}: ${duration.toFixed(2)} seconds`);

    // Get the URL and store time spent in chrome.storage
    chrome.tabs.get(tabId, (tab) => {
      if (tab && tab.url) {
        const url = new URL(tab.url).hostname;

        // Update the time spent on the website
        chrome.storage.local.get(["siteTimes"], (result) => {
          let siteTimes = result.siteTimes || {};
          siteTimes[url] = (siteTimes[url] || 0) + duration;

          // Store updated time back to storage
          chrome.storage.local.set({ siteTimes });
          console.log(`Updated time spent on ${url}: ${siteTimes[url]} seconds`);
        });
      } else {
        console.log("Tab has no valid URL");
      }
    });

    // Reset tracking variables
    activeTabId = null;
    tabStartTime = null;
  } else {
    console.log("No active tab or start time to calculate duration.");
  }
}

// Event listener for when a tab is updated (URL change or tab reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    startTracking(tabId, tab.url);  // Start tracking if it's a social media site

    // Optional: Open the popup for social media sites
    chrome.action.openPopup();  // This will open the default popup if defined in manifest
  }
});

// Event listener for when a tab is activated (when you switch between tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && isSocialMedia(tab.url)) {
      startTracking(activeInfo.tabId, tab.url);  // Start tracking for active tab
      chrome.action.openPopup();  // Open the popup for social media sites
    }
  });
});

// Event listener for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`Tab removed: ${tabId}`);
  endTracking(tabId);  // End tracking when the tab is closed
});
