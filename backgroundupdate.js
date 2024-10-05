chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('socialMediaSites')) { 
      chrome.action.openPopup();
    }
  });
  
