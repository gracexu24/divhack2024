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

let activeTabId = null;
let tabStartTime = null;

// Monitors when tab is activated
chrome.tabs