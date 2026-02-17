/**
 * Popup UI controller for Bilt Transactions Export extension
 * Handles user interactions and communication with content scripts
 */

class PopupController {
  constructor() {
    this.transactions = [];
    this.isProcessing = false;
    this.filterSelection = null;
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
      if (!url.includes('bilt.com') && !url.includes('biltrewards.com')) {
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
        action: 'extractTransactions'
      });

      console.log('Response received:', response);

      if (!response || !response.success) {
        const errorMsg = response?.error || 'Extraction failed';
        throw new Error(errorMsg);
      }

      this.transactions = response.transactions || [];
      this.filterSelection = response.filterSelection || null;

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
      
      // Use filter selection for filename if available, otherwise use timestamp
      let filenameSuffix;
      if (this.filterSelection && this.filterSelection.length > 0) {
        filenameSuffix = this.filterSelection;
      } else {
        filenameSuffix = new Date().toISOString().split('T')[0];
      }
      const filename = `bilt-transactions-${filenameSuffix}.csv`;

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
      console.log('First attempt failed:', error.message);
      
      // Check if content script exists by looking for specific error
      if (error.message.includes('Receiving end does not exist') || 
          error.message.includes('Could not establish connection')) {
        console.log('Content script not found, injecting...');
        
        try {
          await this.injectContentScript(tabId);
          console.log('Script injected, waiting for initialization...');
          
          // Wait for script to initialize with increasing delays
          for (let attempt = 1; attempt <= 3; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 300 * attempt));
            
            try {
              const response = await this.trySendMessage(tabId, message);
              console.log('Message sent successfully after injection');
              return response;
            } catch (retryError) {
              console.log(`Attempt ${attempt} failed:`, retryError.message);
              if (attempt === 3) throw retryError;
            }
          }
        } catch (injectionError) {
          console.error('Failed to inject or send message:', injectionError);
          throw new Error(`Cannot connect to page. Please refresh the Bilt page and try again.`);
        }
      } else {
        throw error;
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

  async injectContentScript(tabId) {
    try {
      // Try to inject content script
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content/content.js'],
        injectImmediately: true
      });
      
      console.log('Content script injected successfully');
      
      // Wait for script to initialize
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('Script injection failed:', error);
      throw new Error(`Failed to inject content script: ${error.message}`);
    }
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
