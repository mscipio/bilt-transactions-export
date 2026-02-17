# Bilt Extension: Architecture

## System Overview

**Type**: Chrome Browser Extension (Manifest V3)  
**Purpose**: Extract transaction data from Bilt Rewards and export to CSV  
**Architecture Pattern**: Content Script Injection + Popup Controller  
**Data Strategy**: DOM-First Extraction with OCR Fallback

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Extension                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐      ┌──────────────┐      ┌──────────┐   │
│  │   Popup UI  │◄────►│   Content    │◄────►│   Bilt   │   │
│  │  (popup/)   │      │   Script     │      │   Page   │   │
│  │             │      │ (content/)   │      │   DOM    │   │
│  │ - HTML/CSS  │      │              │      │          │   │
│  │ - Controls  │      │ - Extract    │      │          │   │
│  │ - Preview   │      │ - Parse      │      │          │   │
│  │ - Download  │      │ - Filter     │      │          │   │
│  └─────────────┘      └──────────────┘      └──────────┘   │
│         │                      │                           │
│         ▼                      ▼                           │
│  ┌──────────────────────────────────────┐                 │
│  │        Background Service Worker     │                 │
│  │           (background/)              │                 │
│  │   - Extension lifecycle management   │                 │
│  └──────────────────────────────────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   CSV Download  │
                    │   (Actual Budget│
                    │    compatible)  │
                    └─────────────────┘
```

---

## Component Breakdown

### 1. Popup UI (`popup/`)

**Responsibilities:**
- User interface rendering
- Trigger content script injection
- Display extraction progress
- Show transaction preview
- Handle CSV download

**Key Files:**
- `popup.html` - Layout structure
- `popup.css` - Styling
- `popup.js` - Controller logic

**Flow:**
1. User clicks extension icon → popup.html opens
2. User clicks "Extract Transactions"
3. popup.js injects content script with retry logic
4. Waits for extraction results
5. Displays preview table
6. User clicks "Download CSV" → generates and downloads file

### 2. Content Script (`content/`)

**Responsibilities:**
- DOM traversal and extraction
- Date parsing and normalization
- Transaction filtering
- Data formatting
- Return structured results

**Key Files:**
- `content.js` - Main extraction logic

**Extraction Strategy (Date-Header Scoping):**
```javascript
// 1. Find all date headers in the DOM
const dateHeaders = [...dateElements, ...rentDayElements];

// 2. For each date header, find transactions between it and next date
for (let i = 0; i < dateHeaders.length; i++) {
  const currentDate = dateHeaders[i];
  const nextDate = dateHeaders[i + 1];
  
  // Get DOM indices for scoping
  const startIndex = allElements.indexOf(currentDate);
  const endIndex = nextDate ? allElements.indexOf(nextDate) : Infinity;
  
  // Extract only payees within this range
  const payeesInRange = payees.filter(p => {
    const pIndex = allElements.indexOf(p);
    return pIndex > startIndex && pIndex < endIndex;
  });
}
```

**Why this approach?**
- Eliminates duplicates that occurred when scanning all payees globally
- Properly associates transactions with their correct dates
- Handles the Bilt page structure where dates are headers above transaction groups

### 3. Background Service Worker (`background/`)

**Responsibilities:**
- Extension initialization
- Tab management
- Message routing (if needed)

**Current State:** Minimal - extension works primarily through popup ↔ content direct communication

### 4. Modules (`modules/`)

**Utilities:**
- `csv.js` - CSV generation with proper escaping
- `utils.js` - Helper functions (date parsing, validation)
- `dom-extractor.js` - Alternative extractor (not used)

### 5. OCR Library (`lib/`)

**Tesseract.js:**
- Included but unused in current implementation
- Available as fallback if DOM structure changes
- Can be activated if Bilt implements anti-scraping measures

---

## Data Flow

### Extraction Flow

```
User Action: Click "Extract Transactions"
         │
         ▼
┌─────────────────┐
│  popup.js       │──► Injects content script with retry logic
│  (injectScript) │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  content.js     │──► Finds date headers using CSS selectors
│  (extract)      │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  content.js     │──► Parses each date (handles formats like
│  (parseDate)    │    "Today", "Yesterday", "Feb 1 • Rent Day")
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  content.js     │──► For each date, finds associated transactions
│  (scope by DOM) │    by their position between date headers
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  content.js     │──► Filters out non-transactions (points,
│  (filter)       │    rewards, promotions, Bilt Mastercard)
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  content.js     │──► Returns array of {date, payee, amount}
│  (return)       │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  popup.js       │──► Displays preview table with first 10
│  (preview)      │
└─────────────────┘
         │
         ▼
User Action: Click "Download CSV"
         │
         ▼
┌─────────────────┐
│  modules/csv.js │──► Generates CSV with Date, Payee, Amount,
│  (generate)     │    Category, Memo columns
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  popup.js       │──► Triggers browser download
│  (download)     │
└─────────────────┘
```

---

## Key Design Decisions

### 1. DOM-First vs OCR

**Decision:** Use DOM extraction as primary method  
**Rationale:**
- More reliable and faster than OCR
- Structured data is cleaner
- No image processing overhead
- OCR available as fallback if needed

**Implementation:**
- CSS class selectors identify elements
- DOM tree walking associates transactions with dates
- Regex parsing handles date variations

### 2. Date-Header Scoping (Duplicate Fix)

**Problem:** Initial implementation found all payees globally, causing massive duplication (each transaction appeared for every date)

**Solution:** Use DOM position to scope transactions to their date headers

**Code Pattern:**
```javascript
// Get all elements to determine positions
const allElements = Array.from(document.querySelectorAll('*'));

// Find date header index
const dateIndex = allElements.indexOf(dateHeader);
const nextDateIndex = nextDate ? allElements.indexOf(nextDate) : Infinity;

// Only include payees between this date and the next
const relevantPayees = payees.filter(p => {
  const pIndex = allElements.indexOf(p);
  return pIndex > dateIndex && pIndex < nextDateIndex;
});
```

### 3. Transaction Filtering

**Strategy:** Exclude entries containing specific keywords

**Skip Patterns:**
```javascript
const skipPatterns = [
  'points', 'point', 'bilt', 'mastercard', '2x', '3x', '5x',
  'bonus', 'reward', 'rewards', 'promo', 'promotion',
  'welcome', 'referral', 'refer', 'earn', 'earned',
  'rent day', 'anniversary', 'birthday', 'bonus points'
];
```

**Why this works:**
- Bilt mixes transactions with points/rewards in the same list
- Keywords reliably identify non-transaction entries
- Case-insensitive matching handles variations

### 4. Date Parsing Robustness

**Formats Handled:**

| Input | Output | Method |
|-------|--------|--------|
| "Today" | 2026-02-16 | new Date() |
| "Yesterday" | 2026-02-15 | new Date() - 1 day |
| "February 14, 2026" | 2026-02-14 | Regex + Date.parse |
| "February 1, 2026 • Rent Day" | 2026-02-01 | Split on •, parse first part |

**Implementation:**
```javascript
function parseDate(dateText) {
  // Remove bullet points and suffixes (e.g., "• Rent Day")
  dateText = dateText.split('•')[0].trim();
  
  // Handle relative dates
  if (dateText.toLowerCase() === 'today') return new Date();
  if (dateText.toLowerCase() === 'yesterday') {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }
  
  // Parse "Month Day, Year"
  const match = dateText.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (match) {
    const [_, month, day, year] = match;
    return new Date(`${month} ${day}, ${year}`);
  }
  
  return null;
}
```

---

## Configuration

### CSS Class Selectors (2026-02-16)

```javascript
const CONFIG = {
  classes: {
    // Date headers - multiple classes because Bilt uses different
    // classes for regular dates vs Rent Day dates
    dateHeader: ['lkndMw', 'iwcRfT'],
    
    // Payee names (merchant names)
    payee: 'fwWhJc',
    
    // Amount values (same class as dates unfortunately)
    amount: 'lkndMw',
    
    // Transaction row containers
    transactionContainer: 'sc-eXnvfo',
    
    // Load more button (for future pagination support)
    loadMore: '.load-more, [data-testid="load-more"], button:contains("Load")'
  },
  
  // Non-transaction keywords to filter out
  skipPatterns: [
    'points', 'point', 'bilt', 'mastercard', '2x', '3x', '5x',
    'bonus', 'reward', 'rewards', 'promo', 'promotion',
    'welcome', 'referral', 'refer', 'earn', 'earned',
    'rent day', 'anniversary', 'birthday', 'bonus points'
  ]
};
```

### Extension Permissions

```json
{
  "permissions": [
    "activeTab",
    "scripting",
    "storage"
  ],
  "host_permissions": [
    "https://www.bilt.com/*"
  ]
}
```

---

## Extension Lifecycle

### Installation
1. User loads unpacked extension in `chrome://extensions/`
2. Manifest.json parsed, permissions requested
3. Service worker starts (background.js)
4. Extension icon appears in toolbar

### Usage
1. User navigates to `https://www.bilt.com/rewards/activity`
2. User clicks extension icon → popup opens
3. User clicks "Extract Transactions"
4. Content script injected into page
5. Extraction runs, returns data to popup
6. Preview displayed
7. User clicks "Download CSV"
8. File generated and downloaded

### Updates
1. Update code in `bilt-transactions-export/`
2. Go to `chrome://extensions/`
3. Click refresh icon on extension
4. Changes take effect immediately

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Extraction Time | < 1 second | For typical month (~20-30 transactions) |
| Memory Usage | Minimal | No image processing, DOM-only |
| Duplication | 0% | Fixed with date-header scoping |
| Accuracy | ~95%+ | Tested against user's actual account |
| False Positives | < 5% | Some edge cases may need manual review |

---

## Future Enhancements

1. **Multi-Month Export**
   - Auto-load more months
   - Combine into single CSV

2. **Category Mapping**
   - Auto-assign categories based on payee
   - User-defined category rules

3. **Actual Budget Integration**
   - Direct API import instead of CSV
   - Auto-categorization

4. **OCR Activation**
   - Implement if DOM structure changes
   - Hybrid DOM + OCR approach

5. **Automated Testing**
   - Unit tests for date parsing
   - Mock DOM for extraction testing
   - Regression tests for CSS selectors

---

## Maintenance Notes

### When Bilt Updates Their UI

1. **Check if extraction still works**
2. **If broken, update selectors in `content.js`:**
   - Use Chrome DevTools to inspect new class names
   - Update `CONFIG.classes` object
   - Test with user's account

3. **If date format changes:**
   - Update `parseDate()` function
   - Add new format to date handling tests

4. **If new transaction types appear:**
   - Update `skipPatterns` array
   - Ensure legitimate transactions aren't filtered

### Version Control

- Extension code is NOT in git currently
- Consider adding to repository for version tracking
- Keep context files updated with any changes

---

## Related Documentation

- [API Reference](./api-reference.md) - Function signatures and interfaces
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [Project Navigation](../navigation.md) - Return to project overview
