# Codebase Map: BILTscraper

## Project Overview
Chrome extension for extracting Bilt Rewards credit card transactions to CSV format for Actual Budget import.

## Directory Structure

```
BILTscraper/
├── .opencode/                    # OpenCode agent configuration
│   ├── context/                  # Context vault (this file)
│   ├── skills/                   # Agent skills
│   ├── agents/                   # Agent definitions
│   ├── commands/                 # Agent commands
│   └── hooks/                    # Lifecycle hooks
├── bilt-transactions-export/     # Chrome extension root
│   ├── manifest.json             # Extension manifest (MV3)
│   ├── content/
│   │   └── content.js            # Content script (DOM extraction)
│   ├── popup/
│   │   └── popup.js              # Extension popup UI
│   ├── background/
│   │   └── background.js         # Service worker
│   ├── modules/
│   │   └── csv.js                # CSV generation module
│   ├── lib/
│   │   └── tesseract.min.js      # OCR library (fallback)
│   └── icons/                    # Extension icons
├── planning/                     # Project planning documents
│   ├── 01_context.md
│   ├── 02_requirements.md
│   ├── 03_design_concepts.md
│   ├── 04_architecture.md
│   ├── 05_workplan.md
│   └── 06_dom_extraction.md
├── opencode.json                 # OpenCode config
└── AGENTS.md                     # Agent workflow definition
```

## File Index

### Core Extension Files

| File | Hash (SHA-256) | Description | Exports/Classes |
|------|----------------|-------------|-----------------|
| `manifest.json` | `49cd6b37...` | Chrome extension manifest v3 | Extension metadata, permissions |
| `content/content.js` | `fe2056a0...` | DOM transaction extractor | `BiltTransactionExtractor` |
| `popup/popup.js` | `86539c76...` | Popup UI controller | `PopupController` |
| `background/background.js` | `e23baa97...` | Service worker | `handleCaptureTab()` |
| `modules/csv.js` | `b1066f7f...` | CSV generation utilities | `CSVGenerator` |

### Planning Documents
- `planning/01_context.md` - Project context and stakeholders
- `planning/02_requirements.md` - Feature requirements
- `planning/03_design_concepts.md` - Design approaches
- `planning/04_architecture.md` - Technical architecture
- `planning/05_workplan.md` - Implementation workplan
- `planning/06_dom_extraction.md` - DOM extraction strategy

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
- **Libraries**: Tesseract.js (OCR fallback)
- **Target**: Actual Budget CSV import

---
*Generated: 2026-02-20 | Version: 1.0.0*
