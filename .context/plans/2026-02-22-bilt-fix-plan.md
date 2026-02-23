# BILT Transaction Extractor Fix Implementation Plan

> **For Implementer:** REQUIRED: Use position-based DOM traversal for robust element selection.

**Goal:** Fix transaction extraction by using DOM structure instead of brittle CSS class selectors

**Architecture:** Position-based extraction - find transaction rows by their relative position to date headers and stable DOM markers (data-testid attributes, element types)

**Tech Stack:** JavaScript (ES6+), Chrome Extension Manifest V3

**Design Doc:** .context/plans/2026-02-22-bilt-selector-fix-design.md

---

### Task 1: Refactor findDateHeaders to use stable patterns

**Files:**
- Modify: `bilt-transactions-export/content/content.js`

**Step 1: Review existing implementation**

Read lines 88-125 of content.js to understand current date header finding logic.

**Step 2: Update findDateHeaders method**

Keep the regex-based text matching (it works), but add stable element type matching:

```javascript
findDateHeaders(allElements) {
  // Match dates like "February 1, 2026" or "Today" or "Yesterday"
  const datePattern = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}|^(Yesterday|Today)$/i;
  const headers = [];
  
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    
    // Look for date text in p elements with specific class patterns (stable structure)
    if (el.tagName === 'P' && el.className && el.className.includes('sc-mHBLV')) {
      const text = this.getText(el);
      const cleanText = text.split('•')[0].trim();
      
      if (datePattern.test(cleanText) && text.length < 100 && !text.includes('$')) {
        // Verify it's a date header container by checking parent
        const parent = el.parentElement;
        if (parent && (parent.className.includes('sc-ksXGtu') || parent.className.includes('hTvhYZ'))) {
          const date = this.parseDate(cleanText);
          headers.push({ date, index: i, element: el, text: cleanText });
        }
      }
    }
  }
  
  // Sort by index to ensure chronological order
  headers.sort((a, b) => a.index - b.index);
  return headers;
}
```

**Step 3: Commit**

```bash
git add bilt-transactions-export/content/content.js
git commit -m "refactor: stabilize date header detection using element structure"
```

---

### Task 2: Create helper methods for position-based extraction

**Files:**
- Modify: `bilt-transactions-export/content/content.js`

**Step 1: Add helper methods**

Add these methods to the BiltTransactionExtractor class (after line 85):

```javascript
/**
 * Find transaction container element - sibling after date header
 * This is the CORE algorithm: date header → sibling = transaction container
 */
findTransactionContainer(dateHeaderElement) {
  if (!dateHeaderElement) return null;
  
  const parent = dateHeaderElement.parentElement;
  if (!parent) return null;
  
  // Get next sibling element - this is the transaction container
  let sibling = parent.nextElementSibling;
  
  // Verify it's a transaction container by looking for transaction rows inside
  while (sibling) {
    // Check if this sibling contains transaction rows
    if (this.containsTransactionRows(sibling)) {
      return sibling;
    }
    sibling = sibling.nextElementSibling;
  }
  
  // Fallback: try to find any subsequent sibling with transaction structure
  sibling = parent.nextElementSibling;
  for (let i = 0; i < 5 && sibling; i++) {
    if (this.isTransactionContainer(sibling)) {
      return sibling;
    }
    sibling = sibling.nextElementSibling;
  }
  
  return null;
}

/**
 * Check if element contains any transaction rows
 */
containsTransactionRows(element) {
  if (!element) return false;
  // Look for card icons which indicate transaction rows
  return !!element.querySelector('[data-testid="icon-bilt-card-regular"]');
}

/**
 * Check if element is a transaction container by structure
 */
isTransactionContainer(element) {
  if (!element) return false;
  const className = element.className || '';
  // These are structural indicators for transaction containers
  return className.includes('gfLzd') || 
         className.includes('gJsNtB') ||
         className.includes('sc-iHDLbo');
}

/**
 * Check if element is a transaction row (contains Bilt card icon)
 */
isTransactionRow(element) {
  if (!element) return false;
  // Look for the Bilt card icon as a reliable indicator
  const cardIcon = element.querySelector('[data-testid="icon-bilt-card-regular"]');
  return !!cardIcon;
}

/**
 * Check if element is a points/bonus row (not a real transaction)
 */
isPointsRow(element) {
  if (!element) return false;
  // Points rows have points icon, not card icon
  const pointsIcon = element.querySelector('[data-testid="icon-bilt-points-regular"]');
  return !!pointsIcon;
}

/**
 * Extract payee name from transaction row
 * Payee is the first meaningful text after the icon
 */
extractPayee(row) {
  // Find all text elements in the row
  const textElements = row.querySelectorAll('p');
  
  for (const p of textElements) {
    const text = this.getText(p);
    // Skip if it's just an amount (starts with $)
    if (text.startsWith('$')) continue;
    // Skip if empty or too short
    if (text.length < 2) continue;
    // Skip common non-transaction texts
    if (this.isNonTransactionText(text)) continue;
    
    return text;
  }
  
  return null;
}

/**
 * Extract amount from transaction row
 * Amount is typically the last prominent text or text starting with $
 */
extractAmount(row) {
  // Look for text elements that contain dollar amounts
  const textElements = row.querySelectorAll('p');
  
  // Scan from end - amount is usually one of the last elements
  for (let i = textElements.length - 1; i >= 0; i--) {
    const text = this.getText(textElements[i]);
    // Look for dollar amount pattern
    if (text.match(/^\$?[\d,]+\.\d{2}$/)) {
      return text;
    }
  }
  
  return null;
}

/**
 * Check if text is a non-transaction entry (points, bonuses, etc)
 */
isNonTransactionText(text) {
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
    /bonus\s+\dx/i,
    /^bilt\s+cash/i,
    /^earn\s+bilt/i,
    /point\s+accelerator/i,
    /digital\s+wallet/i,
    /redemption/i
  ];
  
  return skipPatterns.some(pattern => pattern.test(text));
}

/**
 * Parse amount string to numeric value
 */
parseAmount(amountText) {
  if (!amountText) return null;
  
  // Remove currency symbols and commas
  const cleaned = amountText.replace(/[$,]/g, '').trim();
  const amount = parseFloat(cleaned);
  
  if (isNaN(amount)) return null;
  
  // Determine if it's a credit or debit
  const isNegative = amountText.includes('(') || amountText.startsWith('-');
  
  // For Actual Budget compatibility:
  // Expenses should be negative, credits should be positive
  return isNegative ? amount : -amount;
}

/**
 * Validate extracted transaction data
 */
validateTransaction(payee, amount) {
  // Payee should be meaningful text
  if (!payee || payee.length < 2) return false;
  
  // Amount should be valid number
  if (amount === null || isNaN(amount)) return false;
  
  return true;
}
```

**Step 2: Commit**

```bash
git add bilt-transactions-export/content/content.js
git commit -m "feat: add position-based DOM helper methods"
```

---

### Task 3: Rewrite findTransactionsInRange - USE DATE HEADER → SIBLING APPROACH

**Files:**
- Modify: `bilt-transactions-export/content/content.js`

**Step 1: Replace findTransactionsInRange method - THE CORE ALGORITHM**

This is the KEY fix - use date header → sibling container approach per the design:

```javascript
findTransactionsInRange(allElements, startIndex, endIndex, currentDate) {
  const transactions = [];
  const processedElements = new Set();
  
  // Find the date header element at startIndex
  const dateHeaderEl = allElements[startIndex];
  if (!dateHeaderEl) return transactions;
  
  // CORE ALGORITHM: Find transaction container as sibling of date header
  const container = this.findTransactionContainer(dateHeaderEl);
  
  if (!container) {
    console.log('[Bilt Export] No transaction container found for date:', currentDate);
    return transactions;
  }
  
  // Extract transactions from the container
  const foundTransactions = this.extractTransactionsFromContainer(container, currentDate);
  
  // Filter duplicates and add to results
  for (const trans of foundTransactions) {
    const signature = `${trans.date}|${trans.payee}|${trans.amount}`;
    if (!processedElements.has(signature)) {
      processedElements.add(signature);
      transactions.push(trans);
    }
  }
  
  return transactions;
}

/**
 * Extract all transactions from a container element
 * Each transaction is associated with the provided date
 */
extractTransactionsFromContainer(container, date) {
  const transactions = [];
  
  // Find all divs that might be transaction rows
  const rows = container.querySelectorAll('div');
  
  for (const row of rows) {
    // Skip if not a transaction row
    if (!this.isTransactionRow(row)) continue;
    
    // Skip points rows - they're not actual transactions
    if (this.isPointsRow(row)) continue;
    
    // Extract data
    const payee = this.extractPayee(row);
    const amountText = this.extractAmount(row);
    
    // Skip if we couldn't find valid data
    if (!payee || !amountText) continue;
    
    // Parse the amount
    const amount = this.parseAmount(amountText);
    if (amount === null) continue;
    
    // Validate the transaction
    if (!this.validateTransaction(payee, amount)) continue;
    
    // Create transaction object with date
    transactions.push({
      date: date,
      payee: payee,
      amount: amount,
      category: '',
      memo: ''
    });
  }
  
  return transactions;
}
```

**Step 2: Commit**

```bash
git add bilt-transactions-export/content/content.js
git commit -refactor: use date header → sibling container algorithm
```

---

### Task 4: Preserve old selector logic in comments (Rollback Strategy)

**Files:**
- Modify: `bilt-transactions-export/content/content.js`

**Step 1: Add comment block with old selectors**

At the top of the file, add a comment block preserving old selector knowledge:

```javascript
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
```

**Step 2: Commit**

```bash
git add bilt-transactions-export/content/content.js
git commit -m "docs: preserve selector history in comments for future reference"
```

---

### Task 5: Update main extract method

**Files:**
- Modify: `bilt-transactions-export/content/content.js`

**Step 1: Ensure findTransactionsInRange is called with current date**

The main extract() method calls `findTransactionsInRange(allElements, currentDate.index, nextDateIndex)`. Verify it passes the date correctly:

In the main loop (around line 48), ensure:
```javascript
const transactions = this.findTransactionsInRange(
  allElements, 
  currentDate.index, 
  nextDate ? nextDate.index : allElements.length,
  currentDate.date  // <-- ADD THIS - pass the date
);
```

**Step 2: Add error handling**

Add error handling to the extract method for cases where extraction fails:

```javascript
// After finding transactions, if none found, log debug info
if (transactions.length === 0) {
  console.log('[Bilt Export] No transactions found. Debug info:', {
    dateHeaderCount: dateHeaders.length,
    dateProcessed: currentDate.date,
    containerFound: !!container
  });
}
```

**Step 3: Commit**

```bash
git add bilt-transactions-export/content/content.js
git commit -m "feat: integrate position-based extraction with main extract flow"
```

---

### Task 6: Manual testing and verification

**Files:**
- Test: Manual browser testing

**Step 1: Load extension in Chrome**

1. Open Chrome and navigate to: chrome://extensions
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `bilt-transactions-export` folder

**Step 2: Test extraction**

1. Navigate to https://www.biltrewards.com/account/transactions
2. Make sure you're logged in
3. Open the extension popup
4. Click "Export Transactions"
5. Check console for: `[Bilt Export] Found X transactions`

**Step 3: Verify results**

Expected output:
- Date headers found: ✅
- Transactions found: Should be > 0 (your actual transactions)
- CSV download: Should work

**Step 4: Debug if needed**

If issues persist, check console for debug logs:
- `[Bilt Export] Found {N} date headers`
- `[Bilt Export] Processing date: {date}`
- `[Bilt Export] No transaction container found for date: {date}` (if container not found)

**Step 5: Commit**

```bash
git commit -m "test: verify transaction extraction works"
```

---

### Task 7: Final commit and version tag

**Step 1: Review all changes**

```bash
git diff --stat
```

**Step 2: Create a version tag**

```bash
git tag -a v1.1.0 -m "feat: robust transaction extraction using position-based DOM traversal"
```

---

## Dependencies

- Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6

## Notes

- This is a Chrome Extension - no automated unit tests, manual testing required
- The position-based approach uses stable DOM markers (data-testid attributes) which are less likely to change than CSS class names
- If Bilt changes their DOM structure significantly, only the helper methods will need updating, not the core logic
- The key algorithm is: find date header → get next sibling → extract transactions from that container
