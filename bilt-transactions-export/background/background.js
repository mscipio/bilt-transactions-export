/**
 * Background Service Worker for Bilt Transactions Export
 * Handles coordination between popup and content scripts
 */

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Bilt Transactions Export installed:', details.reason);
  
  // Set default settings
  chrome.storage.local.set({
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
