# Bilt Extension: API Reference

## Overview
Complete API documentation for the Bilt transaction extractor extension.

---

## Content Script API (`content/content.js`)

### Main Function

#### `extractTransactions()`

**Purpose:** Main extraction function called by popup.js

**Returns:** `Promise<ExtractionResult>`

```typescript
interface ExtractionResult {
  success: boolean;
  transactions: Transaction[];
  count: number;
  errors?: string[];
}

interface Transaction {
  date: string;      // ISO format: "2026-02-14"
  payee: string;     // Merchant name
  amount: number;    // Negative for expenses, positive for income
  category?: string; // Optional category
  memo?: string;     // Optional memo
}
```

**Example:**
```javascript
// Called via chrome.tabs.sendMessage
const result = await chrome.tabs.sendMessage(tabId, {
  action: "extractTransactions"
});

// Returns:
{
  success: true,
  transactions: [
    { date: "2026-02-14", payee: "Starbucks", amount: -5.67 },
    { date: "2026-02-13", payee: "Whole Foods", amount: -45.23 }
  ],
  count: 2
}
```

---

### Extraction Configuration

#### `CONFIG` Object

```javascript
const CONFIG = {
  classes: {
    // CSS classes for date headers
    // Note: Bilt uses different classes for regular dates vs special dates
    dateHeader: ['lkndMw', 'iwcRfT'],
    
    // CSS class for payee/merchant names
    payee: 'fwWhJc',
    
    // CSS class for transaction amounts
    // Note: Unfortunately same as dateHeader in current Bilt UI
    amount: 'lkndMw',
    
    // CSS class for transaction row containers
    transactionContainer: 'sc-eXnvfo',
    
    // Selector for "Load More" button (future pagination support)
    loadMore: '.load-more, [data-testid="load-more"], button:contains("Load")'
  },
  
  // Keywords that indicate non-transaction entries
  // Case-insensitive matching
  skipPatterns: [
    'points', 'point', 'bilt', 'mastercard', '2x', '3x', '5x',
    'bonus', 'reward', 'rewards', 'promo', 'promotion',
    'welcome', 'referral', 'refer', 'earn', 'earned',
    'rent day', 'anniversary', 'birthday', 'bonus points'
  ]
};
```

---

### Helper Functions

#### `parseDate(dateText: string): Date | null`

**Purpose:** Parse various date formats from Bilt UI

**Parameters:**
- `dateText` (string): Raw date text from DOM

**Supported Formats:**
| Input | Output |
|-------|--------|
| "Today" | Current date |
| "Yesterday" | Yesterday's date |
| "February 14, 2026" | Date object |
| "February 1, 2026 • Rent Day" | Date object (splits on •) |
| "Feb 14" | Current year assumed |

**Returns:** `Date` object or `null` if parsing fails

**Example:**
```javascript
parseDate("Today");                          // Date: 2026-02-16
parseDate("Yesterday");                      // Date: 2026-02-15
parseDate("February 14, 2026");              // Date: 2026-02-14
parseDate("February 1, 2026 • Rent Day");    // Date: 2026-02-01
parseDate("Invalid");                        // null
```

**Implementation Notes:**
- Splits on "•" to remove suffixes like "• Rent Day"
- Uses regex to extract Month Day, Year pattern
- Handles case variations

---

#### `formatDate(date: Date): string`

**Purpose:** Format Date object to ISO string (YYYY-MM-DD)

**Parameters:**
- `date` (Date): JavaScript Date object

**Returns:** `string` in format "YYYY-MM-DD"

**Example:**
```javascript
formatDate(new Date("2026-02-14"));  // "2026-02-14"
```

---

#### `parseAmount(amountText: string): number | null`

**Purpose:** Parse amount text to number

**Parameters:**
- `amountText` (string): Raw amount text (e.g., "$5.67", "+$10.00")

**Returns:** `number` (negative for expenses, positive for income) or `null`

**Example:**
```javascript
parseAmount("$5.67");      // -5.67 (expense)
parseAmount("+$10.00");    // 10.00 (income/refund)
parseAmount("-$20.00");    // -20.00 (expense)
parseAmount("Invalid");    // null
```

---

#### `shouldSkipTransaction(payeeText: string, amountText: string): boolean`

**Purpose:** Determine if entry should be filtered out

**Parameters:**
- `payeeText` (string): Payee name text
- `amountText` (string): Amount text

**Returns:** `boolean` - `true` if should skip

**Logic:**
- Checks if payee or amount contains any skipPatterns
- Case-insensitive matching
- Returns true if match found

**Example:**
```javascript
shouldSkipTransaction("Bilt Mastercard", "$5.00");      // true
shouldSkipTransaction("Rent Day Bonus", "+500 points"); // true
shouldSkipTransaction("Starbucks", "$5.67");           // false
```

---

#### `findElementsByClasses(classNames: string | string[]): Element[]`

**Purpose:** Find DOM elements by one or more CSS classes

**Parameters:**
- `classNames` (string or string[]): Single class or array of classes

**Returns:** `Element[]` - Array of matching elements

**Example:**
```javascript
// Find elements with either class
findElementsByClasses(['lkndMw', 'iwcRfT']);

// Find elements with single class
findElementsByClasses('fwWhJc');
```

---

### Extraction Algorithm

#### `extractByDateHeaders(): Transaction[]`

**Purpose:** Extract transactions using date-header scoping (primary method)

**Algorithm:**
1. Find all date header elements using `CONFIG.classes.dateHeader`
2. Find all payee elements using `CONFIG.classes.payee`
3. Find all amount elements using `CONFIG.classes.amount`
4. For each date header:
   - Parse the date text
   - Get DOM index of date header
   - Get DOM index of next date header (or Infinity)
   - Find payees whose DOM position is between these indices
   - For each payee in range, find associated amount
   - Filter out entries matching skipPatterns
   - Create transaction objects
5. Return array of all transactions

**Key Implementation Detail:**
```javascript
// Get all elements to determine positions
const allElements = Array.from(document.querySelectorAll('*'));

// Find position of date header
const dateIndex = allElements.indexOf(dateHeader);
const nextDateIndex = nextDate ? allElements.indexOf(nextDate) : Infinity;

// Filter payees to only those between this date and next
const relevantPayees = payees.filter(p => {
  const pIndex = allElements.indexOf(p);
  return pIndex > dateIndex && pIndex < nextDateIndex;
});
```

**Why this approach:**
- Prevents duplicate transactions (each transaction appears only under its date)
- Handles unlimited list length (doesn't rely on container nesting)
- Robust against UI variations

---

## Popup API (`popup/popup.js`)

### Main Functions

#### `injectScript(tabId: number): Promise<boolean>`

**Purpose:** Inject content script into active tab with retry logic

**Parameters:**
- `tabId` (number): Chrome tab ID

**Returns:** `Promise<boolean>` - `true` if injection successful

**Retry Logic:**
- Attempts injection up to 3 times
- 500ms delay between attempts
- Logs each attempt for debugging

**Example:**
```javascript
const success = await injectScript(tabId);
if (success) {
  // Proceed with extraction
} else {
  // Show error message
}
```

---

#### `extractTransactionsFromTab(tabId: number): Promise<ExtractionResult>`

**Purpose:** Send extraction message to content script

**Parameters:**
- `tabId` (number): Chrome tab ID

**Returns:** `Promise<ExtractionResult>`

**Example:**
```javascript
const result = await extractTransactionsFromTab(tabId);
if (result.success) {
  displayTransactions(result.transactions);
}
```

---

#### `displayTransactions(transactions: Transaction[])`

**Purpose:** Render transaction preview table in popup

**Parameters:**
- `transactions` (Transaction[]): Array of transaction objects

**Behavior:**
- Shows first 10 transactions in table
- Formats amounts with currency symbol
- Highlights negative amounts in red
- Shows total count

---

#### `downloadCSV(transactions: Transaction[])`

**Purpose:** Generate and download CSV file

**Parameters:**
- `transactions` (Transaction[]): Array of transaction objects

**Behavior:**
- Calls `generateCSV()` from modules/csv.js
- Creates blob with CSV content
- Triggers browser download
- Filename: `bilt-transactions-YYYY-MM-DD.csv`

---

## CSV Module API (`modules/csv.js`)

### `generateCSV(transactions: Transaction[]): string`

**Purpose:** Generate CSV string from transactions

**Parameters:**
- `transactions` (Transaction[]): Array of transaction objects

**Returns:** `string` - CSV formatted text

**CSV Format:**
```csv
Date,Payee,Amount,Category,Memo
2026-02-14,Starbucks,-5.67,,
2026-02-13,Whole Foods,-45.23,,
```

**Features:**
- Header row included
- Proper escaping for commas and quotes
- Empty columns for Category and Memo (user fills in)
- Compatible with Actual Budget import

---

## Background Script API (`background/background.js`)

### Lifecycle Events

#### `chrome.runtime.onInstalled`

**Purpose:** Handle extension installation/update

**Behavior:**
- Logs installation event
- Initializes storage if needed

#### `chrome.action.onClicked` (Optional)

**Purpose:** Handle extension icon click

**Current Behavior:** Popup opens automatically (configured in manifest)

---

## Message Interface

### Content Script Messages

Content script listens for messages from popup:

```javascript
// Message format
{
  action: "extractTransactions"
}

// Response format
{
  success: boolean,
  transactions: Transaction[],
  count: number,
  errors?: string[]
}
```

### Error Handling

**Common Error Responses:**

```javascript
// Wrong page
{
  success: false,
  errors: ["Not on Bilt activity page. Please navigate to https://www.bilt.com/rewards/activity"]
}

// No transactions found
{
  success: true,
  transactions: [],
  count: 0,
  errors: ["No transactions found on this page"]
}

// Parsing error
{
  success: false,
  errors: ["Failed to parse date: Invalid Date"]
}
```

---

## CSS Class Reference

### Current Selectors (as of 2026-02-16)

| Element | Class | Notes |
|---------|-------|-------|
| Date Header (regular) | `lkndMw` | Most common |
| Date Header (Rent Day) | `iwcRfT` | Feb 1 has special styling |
| Payee Name | `fwWhJc` | Merchant name |
| Amount | `lkndMw` | Same as date header (problematic) |
| Transaction Container | `sc-eXnvfo` | Row container |

### Inspecting Elements

To find updated selectors when Bilt changes their UI:

1. Navigate to `https://www.bilt.com/rewards/activity`
2. Open Chrome DevTools (F12)
3. Use element inspector to find date header
4. Note the `class` attribute
5. Update `CONFIG.classes` in `content.js`

**Example DevTools Console Commands:**
```javascript
// Find all date headers
document.querySelectorAll('.lkndMw');

// Find all payees
document.querySelectorAll('.fwWhJc');

// Check text content
Array.from(document.querySelectorAll('.lkndMw')).map(el => el.textContent);
```

---

## TypeScript Definitions

For TypeScript support, use these definitions:

```typescript
// types/bilt-extension.d.ts

interface Transaction {
  date: string;
  payee: string;
  amount: number;
  category?: string;
  memo?: string;
}

interface ExtractionResult {
  success: boolean;
  transactions: Transaction[];
  count: number;
  errors?: string[];
}

interface ExtractionConfig {
  classes: {
    dateHeader: string[];
    payee: string;
    amount: string;
    transactionContainer: string;
    loadMore?: string;
  };
  skipPatterns: string[];
}
```

---

## Related Documentation

- [Architecture](./architecture.md) - System design and components
- [Troubleshooting](./troubleshooting.md) - Common issues
- [Project Navigation](../navigation.md) - Return to project overview
