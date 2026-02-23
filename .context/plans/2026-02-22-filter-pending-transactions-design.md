# Filter Pending Transactions Design

**Date:** 2026-02-22
**Status:** Approved
**Risk Level:** Low

## Problem Statement
Pending transactions should be excluded from CSV exports because:
1. They may change (amount, merchant name) before posting
2. They haven't been finalized by the bank
3. Importing them into Actual Budget could cause duplicates when posted version appears

## Proposed Solution
Add a new `isPendingTransaction()` method that checks if a transaction container contains "Pending" text. Skip pending transactions during extraction.

## Architecture

### New Method
```javascript
/**
 * Check if transaction is pending (not yet posted)
 * @param {Element} container - The transaction container element
 * @returns {boolean} True if transaction is pending
 */
isPendingTransaction(container) {
  if (!container) return false;
  
  // Check all <p> elements for "Pending" text
  const allPs = container.querySelectorAll('p');
  for (const p of allPs) {
    const text = this.getText(p).trim().toLowerCase();
    if (text === 'pending') {
      return true;
    }
  }
  return false;
}
```

### Integration Point
In `extractTransactionsFromContainer()`, add check after identifying transaction row:
```javascript
if (this.isTransactionRow(row)) {
  // Skip if pending
  if (this.isPendingTransaction(container)) {
    continue;
  }
  // ... rest of extraction
}
```

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Misspelled "Pending" | Low | Use case-insensitive match |
| DOM structure changes | Medium | Use simple text search, not specific class |

## Rollback Strategy
Remove the `isPendingTransaction()` check to restore original behavior.

## Testing Strategy
1. Test with page showing pending transactions → should NOT be extracted
2. Test with page showing only posted transactions → should all be extracted
3. Test with mixed page → only posted transactions extracted
