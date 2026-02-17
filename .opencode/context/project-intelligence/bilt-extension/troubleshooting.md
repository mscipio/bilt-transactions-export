# Bilt Extension: Troubleshooting

## Overview
Common issues encountered during development and their solutions.

---

## Issue: "Receiving end does not exist"

**Symptoms:**
- Extension popup shows error: "Receiving end does not exist"
- No transactions extracted
- Console shows connection errors

**Cause:**
Content script not properly injected or not ready when message sent.

**Solution:**
Implemented retry logic in `popup.js`:

```javascript
async function injectScript(tabId, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/content.js']
      });
      console.log('Content script injected successfully');
      return true;
    } catch (error) {
      console.log(`Injection attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  return false;
}
```

**Prevention:**
- Always use retry logic for script injection
- Add delays between attempts
- Log each attempt for debugging

---

## Issue: Duplicate Transactions

**Symptoms:**
- CSV contains 1000+ transactions for a single month
- Same transaction appears multiple times
- File is extremely large

**Root Cause:**
Original extraction scanned all payees globally without associating them with specific dates. Each payee appeared under every date header.

**Initial Broken Code:**
```javascript
// WRONG: This finds ALL payees for EACH date
const payees = document.querySelectorAll('.fwWhJc');
dateHeaders.forEach(date => {
  payees.forEach(payee => {
    // Every payee added to every date!
    transactions.push({ date: date, payee: payee });
  });
});
```

**Solution:**
Implemented date-header scoping using DOM position:

```javascript
// CORRECT: Find payees only between this date and next
const allElements = Array.from(document.querySelectorAll('*'));

dateHeaders.forEach((dateHeader, index) => {
  const dateIndex = allElements.indexOf(dateHeader);
  const nextDate = dateHeaders[index + 1];
  const nextDateIndex = nextDate ? allElements.indexOf(nextDate) : Infinity;
  
  // Only get payees between this date and next
  const relevantPayees = allPayees.filter(p => {
    const pIndex = allElements.indexOf(p);
    return pIndex > dateIndex && pIndex < nextDateIndex;
  });
  
  relevantPayees.forEach(payee => {
    transactions.push({ date: dateHeader, payee: payee });
  });
});
```

**Verification:**
After fix, extraction returns ~21 transactions instead of 1660.

---

## Issue: February 1 Transaction Shows Wrong Date

**Symptoms:**
- YMCA $47.00 transaction shows as February 16 instead of February 1
- Date parsing error in console

**Root Cause:**
February 1 uses different CSS class and has "• Rent Day" suffix:

```html
<!-- February 1 date header -->
<div class="iwcRfT">February 1, 2026 • Rent Day</div>

<!-- Regular date header -->
<div class="lkndMw">February 7, 2026</div>
```

**Problems:**
1. Class `iwcRfT` not included in date header selectors
2. "• Rent Day" suffix not handled in date parsing
3. Regex couldn't parse "February 1, 2026 • Rent Day"

**Solution:**

1. **Add class to selectors:**
```javascript
const CONFIG = {
  classes: {
    dateHeader: ['lkndMw', 'iwcRfT'],  // Added 'iwcRfT'
    // ...
  }
};
```

2. **Update date parsing:**
```javascript
function parseDate(dateText) {
  // Remove bullet points and suffixes
  dateText = dateText.split('•')[0].trim();
  
  // Rest of parsing logic...
  const match = dateText.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  // ...
}
```

3. **Add "rent day" to skip patterns** (to filter Rent Day bonus entries):
```javascript
const skipPatterns = [
  // ... other patterns
  'rent day',  // Added
  // ...
];
```

**Verification:**
After fix, YMCA transaction correctly shows as February 1, 2026.

---

## Issue: Transactions Not Found

**Symptoms:**
- Extraction returns 0 transactions
- "No transactions found" message
- Date headers are found but no transactions

**Possible Causes & Solutions:**

### 1. Wrong Page
**Check:** Are you on `https://www.bilt.com/rewards/activity`?
**Solution:** Navigate to correct URL

### 2. CSS Classes Changed
**Check:** Inspect page with DevTools, verify class names
**Solution:** Update `CONFIG.classes` in `content.js`

### 3. Month Not Loaded
**Check:** Is the month dropdown set to a month with transactions?
**Solution:** Select a month from the dropdown on the Bilt page

### 4. All Transactions Filtered
**Check:** Are all transactions being caught by skipPatterns?
**Solution:** Review skipPatterns, may need to adjust

**Debug Script:**
```javascript
// Run in DevTools console on Bilt page
console.log('Date headers:', document.querySelectorAll('.lkndMw, .iwcRfT').length);
console.log('Payees:', document.querySelectorAll('.fwWhJc').length);
console.log('Amounts:', document.querySelectorAll('.lkndMw').length);
```

---

## Issue: Wrong Amounts Extracted

**Symptoms:**
- Amounts don't match what's shown on Bilt page
- Missing dollar signs
- Wrong sign (positive vs negative)

**Root Cause:**
Amount and date elements use same CSS class (`lkndMw`), causing confusion.

**Current Workaround:**
Extraction associates amounts with payees based on DOM position rather than class matching.

**If Issues Persist:**

**Debug Script:**
```javascript
// Run in DevTools console
const amounts = Array.from(document.querySelectorAll('.lkndMw'))
  .filter(el => el.textContent.includes('$'))
  .map(el => el.textContent.trim());
console.log('Amounts found:', amounts);
```

**Solution:**
May need to update extraction logic if Bilt changes their HTML structure.

---

## Issue: CSV Won't Download

**Symptoms:**
- Click "Download CSV" but no file downloads
- Browser blocks download

**Possible Causes:**

### 1. Pop-up Blocker
**Solution:** Allow popups from chrome-extension://

### 2. Storage Permissions
**Check:** Does manifest.json have storage permission?
**Solution:** Add to manifest.json:
```json
{
  "permissions": ["storage"]
}
```

### 3. Large File
**Check:** Is transaction count extremely high?
**Solution:** Check for duplicates (see Issue #2)

---

## Issue: Extension Not Loading

**Symptoms:**
- Extension icon grayed out
- "Extension error" in chrome://extensions/

**Solutions:**

### 1. Check Manifest
```bash
# Validate JSON
python -m json.tool bilt-transactions-export/manifest.json
```

### 2. Reload Extension
1. Go to `chrome://extensions/`
2. Find Bilt Transaction Exporter
3. Click refresh icon
4. Check for error messages

### 3. Check Console
1. Go to `chrome://extensions/`
2. Click "background page" link
3. Check for errors in console

### 4. File Permissions
Ensure all files are readable:
```bash
chmod -R 755 bilt-transactions-export/
```

---

## Debug Mode

**Enable Debug Logging:**

Add to `content.js`:
```javascript
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[Bilt Extractor]', ...args);
}
```

**Useful Debug Output:**
```javascript
// In extractTransactions()
log('Found date headers:', dateHeaders.length);
log('Found payees:', payees.length);
log('Date headers text:', dateHeaders.map(d => d.textContent));
log('Skip patterns:', CONFIG.skipPatterns);
```

---

## Testing Checklist

When fixing issues or updating selectors:

- [ ] Navigate to Bilt activity page
- [ ] Open Chrome DevTools (F12)
- [ ] Run extension
- [ ] Check console for errors
- [ ] Verify transaction count reasonable (20-50 for a month)
- [ ] Check dates are correct
- [ ] Verify payees look like merchants (not "points" or "bonus")
- [ ] Confirm amounts match Bilt page
- [ ] Download CSV and verify format
- [ ] Import test into Actual Budget (optional)

---

## Maintenance: When Bilt Updates UI

### Step 1: Identify Changes
```javascript
// Run in DevTools console
// Find new date header class
const allClasses = new Set();
document.querySelectorAll('*').forEach(el => {
  if (el.className && el.textContent.includes('February')) {
    allClasses.add(el.className);
  }
});
console.log('Classes containing dates:', [...allClasses]);
```

### Step 2: Update CONFIG
Edit `content/content.js`:
```javascript
const CONFIG = {
  classes: {
    dateHeader: ['NEW_CLASS_HERE', 'lkndMw', 'iwcRfT'],
    // ...
  }
};
```

### Step 3: Test
- Reload extension
- Extract transactions
- Verify accuracy

### Step 4: Update Context
Document changes in this file and architecture.md

---

## Getting Help

**Before Asking for Help:**

1. Check Chrome DevTools console for errors
2. Run debug script above to check element counts
3. Verify you're on correct URL
4. Try reloading extension
5. Check if Bilt UI has changed (compare with screenshots)

**Information to Provide:**
- Chrome version
- Extension version (from manifest.json)
- Error messages from console
- Number of date headers found (from debug script)
- Number of payees found
- Example of incorrect data (if any)

---

## Related Documentation

- [Architecture](./architecture.md) - System design
- [API Reference](./api-reference.md) - Function documentation
- [Project Navigation](../navigation.md) - Return to project overview
