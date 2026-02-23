/**
 * Content Script for Bilt Transactions Export
 * Runs on Bilt Rewards pages and handles DOM extraction
 */

/**
 * SELECTOR HISTORY - For reference if position-based approach needs debugging
 * 
 * Old selectors (May 2024 - before DOM restructure):
 * - Transaction row: .sc-eXnvfo
 * - Payee: .fwWhJc 
 * - Amount: .lkndMw
 * 
 * New selectors (February 2026):
 * - Transaction row: .sc-eXnvfo (still works)
 * - Payee: .fhbElE (changed from .fwWhJc)
 * - Amount: .lkndMw (still works)
 * 
 * Position-based approach uses:
 * - Date headers: text pattern + parent class contains 'sc-ksXGtu'
 * - Transaction container: sibling after date header
 * - Transaction row: contains [data-testid="icon-bilt-card-regular"]
 * - Points row: contains [data-testid="icon-bilt-points-regular"]
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
          nextDate ? nextDate.index : allElements.length,
          currentDate
        );
        
        console.log(`[Bilt Export] Found ${transactions.length} transactions for ${currentDate.date}`);
        
        // transactions is now already parsed, not DOM elements
        for (const transaction of transactions) {
          const signature = `${transaction.date}|${transaction.payee}|${transaction.amount}`;
          if (!seenSignatures.has(signature)) {
            seenSignatures.add(signature);
            this.transactions.push(transaction);
            console.log(`[Bilt Export] Extracted: ${transaction.date} - ${transaction.payee} - $${transaction.amount}`);
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
    
    // First, try the stable pattern: p elements with sc-mHBLV class, parent has sc-ksXGtu or hTvhYZ
    const stableDateElements = document.querySelectorAll('p.sc-mHBLV, p[class*="sc-mHBLV"]');
    
    for (const el of stableDateElements) {
      const parent = el.parentElement;
      if (!parent) continue;
      
      const parentClass = parent.className || '';
      const hasValidParent = typeof parentClass === 'string' && 
        (parentClass.includes('sc-ksXGtu') || parentClass.includes('hTvhYZ'));
      
      if (!hasValidParent) continue;
      
      const text = this.getText(el);
      if (!text) continue;
      
      // Remove any extra text like "• Rent Day" before matching
      const cleanText = text.split('•')[0].trim();
      
      if (datePattern.test(cleanText) && text.length < 100 && !text.includes('$')) {
        const date = this.parseDate(cleanText);
        // Find index in allElements array
        const index = allElements.indexOf(el);
        if (index !== -1) {
          headers.push({ date, index, element: el, text: cleanText });
        }
      }
    }
    
    // Fallback: use original method for any dates not found via stable pattern
    // This ensures backwards compatibility if the stable pattern misses some dates
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      const text = this.getText(el);
      
      // Skip if already captured via stable pattern
      if (headers.some(h => h.element === el)) continue;
      
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

  /**
   * Extract transactions from a transaction container element
   * Returns fully parsed transaction objects, not DOM elements
   * @param {Element} container - The transaction container element
   * @param {string} date - The date string for these transactions
   * @returns {Object[]} Array of parsed transaction objects
   */
  extractTransactionsFromContainer(container, date) {
    const transactions = [];
    if (!container) return transactions;
    
    // Find all transaction rows within this container
    const rows = container.querySelectorAll('*');
    const processedElements = new Set();
    
    for (const row of rows) {
      // Skip if already processed
      if (processedElements.has(row)) continue;
      
      // Check if this is a transaction row (has Bilt card icon)
      if (this.isTransactionRow(row)) {
        // Verify it's not a points row
        if (!this.isPointsRow(row)) {
          // Extract data using new helpers
          const payee = this.extractPayee(row);
          const amountText = this.extractAmount(row);
          
          if (payee && amountText) {
            const amount = this.parseAmount(amountText);
            if (this.validateTransaction(payee, amount)) {
              transactions.push({
                date: date,
                payee: payee,
                amount: amount,
                category: '',
                memo: ''
              });
            }
          }
          
          // Mark this and all children as processed
          processedElements.add(row);
          row.querySelectorAll('*').forEach(child => processedElements.add(child));
        }
      }
    }
    
    return transactions;
  }

  findTransactionsInRange(allElements, startIndex, endIndex, currentDate) {
    const transactions = [];
    
    // Get the date header element at startIndex
    const dateHeaderElement = allElements[startIndex];
    if (!dateHeaderElement) return transactions;
    
    // Find the transaction container as sibling after date header
    const container = this.findTransactionContainer(dateHeaderElement);
    
    if (container) {
      // Extract transactions from the container using the date
      const containerTransactions = this.extractTransactionsFromContainer(container, currentDate.date);
      transactions.push(...containerTransactions);
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

  /**
   * Find transaction container element as sibling after date header
   * @param {Element} dateHeaderElement - The date header element
   * @returns {Element|null} The transaction container element or null
   */
  findTransactionContainer(dateHeaderElement) {
    if (!dateHeaderElement) return null;
    
    // Get the next sibling element
    let sibling = dateHeaderElement.nextElementSibling;
    
    // Walk forward until we find a transaction container or run out of siblings
    while (sibling) {
      if (this.isTransactionContainer(sibling)) {
        return sibling;
      }
      sibling = sibling.nextElementSibling;
    }
    
    return null;
  }

  /**
   * Check if element contains transaction rows
   * @param {Element} element - The element to check
   * @returns {boolean} True if element contains transaction rows
   */
  containsTransactionRows(element) {
    if (!element) return false;
    
    // Check for transaction rows using data-testid
    const cardIcon = element.querySelector('[data-testid="icon-bilt-card-regular"]');
    if (cardIcon) return true;
    
    // Fallback: check for known transaction row classes
    if (element.className && typeof element.className === 'string' &&
        element.className.includes('sc-eXnvfo')) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if element is a transaction container
   * @param {Element} element - The element to check
   * @returns {boolean} True if element is a transaction container
   */
  isTransactionContainer(element) {
    if (!element) return false;
    
    const className = element.className;
    if (!className || typeof className !== 'string') return false;
    
    // Transaction containers have sc-eXnvfo class
    return className.includes('sc-eXnvfo');
  }

  /**
   * Check if element is a transaction row (has Bilt card icon)
   * @param {Element} element - The element to check
   * @returns {boolean} True if element is a transaction row
   */
  isTransactionRow(element) {
    if (!element) return false;
    
    // Check for Bilt card icon using data-testid
    const cardIcon = element.querySelector('[data-testid="icon-bilt-card-regular"]');
    if (cardIcon) return true;
    
    // Also check if element itself has the icon
    if (element.getAttribute && 
        element.getAttribute('data-testid') === 'icon-bilt-card-regular') {
      return true;
    }
    
    return false;
  }

  /**
   * Check if element is a points/bonus row (has Bilt points icon)
   * @param {Element} element - The element to check
   * @returns {boolean} True if element is a points row
   */
  isPointsRow(element) {
    if (!element) return false;
    
    // Check for Bilt points icon using data-testid
    const pointsIcon = element.querySelector('[data-testid="icon-bilt-points-regular"]');
    if (pointsIcon) return true;
    
    // Also check if element itself has the icon
    if (element.getAttribute && 
        element.getAttribute('data-testid') === 'icon-bilt-points-regular') {
      return true;
    }
    
    return false;
  }

  /**
   * Extract payee name from transaction row
   * @param {Element} row - The transaction row element
   * @returns {string|null} The payee name or null if not found
   */
  extractPayee(row) {
    if (!row) return null;
    
    // First try the known class pattern
    const payeeEl = row.querySelector('.fwWhJc, [class*="fwWhJc"]');
    if (payeeEl) {
      const payee = this.getText(payeeEl).trim();
      if (payee && payee.length >= 2) {
        return payee;
      }
    }
    
    // Fallback: find first meaningful text after card icon
    const cardIcon = row.querySelector('[data-testid="icon-bilt-card-regular"]');
    if (cardIcon) {
      // Get the next sibling text content after the icon
      let sibling = cardIcon.nextElementSibling;
      while (sibling) {
        const text = this.getText(sibling).trim();
        if (text && text.length >= 2) {
          return text;
        }
        sibling = sibling.nextElementSibling;
      }
    }
    
    return null;
  }

  /**
   * Extract amount from transaction row
   * @param {Element} row - The transaction row element
   * @returns {string|null} The amount text or null if not found
   */
  extractAmount(row) {
    if (!row) return null;
    
    // First try the known class pattern
    const amountEl = row.querySelector('.lkndMw, [class*="lkndMw"]');
    if (amountEl) {
      const amountText = this.getText(amountEl).trim();
      if (amountText) {
        return amountText;
      }
    }
    
    // Fallback: search for currency pattern in the row text
    const rowText = this.getText(row);
    const currencyMatch = rowText.match(/\$?[\d,]+\.\d{2}/);
    if (currencyMatch) {
      return currencyMatch[0];
    }
    
    return null;
  }

  /**
   * Check if text is a non-transaction entry (points, bonuses, etc.)
   * @param {string} text - The text to check
   * @returns {boolean} True if text is non-transaction
   */
  isNonTransactionText(text) {
    if (!text || typeof text !== 'string') return true;
    
    const normalizedText = text.trim().toLowerCase();
    
    const nonTransactionPatterns = [
      /^points?$/i,
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
      /bonus\s+\dx/i,
      /^transfer/i,
      /^payment/i,
      /^credit/i,
      /^adjustment/i,
      /^refund/i,
      /^redemption/i,
      /^reward/i,
      /^member\s+reward/i,
      /^annual\s+fee/i,
      /^fee\s+waived/i,
      /^interest\s+charge/i,
      /^late\s+fee/i,
      /^overlimit\s+fee/i
    ];
    
    return nonTransactionPatterns.some(pattern => pattern.test(normalizedText));
  }

  /**
   * Parse amount string to numeric value
   * @param {string} amountText - The amount text to parse
   * @returns {number|null} The parsed numeric amount or null
   */
  parseAmount(amountText) {
    if (!amountText || typeof amountText !== 'string') return null;
    
    const trimmed = amountText.trim();
    
    // Match currency pattern: $50.00, -$50.00, 50.00, (50.00)
    const currencyMatch = trimmed.match(/-?\$?\(?([\d,]+\.\d{2})\)?/);
    
    if (!currencyMatch) return null;
    
    const amount = parseFloat(currencyMatch[1].replace(/,/g, ''));
    
    if (isNaN(amount)) return null;
    
    // Determine if it's a negative amount (expense in Bilt)
    const isNegative = trimmed.includes('-') || trimmed.includes('(');
    
    // Return with sign: expenses are negative for Actual Budget
    return isNegative ? amount : -amount;
  }

  /**
   * Validate extracted transaction data
   * @param {string} payee - The payee name
   * @param {number|string} amount - The amount
   * @returns {boolean} True if transaction data is valid
   */
  validateTransaction(payee, amount) {
    // Validate payee
    if (!payee || typeof payee !== 'string') return false;
    
    const trimmedPayee = payee.trim();
    if (trimmedPayee.length < 2) return false;
    
    // Check if it's a non-transaction entry
    if (this.isNonTransactionText(trimmedPayee)) return false;
    
    // Validate amount
    const numericAmount = typeof amount === 'number' ? amount : this.parseAmount(amount);
    
    if (numericAmount === null || isNaN(numericAmount)) return false;
    
    // Amount should be a reasonable value (not extremely large)
    if (Math.abs(numericAmount) > 1000000) return false;
    
    return true;
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
