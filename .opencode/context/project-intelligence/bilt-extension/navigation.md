# Bilt Extension: Navigation

## Overview
Complete technical documentation for the Bilt Rewards transaction extractor Chrome extension.

**Status**: Production Ready ✅  
**Last Updated**: 2026-02-16  
**Maintainer**: Project team

---

## Documentation Files

### Core Documentation

| File | Purpose | Status |
|------|---------|--------|
| **[architecture.md](./architecture.md)** | System design, components, data flow | Complete |
| **[api-reference.md](./api-reference.md)** | DOM selectors, functions, interfaces | Complete |
| **[troubleshooting.md](./troubleshooting.md)** | Common issues and solutions | Complete |

### External References

| Reference | Location | Description |
|-----------|----------|-------------|
| **Extension Code** | `bilt-transactions-export/` | Source code directory |
| **Planning Docs** | `planning/` | Original design documents |
| **Test Data** | User's Bilt account | Real-world validation |

---

## Quick Reference

### Key Files
```
bilt-transactions-export/
├── content/content.js          # Main extraction logic
├── popup/popup.js              # UI controller
├── modules/csv.js              # CSV generation
└── manifest.json               # Extension config
```

### DOM Selectors (as of 2026-02-16)
```javascript
const CONFIG = {
  classes: {
    dateHeader: ['lkndMw', 'iwcRfT'],  // Date headers (includes Rent Day variant)
    payee: 'fwWhJc',                    // Payee names
    amount: 'lkndMw',                   // Transaction amounts
    transactionContainer: 'sc-eXnvfo'   // Transaction rows
  }
}
```

### Date Formats Handled
- "Today" → Current date
- "Yesterday" → Yesterday's date
- "February 14, 2026" → Parsed date
- "February 1, 2026 • Rent Day" → Parsed date (split on •)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-16 | Initial working release |
| 1.0.1 | 2026-02-16 | Fixed Feb 1 date parsing with Rent Day suffix |

---

## Next Steps / Maintenance

1. **Monitor Bilt UI Changes**: If transactions stop extracting, check if CSS classes changed
2. **Add Month Selection**: Currently extracts visible month only
3. **OCR Fallback**: Tesseract is included but unused - implement if DOM changes break extraction
4. **Unit Tests**: Add automated tests for date parsing functions

---

## Related Context

- [Core Navigation](../../core/navigation.md) - Code quality standards
- [Project Root Navigation](../../navigation.md) - High-level project overview
