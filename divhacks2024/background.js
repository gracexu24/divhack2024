let activeTabId = null;  // Declare globally
let tabStartTime = null;  // Declare globally

// Your list of social media sites (with only domains)
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
  const domain = new URL(url).hostname.replace('www.', '');  // Normalize the URL by removing 'www.'
  return socialMediaSites.has(domain);  // Match only the normalized domain
}

// Function to start tracking time for a given tab
function startTracking(tabId) {
  if (activeTabId !== tabId) {
    // If activeTabId is different from the tabId, end the previous tracking session
    if (activeTabId !== null && tabStartTime !== null) {
      console.log(`Ending previous tracking for tab ${activeTabId} before starting new tracking.`);
      endTracking(activeTabId);  // Ensure we end the previous tracking session
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

    console.log(`Ending tracking for tab ID: ${tabId}, Duration: ${duration}s`);  // Debugging line

    chrome.tabs.get(tabId, (tab) => {
      if (tab && tab.url) {
        const domain = new URL(tab.url).hostname.replace('www.', '');  // Normalize URL to domain
        console.log(`Tracking time for: ${domain}, Duration: ${duration}s`);

        // Update the time spent on the website
        chrome.storage.local.get(["siteTimes"], (result) => {
          let siteTimes = result.siteTimes || {};
          siteTimes[domain] = (siteTimes[domain] || 0) + duration;

          chrome.storage.local.set({ siteTimes }, () => {
            console.log(`Time spent on ${domain}: ${siteTimes[domain]}s`);  // Debugging line
          });
        });
      } else {
        console.log("Tab has no valid URL");
      }
    });
  } else {
    console.log("No active tab or start time to calculate duration.");
  }
}

// Event listener for when a tab is updated (e.g., URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab updated: ${tabId}, Change Info: ${JSON.stringify(changeInfo)}`);  // Debugging line
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    startTracking(tabId);  // Start tracking if it's a social media site
  }
});

// Event listener for when a tab is activated (switched)
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log(`Tab activated: ${activeInfo.tabId}`);  // Debugging line
  activeTabId = activeInfo.tabId;  // Set activeTabId when the tab is activated
  startTracking(activeTabId);  // Start tracking the newly activated tab
});

// Event listener for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`Tab removed: ${tabId}`);  // Debugging line
  if (tabId === activeTabId) {
    console.log(`Tab ${tabId} was the active tab. Ending tracking.`);
    endTracking(tabId);  // End tracking if the tab is closed
  }
});

