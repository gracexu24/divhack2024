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
  try {
    // Skip invalid chrome:// or about:// URLs
    if (url.startsWith('chrome://') || url.startsWith('about://')) {
      return ''; // Return an empty string for these types of URLs
    }
    const domain = new URL(url).hostname.replace('www.', ''); // Remove 'www.' if present
    return domain.toLowerCase(); // Convert domain to lowercase for consistency
  } catch (error) {
    console.error("Failed to extract domain from URL", url, error);
    return ''; // Return an empty string in case of error
  }
}

// Function to start tracking time for a given tab
function startTracking(tabId, url) {
  const domain = getDomain(url);  // Extract the domain from the URL
  if (socialMediaSites.has(domain)) {
    if (!(tabId in openTabs)) {
      // Start tracking the tab and store the start time
      openTabs[tabId] = { 
        startTime: Date.now(),
        url: url 
      };
      console.log(`Tracking started for tab ${tabId}, URL: ${url}`);
    }
  } else {
    console.log(`Skipping tracking for tab ${tabId}, URL is not a social media site.`);
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
    
    // Store the time spent on this site in chrome.storage
    chrome.storage.local.get(["siteTimes"], (result) => {
      let siteTimes = result.siteTimes || {};  // Initialize with empty object if undefined
      const domain = getDomain(openTabs[tabId].url); // Extract domain

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
    
    if (tab && socialMediaSites.has(getDomain(tab.url))) {
      startTracking(activeInfo.tabId, tab.url);  // Start tracking for active tab if it's a social media site
    }
  });
});

