let activeTabId = null;  // Declare globally
let tabStartTime = null;  // Declare globally

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
  return socialMediaSites.has(domain);
}

// Function to start tracking time for a given tab
function startTracking(tabId) {
  if (activeTabId !== tabId) {
    // If activeTabId is different from the tabId, end the previous tracking session
    if (activeTabId !== null && tabStartTime !== null) {
      endTracking(activeTabId);
    }

    // Set the new active tab
    activeTabId = tabId;
    tabStartTime = Date.now();  // Set the start time for the new tab
    console.log(`Tracking started for tab ID: ${activeTabId}`);
  }
}

// Function to end tracking for a given tab and save the time spent
function endTracking(tabId) {
  if (tabStartTime !== null && activeTabId !== null) {
    const endTime = Date.now();
    const duration = (endTime - tabStartTime) / 1000; // Duration in seconds

    console.log(`Ending tracking for tab ID: ${tabId}, Duration: ${duration}s`);  // Debugging line

    chrome.tabs.get(tabId, (tab) => {
      if (tab && tab.url) {
        const url = new URL(tab.url).hostname;

        // Update the time spent on the website
        chrome.storage.local.get(["siteTimes"], (result) => {
          let siteTimes = result.siteTimes || {};
          siteTimes[url] = (siteTimes[url] || 0) + duration;

          chrome.storage.local.set({ siteTimes });
          console.log(`Time spent on ${url}: ${duration}s`);  // Debugging line
        });
      } else {
        console.log("Tab has no valid URL");
      }
    });
  } else {
    console.log("No active tab or start time to calculate duration.");
  }
}

// Monitor when a tab is activated (switched)
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;  // Set activeTabId when the tab is activated
  console.log('Tab activated:', activeTabId);

  // Check if the activated tab is a social media site
  chrome.tabs.get(activeTabId, (tab) => {
    if (tab && tab.url && isSocialMedia(tab.url)) {
      startTracking(activeTabId);  // Start tracking only if it's a social media site
    } else {
      console.log('Tab is not a social media site, no tracking started.');
    }
  });
});

// Event listener for when a tab is updated (e.g., URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log(`Tab updated: ${tabId}, URL: ${tab.url}`);
    // Track time when social media sites are loaded
    if (isSocialMedia(tab.url)) {
      startTracking(tabId);  // Start tracking if it's a social media site
    }
  }
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
