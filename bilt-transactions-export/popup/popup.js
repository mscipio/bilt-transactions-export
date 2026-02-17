/**
 * Popup UI controller for Bilt Transactions Export extension
 * Handles user interactions and communication with content scripts
 */

class PopupController {
  constructor() {
    this.transactions = [];
    this.isProcessing = false;
    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.updateStatus('ready');
  }

  bindElements() {
    this.extractBtn = document.getElementById('extractBtn');
    this.downloadBtn = document.getElementById('downloadBtn');
    this.useOcrFallback = document.getElementById('useOcrFallback');
    this.statusDot = document.getElementById('statusDot');
    this.statusText = document.getElementById('statusText');
    this.previewSection = document.getElementById('previewSection');
    this.previewTableBody = document.getElementById('previewTableBody');
    this.transactionCount = document.getElementById('transactionCount');
    this.progressSection = document.getElementById('progressSection');
    this.progressFill = document.getElementById('progressFill');
    this.progressText = document.getElementById('progressText');
  }

  bindEvents() {
    this.extractBtn.addEventListener('click', () => this.handleExtract());
    this.downloadBtn.addEventListener('click', () => this.handleDownload());
  }

  async handleExtract() {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;
      this.updateStatus('processing');
      this.showProgress(10, 'Checking page...');
      this.extractBtn.disabled = true;

      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url) {
        throw new Error('No active tab found');
      }

      // Check if we're on Bilt Rewards (case-insensitive)
      const url = tab.url.toLowerCase();
      if (!url.includes('bilt.com') || (!url.includes('rewards') && !url.includes('activity'))) {
        throw new Error(`Please navigate to the Bilt Rewards transactions page. Current URL: ${tab.url}`);
      }

      this.showProgress(30, 'Extracting transactions...');

      // Send message to content script
      this.showProgress(40, 'Connecting to page...');
      console.log('Sending message to tab:', tab.id);
      
      // First try to ping the content script
      try {
        const pingResult = await this.sendMessageToContent(tab.id, { action: 'ping' });
        console.log('Ping successful:', pingResult);
      } catch (pingError) {
        console.log('Ping failed, will try to inject:', pingError.message);
      }
      
      this.showProgress(50, 'Extracting transactions...');
      const response = await this.sendMessageToContent(tab.id, {
        action: 'extractTransactions',
        useOcrFallback: this.useOcrFallback.checked
      });

      console.log('Response received:', response);

      if (!response || !response.success) {
        const errorMsg = response?.error || 'Extraction failed';
        if (errorMsg.includes('Tesseract')) {
          throw new Error('DOM extraction failed and OCR library not available. Please check browser console for details.');
        }
        throw new Error(errorMsg);
      }

      this.transactions = response.transactions || [];

      if (this.transactions.length === 0) {
        throw new Error('No transactions found. Tips: 1) Make sure transactions are visible on the page 2) Try scrolling to load more transactions 3) Check browser console (F12) for debug info');
      }

      this.showProgress(100, 'Extraction complete!');
      this.updateStatus('ready');
      this.displayPreview();
      this.downloadBtn.disabled = false;

    } catch (error) {
      console.error('Extraction error:', error);
      this.updateStatus('error', error.message);
      this.showProgress(0, '');
    } finally {
      this.isProcessing = false;
      this.extractBtn.disabled = false;
      setTimeout(() => this.hideProgress(), 2000);
    }
  }

  async handleDownload() {
    if (this.transactions.length === 0) return;

    try {
      this.updateStatus('processing');
      this.downloadBtn.disabled = true;

      // Generate CSV
      const csv = this.generateCSV(this.transactions);
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `bilt-transactions-${timestamp}.csv`;

      await chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true
      });

      this.updateStatus('ready');

    } catch (error) {
      console.error('Download error:', error);
      this.updateStatus('error', error.message);
    } finally {
      this.downloadBtn.disabled = false;
    }
  }

  generateCSV(transactions) {
    const headers = ['Date', 'Payee', 'Amount', 'Category', 'Memo'];
    const rows = transactions.map(t => [
      t.date,
      this.escapeCSV(t.payee),
      t.amount,
      t.category || '',
      this.escapeCSV(t.memo || '')
    ]);

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  }

  escapeCSV(value) {
    if (typeof value !== 'string') return value;
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  async sendMessageToContent(tabId, message) {
    console.log('Attempting to send message to tab:', tabId);
    
    // Try sending message first (script might already be injected)
    try {
      const response = await this.trySendMessage(tabId, message);
      console.log('Message sent successfully on first try');
      return response;
    } catch (error) {
      console.log('First attempt failed, trying to inject script...');
      
      // If that fails, inject the script and retry
      try {
        await this.injectContentScript(tabId);
        console.log('Script injected, waiting for initialization...');
        
        // Wait longer for script to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Retry sending message
        const response = await this.trySendMessage(tabId, message);
        console.log('Message sent successfully after injection');
        return response;
      } catch (injectionError) {
        console.error('Failed to inject or send message:', injectionError);
        throw new Error(`Cannot connect to page. Try refreshing the page and trying again. (${injectionError.message})`);
      }
    }
  }

  trySendMessage(tabId, message) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  injectContentScript(tabId) {
    return new Promise((resolve, reject) => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content/content.js'],
        injectImmediately: true
      }, (results) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          console.log('Script injection results:', results);
          resolve(results);
        }
      });
    });
  }

  updateStatus(status, message = '') {
    this.statusDot.className = 'dot';
    
    switch (status) {
      case 'ready':
        this.statusText.textContent = this.transactions.length > 0 
          ? `Ready - ${this.transactions.length} transactions extracted`
          : 'Ready';
        break;
      case 'processing':
        this.statusDot.classList.add('processing');
        this.statusText.textContent = message || 'Processing...';
        break;
      case 'error':
        this.statusDot.classList.add('error');
        this.statusText.textContent = message || 'Error occurred';
        break;
    }
  }

  showProgress(percent, text) {
    this.progressSection.style.display = 'block';
    this.progressFill.style.width = `${percent}%`;
    this.progressText.textContent = text;
  }

  hideProgress() {
    this.progressSection.style.display = 'none';
    this.progressFill.style.width = '0%';
  }

  displayPreview() {
    this.previewSection.style.display = 'block';
    this.transactionCount.textContent = this.transactions.length;

    // Clear existing rows
    this.previewTableBody.innerHTML = '';

    // Show first 10 transactions
    const previewTransactions = this.transactions.slice(0, 10);
    
    previewTransactions.forEach(transaction => {
      const row = document.createElement('tr');
      
      const amountClass = transaction.amount < 0 ? 'negative' : 'positive';
      const amountFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(transaction.amount);

      row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${this.escapeHtml(transaction.payee)}</td>
        <td class="amount ${amountClass}">${amountFormatted}</td>
      `;
      
      this.previewTableBody.appendChild(row);
    });

    // Add ellipsis if there are more
    if (this.transactions.length > 10) {
      const ellipsisRow = document.createElement('tr');
      ellipsisRow.innerHTML = `
        <td colspan="3" style="text-align: center; color: #999; font-style: italic;">
          ... and ${this.transactions.length - 10} more transactions
        </td>
      `;
      this.previewTableBody.appendChild(ellipsisRow);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
