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

function isSocialMedia(url) {
  // Extract the hostname from the URL (e.g., "www.facebook.com" -> "facebook.com")
  const domain = new URL(url).hostname;

  // Check if the domain matches one of the social media sites
  return socialMediaSites.has(domain);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('socialMediaSites')) { 
      chrome.action.openPopup();
    }
  });
  
// Monitors when tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
  startTracking(activeInfo.tabId);
});

// Monitors when tab is changed/updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete') {
    startTracking(tabId);
  }
});

// Store the time spent on each social media website when a tab is closed
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
