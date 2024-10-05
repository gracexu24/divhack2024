// Global variables to store the active tab ID and tab start time
let activeTabId = null;
let tabStartTime = null;

const socialMediaSites = new Set([
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'reddit.com',
  'youtube.com',
]);

// Helper function to check if the URL belongs to a social media site
function isSocialMedia(url) {
  const domain = new URL(url).hostname;
  return socialMediaSites.has(domain);
}

// Function to start tracking the time for a given tab
function startTracking(tabId) {
  if (activeTabId !== tabId) {
    // End tracking for the previous tab, if any
    if (activeTabId !== null && tabStartTime !== null) {
      endTracking(activeTabId);
    }

    // Start tracking for the new tab
    activeTabId = tabId;
    tabStartTime = Date.now();
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
      });
    });
  }
}

// Event listener for when a tab is updated (e.g., URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    startTracking(tabId);
  }
});

// Event listener for when a tab is activated (switched)
chrome.tabs.onActivated.addListener((activeInfo) => {
  startTracking(activeInfo.tabId);
});

// Event listener for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  endTracking(tabId);
});
