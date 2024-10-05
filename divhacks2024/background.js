// List of social media websites for chrome extension to track
const socialMediaSites = new Set([
  'facebook.com',
  'twitter.com',
  'tiktok.com',
  'instagram.com',
  'reddit.com',
  'snapchat.com',
  'youtube.com',
  'linkedin.com',
  'discord.com',
  'pinterest.com'
]);

let activeTabId = null;  // Track the active tab ID
let tabStartTime = null; // Track the start time for tab activities

function isSocialMedia(url) {
  // Extract the hostname from the URL (e.g., "www.facebook.com" -> "facebook.com")
  const domain = new URL(url).hostname;
  // Check if the domain matches one of the social media sites
  return socialMediaSites.has(domain);
}

// Monitor when tab is updated (loaded completely)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    // If the tab is a social media site, start tracking time
    startTracking(tabId);
  }
});

// Monitor when tab is activated (switched to a new tab)
chrome.tabs.onActivated.addListener((activeInfo) => {
  startTracking(activeInfo.tabId);
});

// Monitor when tab is removed (closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  endTracking(tabId);
});

// Start tracking time for the active tab
function startTracking(tabId) {
  if (activeTabId !== tabId) {
    if (activeTabId !== null && tabStartTime !== null) {
      endTracking(activeTabId);
    }

    activeTabId = tabId;
    tabStartTime = Date.now();
  }
}

// End tracking time for a tab and save data to storage
function endTracking(tabId) {
  if (tabStartTime !== null && activeTabId !== null) {
    const endTime = Date.now();
    const duration = (endTime - tabStartTime) / 1000; // Time in seconds

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

