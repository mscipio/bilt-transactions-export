# Code Quality Standards

## Overview
This project follows clean code principles and functional programming patterns where appropriate.

---

## General Principles

### 1. Readability Over Cleverness
- Write code that is easy to understand
- Avoid complex one-liners
- Use descriptive variable names

### 2. Single Responsibility
- Each function does one thing
- Each module has a clear purpose
- Separate concerns (UI, extraction, formatting)

### 3. DRY (Don't Repeat Yourself)
- Extract common logic into functions
- Use configuration objects for variations
- Reuse utilities across components

---

## JavaScript/Chrome Extension Specific

### Variable Naming
```javascript
// Good
const dateHeaders = document.querySelectorAll('.date');
const transactionAmount = parseAmount(amountText);
const shouldSkip = isNonTransactionEntry(payee);

// Bad
const dh = document.querySelectorAll('.date');
const amt = parseAmount(at);
const skip = check(p);
```

### Function Naming
```javascript
// Good
function parseDate(dateText) { }
function extractTransactions() { }
function shouldSkipTransaction(payee) { }

// Bad
function parser(d) { }
function doIt() { }
function check(p) { }
```

### Error Handling
```javascript
// Good
try {
  const result = parseDate(dateText);
  if (!result) {
    console.warn(`Failed to parse date: ${dateText}`);
    return null;
  }
  return result;
} catch (error) {
  console.error('Unexpected error in parseDate:', error);
  return null;
}

// Bad
const result = parseDate(dateText); // May throw or return undefined
```

### Comments
```javascript
// Good: Explain WHY, not WHAT
// Split on bullet point to handle "• Rent Day" suffixes
const cleanDate = dateText.split('•')[0].trim();

// Good: Complex algorithm explanation
// We use DOM position to scope transactions to their date headers.
// This prevents duplicates that occur when scanning all payees globally.

// Bad: Obvious comments
// Increment counter
counter++;

// Bad: Outdated comments
// This uses OCR (but we switched to DOM extraction)
```

---

## Chrome Extension Patterns

### Content Script Communication
```javascript
// Good: Clear message format
chrome.tabs.sendMessage(tabId, {
  action: 'extractTransactions'
});

// Good: Structured response
{
  success: true,
  transactions: [],
  count: 0,
  errors: []
}
```

### Script Injection
```javascript
// Good: With retry and error handling
async function injectScript(tabId, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/content.js']
      });
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(500);
    }
  }
}
```

---

## Configuration Management

### Centralized Config
```javascript
// Good: All selectors in one place
const CONFIG = {
  classes: {
    dateHeader: ['lkndMw', 'iwcRfT'],
    payee: 'fwWhJc',
    amount: 'lkndMw'
  },
  skipPatterns: ['points', 'bonus', 'reward']
};

// Bad: Scattered throughout code
document.querySelectorAll('.lkndMw'); // In 5 different places
```

---

## Testing Guidelines

### Manual Testing Steps
1. Test on real Bilt account
2. Verify transaction count reasonable
3. Check date accuracy
4. Confirm amounts match
5. Test CSV import into Actual Budget

### Debug Support
```javascript
// Add debug logging
const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log('[Bilt]', ...args);
}
```

---

## Documentation Requirements

### File Headers
```javascript
/**
 * Bilt Transaction Extractor - Content Script
 * 
 * Extracts transaction data from Bilt Rewards activity page
 * Primary method: DOM extraction using CSS selectors
 * 
 * @module content/content.js
 * @version 1.0
 */
```

### Function Documentation
```javascript
/**
 * Parse date text into Date object
 * 
 * Supports formats:
 * - "Today", "Yesterday"
 * - "February 14, 2026"
 * - "February 1, 2026 • Rent Day"
 * 
 * @param {string} dateText - Raw date text from DOM
 * @returns {Date|null} Parsed date or null if invalid
 */
function parseDate(dateText) {
  // Implementation
}
```

---

## Version Control

### Commit Messages
```
feat: add support for "Rent Day" date format

- Add 'iwcRfT' class to date header selectors
- Split date text on bullet point to remove suffix
- Add 'rent day' to skip patterns

Fixes Feb 1 transaction showing wrong date
```

### File Organization
```
bilt-transactions-export/
├── manifest.json           # Extension config
├── popup/                  # UI components
├── content/                # Extraction logic
├── modules/                # Utilities
├── background/             # Service worker
└── lib/                    # Third-party libraries
```

---

## Performance Guidelines

### DOM Querying
```javascript
// Good: Query once, reuse
const elements = document.querySelectorAll('.class');
elements.forEach(el => process(el));

// Bad: Query in loop
for (let i = 0; i < 100; i++) {
  document.querySelectorAll('.class'); // Expensive!
}
```

### Array Operations
```javascript
// Good: Efficient filtering
const validTransactions = transactions.filter(t => t.amount !== null);

// Good: Early termination
for (const transaction of transactions) {
  if (shouldStop(transaction)) break;
}
```

---

## Security Considerations

### Content Script Isolation
- Don't expose sensitive functions to page
- Validate messages from popup
- Sanitize extracted data before processing

### Permission Minimalism
```json
{
  "permissions": [
    "activeTab",    // Only active tab
    "scripting",    // Inject scripts
    "storage"       // Settings (if needed)
  ],
  "host_permissions": [
    "https://www.bilt.com/*"  // Specific domain only
  ]
}
```

---

## Code Review Checklist

Before submitting changes:

- [ ] Functions are small and focused
- [ ] Variable names are descriptive
- [ ] Comments explain why, not what
- [ ] Error handling is present
- [ ] No console.log in production (use debug flag)
- [ ] CSS classes are in CONFIG
- [ ] Tested on actual Bilt page
- [ ] Documentation updated

---

## Related

- [Project Navigation](../navigation.md) - Return to project overview
- [Architecture](../project-intelligence/bilt-extension/architecture.md) - System design
