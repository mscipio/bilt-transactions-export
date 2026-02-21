# Codebase Map: BILTscraper

## Project Overview
Chrome extension for extracting Bilt Rewards credit card transactions to CSV format for Actual Budget import.

## Directory Structure

```
BILTscraper/
├── .context/                     # Context vault (Librarian)
│   ├── map.md                    # This file
│   ├── progress.md               # Progress ledger
│   ├── tech_stack.md             # Tech blueprint
│   └── history/                  # Archived versions
├── .opencode/                    # OpenCode agent configuration
│   ├── agents/                   # Agent definitions
│   ├── skills/                   # Agent skills
│   ├── commands/                  # Agent commands
│   └── hooks/                    # Lifecycle hooks
├── bilt-transactions-export/     # Chrome extension root
│   ├── manifest.json             # Extension manifest (MV3)
│   ├── content/
│   │   └── content.js            # Content script (DOM extraction)
│   ├── popup/
│   │   ├── popup.js              # Extension popup UI
│   │   ├── popup.html            # Popup HTML structure
│   │   └── popup.css             # Popup styling
│   ├── background/
│   │   └── background.js         # Service worker
│   ├── modules/
│   │   └── csv.js                # CSV generation module
│   └── icons/                    # Extension icons
├── planning/                     # Project planning documents
├── opencode.json                 # OpenCode config
└── AGENTS.md                     # Agent workflow definition
```

## File Index

### Core Extension Files

| File | Hash (SHA-256) | Description | Exports/Classes |
|------|----------------|-------------|-----------------|
| `manifest.json` | `d79656709cff10229ed09761a76190214693f941a5fc0b52cbea05219ded82df` | Chrome extension manifest v3 | Extension metadata, permissions |
| `content/content.js` | `fe2056a0aa8636b9cb38b758d67e7e2d4c2f45c6560ea3bbb5af2822db2891c0` | DOM transaction extractor | `BiltTransactionExtractor` |
| `popup/popup.js` | `86539c769db4e9f6d165d4159d4ea2e69a98f0c4f7899a63bcbaf982becec425` | Popup UI controller | `PopupController` |
| `popup/popup.html` | `23ee126727ecc8666f355cfb16354f33a303fe26eb08432acec97aebc00f411f` | Popup HTML structure | - |
| `popup/popup.css` | `8a9019d702e63fc92c8317e771ef8e674b4302d939aed7cb67f6fe060cb25da1` | Popup styling | - |
| `background/background.js` | `6f46b9f8ad4f3a42dc3fd58ee9c968fd2bc68dd202d5c47309ed6bc00420374c` | Service worker | Installation/Startup handlers |
| `modules/csv.js` | `b1066f7f2382060954f08c12bafc1f9ab859159fa08b6c66b21ff7ae953259e2` | CSV generation utilities | `CSVGenerator` |
| `icons/icon16.png` | - | 16x16 extension icon | - |
| `icons/icon48.png` | - | 48x48 extension icon | - |
| `icons/icon128.png` | - | 128x128 extension icon | - |
| `README.md` | `17f7c8c928adb65d1a4ea1d7cbd4a93cc66608067245d3ba09b978a0b20edf02` | Project documentation (v1.0.4) - Features, installation, usage | - |

### Planning Documents
- `planning/01_context.md` - Project context and stakeholders
- `planning/02_requirements.md` - Feature requirements
- `planning/03_design_concepts.md` - Design approaches
- `planning/04_architecture.md` - Technical architecture
- `planning/05_workplan.md` - Implementation workplan
- `planning/06_dom_extraction.md` - DOM extraction strategy
- `planning/06_example_screenshot.md` - Example screenshots

## Symbols (Public APIs)

### BiltTransactionExtractor (content/content.js)
- `extract()` - Main extraction method
- `findDateHeaders(elements)` - Locate date group headers
- `findTransactionsInRange(elements, start, end)` - Extract transactions in range
- `extractTransaction(element, date)` - Parse single transaction
- `parseDate(text)` - Parse date string to YYYY-MM-DD
- `getFilterSelection()` - Get current filter dropdown value
- `sanitizeFilename(text)` - Clean text for filename

### PopupController (popup/popup.js)
- `init()` - Initialize popup
- `handleExtract()` - Trigger transaction extraction
- `handleDownload()` - Download CSV file
- `generateCSV(transactions)` - Generate CSV string
- `escapeCSV(value)` - Escape CSV special chars
- `displayPreview()` - Show transaction preview

### CSVGenerator (modules/csv.js)
- `generate(transactions, options)` - Generate CSV string
- `formatTransaction(transaction, headers)` - Format single row
- `formatAmount(amount)` - Format currency
- `escapeCSV(value)` - Escape CSV values
- `download(csvContent, filename)` - Trigger file download
- `parse(csvString)` - Parse CSV back to objects
- `validate(csvString)` - Validate CSV format

## Tech Stack
- **Runtime**: Chrome Extension (Manifest V3)
- **Language**: JavaScript (ES6+)
- **Target**: Actual Budget CSV import

---
*Generated: 2026-02-20 | Version: 1.0.0*
