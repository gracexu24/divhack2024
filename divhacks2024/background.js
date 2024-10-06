let activeTabId = null;  // Declare globally for active tab ID
let tabStartTime = null;  // Declare globally for tab start time

// Your list of social media sites (limited to Facebook, Twitter, Instagram, and TikTok)
const socialMediaSites = new Set([
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "tiktok.com"
]);

// Helper function to check if the URL belongs to a social media site
function isSocialMedia(url) {
  const domain = new URL(url).hostname;
  console.log(`Checking if ${domain} is a social media site`);  // Debugging line
  return socialMediaSites.has(domain);  // Return true if the domain is in the list
}

// Function to start tracking time for a given tab
function startTracking(tabId, url) {
  if (activeTabId !== tabId) {
    // If activeTabId is different from the tabId, end the previous tracking session
    if (activeTabId !== null && tabStartTime !== null) {
      endTracking(activeTabId); // End previous tracking session
    }

    // Set the new active tab
    activeTabId = tabId;
    tabStartTime = Date.now(); // Set the start time for the new tab
    console.log(`Tracking started for tab ID: ${activeTabId}, URL: ${url}`);
  }
}

// Function to end tracking for a given tab and log the time spent
function endTracking(tabId) {
  if (tabStartTime !== null && activeTabId !== null && activeTabId === tabId) {
    const endTime = Date.now();
    const duration = (endTime - tabStartTime) / 1000; // Duration in seconds
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

    // Reset tracking variables
    activeTabId = null;
    tabStartTime = null;
  } else {
    console.log("No active tab or start time to calculate duration.");
  }
}

// Event listener for when a tab is updated (e.g., URL change or tab reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab updated: ${tabId}, URL: ${tab.url}`);  // Debugging line

  // Ensure we are checking only after the page is fully loaded
  if (changeInfo.status === 'complete' && tab.url && isSocialMedia(tab.url)) {
    // Start tracking if it's a social media site and not already tracking this tab
    if (tabId !== activeTabId) {
      console.log(`Starting tracking for tab: ${tabId}, URL: ${tab.url}`);
      startTracking(tabId, tab.url);
    }
  }

  // Open the popup if it's a social media tab
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

// Event listener for when a tab is activated (when you switch between tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log(`Tab activated: ${activeInfo.tabId}, URL: ${tab.url}`);  // Debugging line
    if (tab && isSocialMedia(tab.url)) {
      startTracking(activeInfo.tabId, tab.url);  // Start tracking for active tab
    } else {
      console.log('Tab is not a social media site, no tracking started.');
    }
  });
});

// Event listener for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`Tab removed: ${tabId}`);  // Debugging line

  // Check if the tab being removed is the active one
  if (tabId === activeTabId) {
    console.log(`Active tab removed, ending tracking.`);
    endTracking(tabId);  // End tracking if the tab is closed
  } else {
    console.log('Removed tab is not the active one, no tracking ended.');
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