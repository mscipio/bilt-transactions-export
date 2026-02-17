/**
 * Content Script for Bilt Transactions Export
 * Runs on Bilt Rewards pages and handles DOM extraction
 */

console.log('[Bilt Export] Content script loading on:', window.location.href);

class BiltTransactionExtractor {
  constructor() {
    this.transactions = [];
  }

  extract() {
    console.log('[Bilt Export] Starting extraction...');
    this.transactions = [];
    const seenSignatures = new Set();
    
    try {
      // Get filter selection from the dropdown
      const filterSelection = this.getFilterSelection();
      console.log('[Bilt Export] Filter selection:', filterSelection);
      
      // Get all elements in document order
      const allElements = Array.from(document.querySelectorAll('*'));
      
      // Find all date headers with their positions
      const dateHeaders = this.findDateHeaders(allElements);
      console.log('[Bilt Export] Found', dateHeaders.length, 'date headers:', 
        dateHeaders.map(d => d.date).join(', '));
      
      if (dateHeaders.length === 0) {
        return {
          success: false,
          transactions: [],
          filterSelection: filterSelection,
          error: 'No date headers found. Make sure transactions are visible on the page.'
        };
      }
      
      // For each date, find transactions that come after it but before the next date
      for (let i = 0; i < dateHeaders.length; i++) {
        const currentDate = dateHeaders[i];
        const nextDate = dateHeaders[i + 1];
        
        console.log(`[Bilt Export] Processing date: ${currentDate.date} (index ${currentDate.index})`);
        
        // Find transactions between current date and next date
        const transactions = this.findTransactionsInRange(
          allElements, 
          currentDate.index, 
          nextDate ? nextDate.index : allElements.length
        );
        
        console.log(`[Bilt Export] Found ${transactions.length} transactions for ${currentDate.date}`);
        
        for (const transEl of transactions) {
          const transaction = this.extractTransaction(transEl, currentDate.date);
          if (transaction) {
            const signature = `${transaction.date}|${transaction.payee}|${transaction.amount}`;
            if (!seenSignatures.has(signature)) {
              seenSignatures.add(signature);
              this.transactions.push(transaction);
              console.log(`[Bilt Export] Extracted: ${transaction.date} - ${transaction.payee} - $${transaction.amount}`);
            }
          }
        }
      }
      
      console.log('[Bilt Export] Total unique transactions:', this.transactions.length);
      
      return {
        success: this.transactions.length > 0,
        transactions: this.transactions,
        count: this.transactions.length,
        filterSelection: filterSelection,
        error: this.transactions.length === 0 ? 'No transactions found' : null
      };
    } catch (error) {
      console.error('[Bilt Export] Extraction error:', error);
      return {
        success: false,
        transactions: [],
        error: error.message
      };
    }
  }

  findDateHeaders(allElements) {
    // Match dates like "February 1, 2026" or "February 1, 2026 • Rent Day" or "Today" or "Yesterday"
    const datePattern = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}|^(Yesterday|Today)$/i;
    const headers = [];
    
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      const text = this.getText(el);
      
      // Check if this is a date header
      // Remove any extra text like "• Rent Day" before matching
      const cleanText = text.split('•')[0].trim();
      
      if (datePattern.test(cleanText) && text.length < 100 && !text.includes('$')) {
        // Make sure it's not inside a transaction row (check parent classes)
        let parent = el.parentElement;
        let isInTransaction = false;
        for (let p = 0; p < 5 && parent; p++) { // Check up to 5 levels up
          if (parent.className && typeof parent.className === 'string' && 
              (parent.className.includes('sc-eXnvfo') || parent.className.includes('sc-gDxZeH'))) {
            isInTransaction = true;
            break;
          }
          parent = parent.parentElement;
        }
        
        if (!isInTransaction) {
          const date = this.parseDate(cleanText);
          headers.push({ date, index: i, element: el, text: cleanText });
        }
      }
    }
    
    // Sort by index to ensure chronological order
    headers.sort((a, b) => a.index - b.index);
    
    return headers;
  }

  findTransactionsInRange(allElements, startIndex, endIndex) {
    const transactions = [];
    const processedElements = new Set();
    
    // Look at elements between start and end
    for (let i = startIndex; i < endIndex && i < allElements.length; i++) {
      const el = allElements[i];
      
      // Skip if already processed
      if (processedElements.has(el)) continue;
      
      // Check if this is a transaction row container (sc-eXnvfo class)
      if (el.className && typeof el.className === 'string' && 
          el.className.includes('sc-eXnvfo')) {
        // Check if it has a payee (fwWhJc class)
        const payeeEl = el.querySelector('.fwWhJc, [class*="fwWhJc"]');
        if (payeeEl) {
          const payeeText = this.getText(payeeEl);
          if (this.isRealTransaction(payeeText)) {
            transactions.push(el);
            // Mark this and all children as processed
            processedElements.add(el);
            el.querySelectorAll('*').forEach(child => processedElements.add(child));
          }
        }
      }
    }
    
    return transactions;
  }

  isRealTransaction(payeeText) {
    const skipPatterns = [
      /points?/i,
      /^bilt\s+(mastercard|cash)/i,
      /^2x\s+points/i,
      /^additional\s+\dx/i,
      /^earn\s+bilt/i,
      /^pending$/i,
      /^housing\s+points$/i,
      /^rakuten\s+points/i,
      /^expires/i,
      /^received/i,
      /^palladium/i,
      /rent\s+day/i,
      /bonus\s+\dx/i
    ];
    
    return !skipPatterns.some(pattern => pattern.test(payeeText));
  }

  extractTransaction(element, date) {
    const payeeEl = element.querySelector('.fwWhJc, [class*="fwWhJc"]');
    if (!payeeEl) return null;
    
    const payee = this.getText(payeeEl).trim();
    if (!payee || payee.length < 2) return null;
    
    const amountEl = element.querySelector('.lkndMw, [class*="lkndMw"]');
    if (!amountEl) return null;
    
    const amountText = this.getText(amountEl).trim();
    const amountMatch = amountText.match(/-?\$?([\d,]+\.\d{2})/);
    if (!amountMatch) return null;
    
    const amountStr = amountMatch[0];
    const isNegative = amountStr.includes('-') || amountText.includes('(');
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    
    // Flip the sign for Actual Budget compatibility:
    // Bilt shows expenses as positive, but Actual Budget expects expenses as negative
    // Bilt shows credits/refunds as negative, but Actual Budget expects them as positive
    const finalAmount = isNegative ? amount : -amount;
    
    return {
      date: date,
      payee: payee,
      amount: finalAmount,
      category: '',
      memo: ''
    };
  }

  getText(element) {
    return (element.textContent || element.innerText || '').trim();
  }

  parseDate(dateText) {
    const now = new Date();
    const trimmed = dateText.trim();

    if (trimmed.toLowerCase() === 'today') {
      return this.formatDate(now);
    }
    
    if (trimmed.toLowerCase() === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return this.formatDate(yesterday);
    }

    const months = ['january', 'february', 'march', 'april', 'may', 'june',
                   'july', 'august', 'september', 'october', 'november', 'december'];
    
    const match = trimmed.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s*(\d{4})?$/i);
    
    if (match) {
      const month = months.indexOf(match[1].toLowerCase());
      const day = parseInt(match[2], 10);
      const year = match[3] ? parseInt(match[3], 10) : now.getFullYear();
      return this.formatDate(new Date(year, month, day));
    }

    return this.formatDate(now);
  }

  formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * Get the current filter selection from the dropdown
   * Returns text like "February, 2026" or "All Time"
   */
  getFilterSelection() {
    try {
      // Look for the filter dropdown button - it has role="combobox" and contains the filter text
      const filterButton = document.querySelector('button[role="combobox"]');
      if (filterButton) {
        // The text is inside nested spans
        const textSpan = filterButton.querySelector('span span span');
        if (textSpan) {
          const filterText = this.getText(textSpan);
          // Clean up the text for use in filename
          return this.sanitizeFilename(filterText);
        }
        // Fallback: get text from the button itself
        const buttonText = this.getText(filterButton);
        // Remove the dropdown arrow/caret icon text if present
        const cleanText = buttonText.replace(/[^\w\s,\-]/g, '').trim();
        if (cleanText) {
          return this.sanitizeFilename(cleanText);
        }
      }
      
      // Alternative: look for the text directly with common class patterns
      const alternativeSelectors = [
        '[class*="sc-iitTBb"]',  // The specific class from the user's example
        '[class*="filter"]',
        '[class*="dropdown"] [class*="text"]',
        'button[id*="_r_n_"]'
      ];
      
      for (const selector of alternativeSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          const text = this.getText(el);
          if (text && text.length > 0 && text.length < 50) {
            return this.sanitizeFilename(text);
          }
        }
      }
      
      // If nothing found, use current date as fallback
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    } catch (error) {
      console.log('[Bilt Export] Could not get filter selection:', error);
      // Fallback to current date
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
  }

  /**
   * Sanitize text for use in filename
   * Removes/replaces characters that are invalid in filenames
   */
  sanitizeFilename(text) {
    if (!text || typeof text !== 'string') {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    
    return text
      .trim()
      // Replace commas with hyphens
      .replace(/,/g, '-')
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove any other invalid filename characters
      .replace(/[<>"/\\|?*]/g, '')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');
  }
}

// Message handler for communication with popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Bilt Export] Received message:', request.action);
  
  if (request.action === 'extractTransactions') {
    const extractor = new BiltTransactionExtractor();
    const result = extractor.extract();
    sendResponse(result);
    return false;
  }
  
  if (request.action === 'ping') {
    sendResponse({ status: 'ok', url: window.location.href });
    return false;
  }
});

console.log('[Bilt Export] Content script initialized and ready');
