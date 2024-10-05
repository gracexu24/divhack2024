let activeTabId = null;  // Declare globally
let tabStartTime = null;  // Declare globally

// Your list of social media sites
const socialMediaSites = new Set([
  "https://facebook.com/*",
  "https://twitter.com/*",
  "https://tiktok.com/*",
  "https://instagram.com/*",
  "https://reddit.com/*",
  "https://snapchat.com/*",
  "https://youtube.com/*",
  "https://linkedin.com/*",
  "https://discord.com/*",
  "https://pinterest.com/*"
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
    tabStartTime = Date.now();
    console.log(`Tracking started for tab ID: ${activeTabId}`);
  }
}

// Function to end tracking for a given tab and save the time spent
function endTracking(tabId) {
  if (tabStartTime !== null && activeTabId !== null) {
    const endTime = Date.now();
    const duration = (endTime - tabStartTime) / 1000; // Duration in seconds

    chrome.tabs.get(tabId, (tab) => {
      const url = new URL(tab.url).hostname;

      // Update the time spent on the website
      chrome.storage.local.get(["siteTimes"], (result) => {
        let siteTimes = result.siteTimes || {};
        siteTimes[url] = (siteTimes[url] || 0) + duration;

        chrome.storage.local.set({ siteTimes });
        console.log(`Time spent on ${url}: ${duration}s`);
      });
    });
  }
}

// Event listener for when a tab is updated (e.g., URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    startTracking(tabId);  // Start tracking if it's a social media site
  }
});

// Event listener for when a tab is activated (switched)
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;  // Set activeTabId when the tab is activated
  console.log('Tab activated:', activeTabId);
  startTracking(activeTabId);  // Start tracking the newly activated tab
});

// Event listener for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  endTracking(tabId);  // End tracking if the tab is closed
});
