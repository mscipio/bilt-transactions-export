# Context Navigation: BILTscraper Project

## Project Overview
Chrome browser extension for extracting Bilt Rewards transaction data and exporting to CSV format compatible with Actual Budget.

**Status**: ✅ Complete and Working  
**Primary Component**: `bilt-transactions-export/` Chrome Extension  
**Approach**: DOM-first extraction with OCR fallback capability

---

## Quick Links

| Domain | Purpose | Navigate |
|--------|---------|----------|
| **project-intelligence/bilt-extension/** | Technical docs, architecture, API | [Navigate →](./project-intelligence/bilt-extension/navigation.md) |
| **core/** | Code quality standards | [Navigate →](./core/navigation.md) |

---

## Project History

### What Was Built
A Chrome extension that:
1. Injects content script into Bilt Rewards activity page
2. Extracts transaction data from DOM using specific CSS class selectors
3. Filters non-transaction entries (points, rewards, promotions)
4. Handles multiple date formats including "Today", "Yesterday", "Rent Day"
5. Exports clean CSV for import into Actual Budget

### Key Technical Achievements
- **Duplicate elimination**: Fixed issue where transactions were duplicated 10-100x
- **Date parsing**: Handles "February 1, 2026 • Rent Day" format with bullet separator
- **Transaction filtering**: Excludes points, Bilt Mastercard, 2X Points, Rent Day bonuses
- **No OCR needed**: DOM extraction is robust enough without fallback

### Problems Solved
1. Initial "Receiving end does not exist" errors → Fixed with retry logic in popup.js
2. Massive duplication (1660 transactions) → Fixed with date-header-scoped extraction
3. Feb 1 transaction showing as Feb 16 → Fixed regex to split on "•" and class detection

---

## Directory Structure

```
BILTscraper/
├── bilt-transactions-export/          # Main extension code
│   ├── manifest.json                  # Extension config
│   ├── popup/                         # UI (HTML, CSS, JS)
│   ├── content/                       # DOM extraction script
│   ├── background/                    # Service worker
│   ├── modules/                       # Utilities (CSV, utils)
│   ├── lib/                           # Tesseract OCR (unused but available)
│   └── icons/                         # SVG icons
├── planning/                          # Original design documents
├── .opencode/context/                 # This documentation (NEW)
└── .tmp/                              # Session files
```

---

## Maintenance Notes

**Last Updated**: 2026-02-16  
**Extension Version**: 1.0  
**Tested On**: Chrome latest, Bilt Rewards website (Feb 2026)

If Bilt changes their HTML structure, update:
- `content/content.js` - CSS class selectors in `CONFIG.classes`
- `content/content.js` - Date parsing regex in `parseDate()`

**Contact**: Update context files when making changes to maintain documentation.
