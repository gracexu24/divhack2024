let activeTabId = null;  // Track the active tab ID
let tabStartTime = null; // Track the start time for the tab

const socialMediaSites = new Set([
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'reddit.com',
  'tiktok.com',
  'linkedin.com',
  'youtube.com',
  'pinterest.com'
]);

function isSocialMedia(url) {
  const domain = new URL(url).hostname;
  return socialMediaSites.has(domain);
}

function startTracking(tabId) {
  if (activeTabId !== tabId) {
    if (activeTabId !== null && tabStartTime !== null) {
      endTracking(activeTabId); // End tracking for the previous tab
    }

    activeTabId = tabId;
    tabStartTime = Date.now(); // Start tracking time for the new tab
  }
}

function endTracking(tabId) {
  if (tabStartTime !== null && activeTabId !== null) {
    const endTime = Date.now();
    const duration = (endTime - tabStartTime) / 1000; // Duration in seconds

    chrome.tabs.get(tabId, (tab) => {
      const url = new URL(tab.url).hostname;

      chrome.storage.local.get(["siteTimes"], (result) => {
        let siteTimes = result.siteTimes || {};
        siteTimes[url] = (siteTimes[url] || 0) + duration;

        chrome.storage.local.set({ siteTimes });
      });
    });
  }
}

// Monitor when tabs are updated or activated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    startTracking(tabId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  startTracking(activeInfo.tabId);
});

// Monitor when tabs are closed and stop tracking
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  endTracking(tabId);
});

