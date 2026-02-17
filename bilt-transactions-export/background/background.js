/**
 * Background Service Worker for Bilt Transactions Export
 * Handles coordination between popup and content scripts
 */

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureTab') {
    handleCaptureTab(sender.tab?.id)
      .then(dataUrl => sendResponse(dataUrl))
      .catch(error => {
        console.error('Capture failed:', error);
        sendResponse(null);
      });
    return true; // Keep channel open for async
  }
});

/**
 * Capture the active tab as an image
 */
async function handleCaptureTab(tabId) {
  if (!tabId) {
    // Get active tab if not provided
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tab?.id;
  }

  if (!tabId) {
    throw new Error('No active tab found');
  }

  try {
    // Use Chrome's captureVisibleTab API
    const dataUrl = await chrome.tabs.captureVisibleTab(null, {
      format: 'png',
      quality: 90
    });
    
    return dataUrl;
  } catch (error) {
    console.error('Tab capture failed:', error);
    throw error;
  }
}

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Bilt Transactions Export installed:', details.reason);
  
  // Set default settings
  chrome.storage.local.set({
    useOcrFallback: true,
    firstInstall: true,
    installDate: new Date().toISOString()
  });
});

/**
 * Handle browser startup
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('Bilt Transactions Export: Browser started');
});
