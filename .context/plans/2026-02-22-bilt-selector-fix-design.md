# BILT Transaction Extractor Fix Design (v2)

**Date:** 2026-02-22
**Status:** Draft
**Risk Level:** Low

## Problem Statement

The BILTscraper Chrome extension finds date headers but returns 0 transactions. Root cause: Bilt Rewards website changed their CSS class names (styled-components hashed classes), breaking the transaction extraction selectors.

## User Request

Instead of selector-based fallback, use **position-based DOM traversal** which is more robust and maintainable.

## Root Cause (Confirmed)

| Element | Old Code Uses | Current DOM Uses |
|---------|---------------|------------------|
| Transaction Row | `sc-eXnvfo` | `sc-eXnvfo` |
| Payee | `fwWhJc` | `fhbElE` |
| Amount | `lkndMw` | `lkndMw` |

The payee selector class changed from `fwWhJc` to `fhbElE`.

## Proposed Solution: Position-Based Extraction

Use DOM structure and relative positioning instead of brittle CSS class selectors.

### DOM Structure Analysis

```
<div class="sc-ksXGtu hTvhYZ">          ← Date Header Container
  <p class="sc-mHBLV lkndMw">February 20, 2026</p>
</div>

<div class="sc-iHDLbo gJsNtB">          ← Transaction Container
  <div class="sc-gGvmZl iIwJPe">       ← Transaction Group
    <div class="sc-eGiIjr jWJbdO">
      <div class="gfLzd">
        <div class="sc-eXnvfo iiBxiW"> ← Transaction Row
          <div class="fTzAPR">           ← Icon container
            <svg>...</svg>              ← Bilt card icon (indicator)
          </div>
          <div class="sc-bFPsNx btRzBt">
            <p class="fhbElE">Payee Name</p>  ← Payee (text)
          </div>
          <div class="eoMqfZ">
            <div class="jJgyHg">
              <p class="lkndMw">$50.00</p>   ← Amount (text)
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Algorithm

1. **Find date headers** by text pattern (regex: month/day/year, Today, Yesterday)
2. **Find next sibling** = transaction container
3. **Iterate children** of transaction container:
   - For each child group div, look for transaction rows
   - Transaction row = contains Bilt card icon (data-testid="icon-bilt-card-regular")
   - Extract payee = first text element after icon
   - Extract amount = last text element (should be dollar amount)
4. **Filter out non-transactions**:
   - Skip rows with points icons (not actual transactions)
   - Skip empty amounts (like point redemptions)
5. **Validate**:
   - Amount must be valid currency format
   - Payee must have meaningful text

### Key Classes (for identification only, not selection)

| Purpose | Stable? | Note |
|---------|---------|------|
| Date header text | ✅ | Pattern match on text |
| Card icon | ✅ | `data-testid="icon-bilt-card-regular"` |
| Transaction row | ✅ | Contains card icon |
| Points icon | ✅ | `data-testid="icon-bilt-points-regular"` |

### Implementation Plan

1. Refactor `findDateHeaders` - keep as-is (works)
2. Create `findTransactionContainer(dateHeader)` - find sibling
3. Create `extractTransactionsFromContainer(container)` - iterate and extract
4. Create `isTransactionRow(element)` - check for card icon
5. Create `extractPayee(row)` - get first text after icon
6. Create `extractAmount(row)` - get amount text
7. Add filter for valid transactions (skip points, pending-only)

### Error Handling

- If container not found: try alternative DOM traversal
- If amount parsing fails: skip row, log warning
- If no valid transactions found: return error with debug info

## Testing Strategy

- Manual test with current Bilt transactions page
- Verify all transaction types:
  - Purchases (with card icon)
  - Pending transactions
  - Different date groups (Today, Yesterday, dated)
- Verify points/bonus rows are correctly skipped

## Advantages of This Approach

1. **Robust**: Survives CSS class changes
2. **Maintainable**: No need to update when Bilt changes hashed classes
3. **Future-proof**: DOM structure changes less frequently
4. **Debuggable**: Uses stable identifiers (data-testid, text patterns)

## Rollback Strategy

This is a refactor - old selectors preserved in comments for reference. Low risk.
