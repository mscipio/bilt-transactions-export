# Bilt Transactions Export

A Chrome browser extension that extracts transaction data from the Bilt Rewards website and exports it to CSV format compatible with Actual Budget and other personal finance applications.

![Version](https://img.shields.io/badge/version-1.0.4-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [What It Does](#what-it-does)
- [Features](#features)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [CSV Format](#csv-format)
- [Troubleshooting](#troubleshooting)
- [Privacy & Security](#privacy--security)
- [Development](#development)

## What It Does

This extension helps you export your Bilt Rewards credit card transactions so you can import them into budgeting software like **Actual Budget**. Instead of manually copying transaction data, this tool automatically extracts:

- **Transaction dates** - Converted to standard YYYY-MM-DD format
- **Payee/Merchant names** - Clean descriptions of where you spent money
- **Transaction amounts** - Negative for expenses, positive for credits (Actual Budget compatible)

The extension runs entirely in your browser and processes all data locally on your device.

## Features

✅ **One-Click Extraction** - Extract all visible transactions with a single click  
✅ **Smart DOM Parsing** - Automatically identifies transaction data on Bilt pages (no OCR)  
✅ **Filter-Based Filenames** - CSV files named after your selected date range (e.g., "February 2026")  
✅ **Live Preview** - See extracted transactions before downloading  
✅ **CSV Export** - Generates properly formatted CSV files for easy import  
✅ **Actual Budget Compatible** - Expenses exported as negative, credits as positive  
✅ **Privacy-First** - No data sent to external servers  
✅ **Local Processing** - All extraction happens on your device  
✅ **Duplicate Detection** - Automatically removes duplicate transactions  

## Installation

### Method 1: Chrome Web Store (Coming Soon)

Once published, you'll be able to install directly from the Chrome Web Store.

### Method 2: Developer Mode (Current)

Since this extension is not yet published, you'll need to install it in developer mode:

1. **Download the extension**
   ```bash
   git clone https://github.com/mscipio/bilt-transactions-export.git
   ```
   Or download and extract the ZIP file from GitHub

2. **Open Chrome Extensions page**
   - Type `chrome://extensions/` in your Chrome address bar
   - Press Enter

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner
   - You should see new buttons appear

4. **Load the Extension**
   - Click the **"Load unpacked"** button
   - Navigate to the `bilt-transactions-export/bilt-transactions-export` folder
   - Click **"Select"**

5. **Verify Installation**
   - You should see "Bilt Transactions Export" in your extensions list
   - The extension icon will appear in your Chrome toolbar (you may need to pin it)

### Pinning the Extension (Recommended)

1. Click the puzzle piece icon 🧩 in Chrome's toolbar
2. Find "Bilt Transactions Export" in the list
3. Click the pin icon 📌 next to it
4. The extension icon will now stay visible in your toolbar

## How to Use

### Step 1: Navigate to Bilt Rewards

1. Go to [Bilt Rewards](https://www.biltrewards.com) and log in to your account
2. Navigate to your **transactions page** (usually under "Activity" or "Transactions")
3. **Important**: Make sure transactions are visible on the page
   - Scroll down to load more transactions if needed
   - The extension can only extract what's currently displayed

### Step 2: Extract Transactions

1. Click the **Bilt Export** icon in your Chrome toolbar
2. The popup will show your current status
3. Click the **"Extract Transactions"** button
4. Wait for the extraction to complete (you'll see a progress bar)

### Step 3: Review & Download

1. Review the preview showing the first 10 transactions
2. Check that the transaction count looks correct
3. Click **"Download CSV"** to save the file
4. Choose where to save the file (default name: `bilt-transactions-{filter-selection}.csv`, e.g., `bilt-transactions-February-2026.csv`)

### Step 4: Import to Actual Budget

1. Open Actual Budget
2. Go to the account where you want to import transactions
3. Click **"Import Transactions"** or similar
4. Select the downloaded CSV file
5. Map the columns if needed:
   - Date → Date
   - Payee → Payee
   - Amount → Amount

## CSV Format

The exported CSV file contains these columns:

| Column | Format | Example |
|--------|--------|---------|
| **Date** | YYYY-MM-DD | 2026-02-14 |
| **Payee** | Text | Starbucks |
| **Amount** | Number (positive/negative) | -12.50 |
| **Category** | Empty | (for manual entry) |
| **Memo** | Empty | (for notes) |

### Amount Sign Convention

- **Negative amounts** (-12.50) = Money you spent (debit)
- **Positive amounts** (50.00) = Money received (credit/refund)

## Troubleshooting

### "Please navigate to the Bilt Rewards transactions page"

**Problem**: You're not on a Bilt Rewards URL  
**Solution**: 
- Make sure you're on `https://www.biltrewards.com`
- Navigate to the Activity/Transactions section
- The URL should contain "bilt.com" or "biltrewards.com"

### "No transactions found"

**Problem**: The extension can't find transaction data  
**Solutions**:
1. Make sure transactions are **visible** on the page (scroll down)
2. **Refresh the page** and try again
3. Check that you're on the correct Bilt page
4. Look at the browser console (F12) for debug information

### "Cannot connect to page"

**Problem**: The content script isn't loading  
**Solutions**:
1. **Refresh the Bilt page** completely
2. Check that the extension has permission to run on bilt.com
3. Try disabling and re-enabling the extension
4. Reload the extension from `chrome://extensions/`

### Extension icon not showing

**Problem**: The extension isn't pinned  
**Solution**:
1. Click the puzzle piece 🧩 icon in Chrome
2. Find "Bilt Transactions Export"
3. Click the pin icon 📌

### Download not working

**Problem**: Browser blocking download  
**Solutions**:
1. Check your Downloads folder
2. Make sure Chrome has permission to download files
3. Try using "Save As" to choose a specific location

## Privacy & Security

### What We Collect

**Nothing.** This extension:
- ✅ Does NOT collect personal data
- ✅ Does NOT track your browsing
- ✅ Does NOT send data to external servers
- ✅ Does NOT store data after you close the popup

### What We Access

The extension only accesses:
- **Bilt Rewards pages** (to extract transaction data)
- **Browser storage** (to save your preferences)
- **Downloads** (to save the CSV file)

### Data Processing

All processing happens **locally on your device**:
1. Data is extracted from the webpage
2. Processed in your browser
3. Saved as a CSV file on your computer
4. **No data leaves your device**

## Development

### Project Structure

```
bilt-transactions-export/
├── manifest.json          # Extension configuration
├── background/
│   └── background.js      # Service worker for tab capture
├── content/
│   └── content.js         # Content script (runs on Bilt pages)
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styles
├── modules/
│   └── csv.js             # CSV generation utilities
└── icons/
    ├── icon16.png         # Toolbar icon (Bilt brand)
    ├── icon48.png         # Extension page icon (Bilt brand)
    └── icon128.png        # Chrome Web Store icon (Bilt brand)
```

### Technologies Used

- **Manifest V3** - Latest Chrome extension format
- **Vanilla JavaScript** - No frameworks needed
- **Chrome Extension APIs**:
  - `chrome.tabs` - Tab management
  - `chrome.scripting` - Content script injection
  - `chrome.storage` - Local settings storage
  - `chrome.downloads` - File downloads

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/mscipio/bilt-transactions-export.git
   cd bilt-transactions-export/bilt-transactions-export
   ```

2. Make your changes to the source files

3. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click the refresh 🔄 icon on the extension
   - Or press `Cmd+R` (Mac) / `Ctrl+R` (Windows)

4. Test on the Bilt Rewards transactions page

### Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 88+ | ✅ Supported |
| Edge | 88+ | ✅ Supported |
| Brave | Latest | ✅ Supported |
| Firefox | - | ❌ Not supported (Manifest V3 differences) |

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Having issues?

1. Check the [Troubleshooting](#troubleshooting) section above
2. Open the browser console (F12) and look for error messages
3. [Open an issue](https://github.com/mscipio/bilt-transactions-export/issues) on GitHub

## Credits

- Built with ❤️ for the Bilt Rewards community
- Inspired by the need for better budgeting tool integrations

---

**Disclaimer**: This is an unofficial extension and is not affiliated with or endorsed by Bilt Rewards. Use at your own risk. Always verify exported data before importing into financial software.