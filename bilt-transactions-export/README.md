# Bilt Transactions Export

A Chrome browser extension that extracts transaction data from the Bilt Rewards website and exports it to CSV format compatible with Actual Budget import.

## Features

- **DOM-Based Extraction**: Primary extraction method parses the page DOM directly for maximum accuracy
- **OCR Fallback**: Uses Tesseract.js for OCR-based extraction if DOM parsing fails
- **Local Processing**: All data processing happens locally on your device
- **Privacy-Focused**: No data is sent to external servers (unless you enable cloud OCR)
- **CSV Export**: Generates properly formatted CSV files for Actual Budget import

## Installation

### From Source (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `bilt-transactions-export` folder
6. The extension icon should appear in your Chrome toolbar

### Icons Setup

Before using, you need to add icon files:

1. Create three PNG icons (16x16, 48x48, 128x128 pixels) in the `icons/` folder
2. Name them: `icon16.png`, `icon48.png`, `icon128.png`
3. Icons should represent the Bilt brand or export functionality

## Usage

1. Navigate to the Bilt Rewards transactions page (`https://www.biltrewards.com/...`)
2. Ensure transactions are visible on the page
3. Click the extension icon in the Chrome toolbar
4. Click "Extract Transactions"
5. Review the preview (first 10 transactions shown)
6. Click "Download CSV" to save the file
7. Import the CSV into Actual Budget

## How It Works

### DOM Extraction (Primary Method)

The extension analyzes the page structure to:
1. Find date headers (e.g., "February 14, 2026", "Yesterday")
2. Locate transaction blocks under each date
3. Extract payee names and amounts
4. Normalize dates to ISO format (YYYY-MM-DD)

### OCR Fallback (Secondary Method)

If DOM extraction fails:
1. Captures a screenshot of the page
2. Runs Tesseract.js OCR locally
3. Parses OCR text to extract transactions
4. Falls back gracefully if OCR also fails

## CSV Format

The exported CSV includes these columns:

| Column | Description |
|--------|-------------|
| Date | Transaction date (YYYY-MM-DD) |
| Payee | Merchant or transaction description |
| Amount | Transaction amount (negative for debits) |
| Category | Empty (for manual categorization) |
| Memo | Empty (for notes) |

## Supported Date Formats

- Full dates: "February 14, 2026"
- Relative: "Today", "Yesterday"
- Standard: "MM/DD/YYYY"

## Architecture

```
bilt-transactions-export/
├── manifest.json          # Extension configuration
├── popup/                 # Extension popup UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/               # Content script (runs on Bilt pages)
│   └── content.js
├── background/            # Service worker
│   └── background.js
├── modules/               # Shared modules
│   ├── dom-extractor.js  # DOM extraction logic
│   ├── csv.js            # CSV generation
│   └── utils.js          # Utility functions
├── lib/                   # Third-party libraries
│   └── tesseract.min.js  # OCR engine
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Technical Details

### DOM Selectors Used

Based on analysis of the Bilt Rewards page structure:
- Date headers: Identified by date pattern matching
- Payee elements: `p[class*="fwWhJc"]`, `p[class*="fhbElE"]`
- Amount detection: Pattern matching for `$XXX.XX`

### Browser Compatibility

- Chrome 88+ (Manifest V3)
- Edge 88+ (Chromium-based)
- Other Chromium browsers supporting Manifest V3

## Troubleshooting

### "No transactions found" Error

1. Make sure you're on the Bilt Rewards transactions page
2. Ensure transactions are visible (scroll to load more if needed)
3. Try refreshing the page
4. Enable "Use OCR if DOM extraction fails" option

### Extension Not Working

1. Check that the extension is enabled in `chrome://extensions/`
2. Verify you're on a Bilt Rewards URL
3. Check the browser console for error messages
4. Try reloading the extension

### OCR Not Working

1. OCR requires page screenshot permission
2. Some pages may block screenshot capture
3. Try the DOM extraction method instead

## Privacy & Security

- **No External Servers**: Data is processed entirely on your device
- **No Tracking**: No analytics or tracking scripts
- **Local Storage Only**: Settings stored in browser's local storage
- **Optional Cloud OCR**: Cloud OCR can be enabled but requires explicit user consent

## Development

### Building from Source

No build step required - the extension runs directly from source files.

### Testing

1. Load the extension in Chrome developer mode
2. Navigate to Bilt Rewards transactions page
3. Test extraction with various transaction types
4. Verify CSV output format

### File Structure Notes

- `content.js` is injected into Bilt pages automatically
- `popup.js` runs in the extension popup context
- `background.js` runs as a service worker
- Modules in `modules/` are shared across contexts

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Open an issue on the repository

## Credits

- Tesseract.js for OCR functionality
- Bilt Rewards for the transaction data format
