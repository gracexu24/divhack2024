let openTabs = {}; // To keep track of tabs that are being actively tracked
// List of social media sites
const socialMediaSites = new Map([
  ['facebook.com', true],
  ['x.com', true], // 'x.com' for Twitter
  ['instagram.com', true],
  ['tiktok.com', true]
]);

// Helper function to extract domain from a URL
function getDomain(url) {
  const domain = new URL(url).hostname.replace('www.', ''); // Remove 'www.' if present
  return domain;
}

// Helper function to check if the URL belongs to a social media site
async function isSocialMedia() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tabs[0]?.url;
  
  if (url) {
    const domain = getDomain(url); // Extract domain
    return socialMediaSites.has(domain); // Check if the domain is in the list
  }

  return false; // Return false if URL is not found
}

// Process controller for popup and tracking
async function checkAndOpenPopup() {
  const isSocial = await isSocialMedia();
  if (isSocial) {
    chrome.action.openPopup(); // Open the popup
  }
}

// Listen for tab updates and check if it's a social media site
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    checkAndOpenPopup(); // Check the URL and open popup if it's a social media site
  }
});

// Event listener for when a tab is updated (URL change or tab reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab updated: ${tabId}, URL: ${tab.url}`);
  
  // If the tab is fully loaded (changeInfo.status === 'complete') and is a social media site
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    console.log(`Tab updated: ${tabId}, social media site found, starting tracking.`);
    startTracking(tabId, tab.url);
  }
});

// Helper function to check if a tab's URL belongs to a social media site
function isSocialMedia(url) {
  const domain = new URL(url).hostname;
  return socialMediaSites.has(domain);
}

// Function to start tracking time for a given tab
function startTracking(tabId, url) {
  if (!(tabId in openTabs)) {
    // Start tracking the tab and store the start time
    openTabs[tabId] = { 
      startTime: Date.now(),
      url: url 
    };
    console.log(`Tracking started for tab ${tabId}, URL: ${url}`);
  }
}

// Function to end tracking when a tab is closed
function endTracking(tabId) {
  // Ensure that the tab is being tracked before ending tracking
  if (tabId in openTabs) {
    const startTime = openTabs[tabId].startTime;
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;  // Duration in seconds
    
    // Log the duration for this tab
    console.log(`Tab ${tabId} ended. Duration: ${duration.toFixed(2)} seconds`);
    
    // Store the time spent on the site in chrome.storage
    chrome.storage.local.get(["siteTimes"], (result) => {
      let siteTimes = result.siteTimes || {};  // Initialize with empty object if undefined
      const domain = new URL(openTabs[tabId].url).hostname;
      
      // Update the time spent on this specific domain
      siteTimes[domain] = (siteTimes[domain] || 0) + duration;
      
      // Save the updated siteTimes back to local storage
      chrome.storage.local.set({ siteTimes }, () => {
        console.log(`Updated time spent on ${domain}: ${siteTimes[domain]} seconds`);
      });
    });

    // Remove the tab from the openTabs object as it's no longer being tracked
    delete openTabs[tabId];
  } else {
    console.log(`No active tracking for tab ${tabId}, skipping end tracking.`);
  }
}

// Event listener for when a tab is removed (closed)
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`Tab removed: ${tabId}`);
  
  // Only end tracking if this tab was tracked
  if (tabId in openTabs) {
    console.log(`Ending tracking for tab ${tabId} (because it's removed).`);
    endTracking(tabId);
  } else {
    console.log(`Removed tab ${tabId} is not being tracked, skipping end tracking.`);
  }
});

// Event listener for opening a social media site (tab activation)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log(`Tab activated: ${activeInfo.tabId}, URL: ${tab.url}`);
    
    if (tab && isSocialMedia(tab.url)) {
      startTracking(activeInfo.tabId, tab.url);  // Start tracking for active tab if it's a social media site
    }
  });
});

// Event listener for opening a social media site and opening the popup
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isSocialMedia(tab.url)) {
    chrome.action.openPopup();  // Open the popup when the tab is a social media site
  }
});

// Helper to verify storage contents
function verifyStorage() {
  chrome.storage.local.get(["siteTimes"], (result) => {
    console.log("Current stored site times:", result.siteTimes);  // Verify storage
  });
}

