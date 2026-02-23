# Bilt Transactions Export

A Chrome browser extension that extracts transaction data from the Bilt Rewards website and exports it to CSV format compatible with Actual Budget and other personal finance applications.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📥 Download & Install

[![Download Extension](https://img.shields.io/badge/Download%20Extension-v1.1.0-brightgreen?style=for-the-badge&logo=googlechrome)](https://github.com/mscipio/bilt-transactions-export/releases/download/v1.1.0/bilt-transactions-export-v1.1.0.zip)

**[⬇️ Download Latest Release (v1.1.0)](https://github.com/mscipio/bilt-transactions-export/releases/download/v1.1.0/bilt-transactions-export-v1.1.0.zip)**

*Latest: Release v1.1.0*

Extract the ZIP and follow the [installation instructions](#installation) below.

## 📋 What This Repository Contains

This repository includes:
- **Complete Chrome Extension** (`bilt-transactions-export/`) - Ready to install and use
- **Project Context** (`.context/`) - Planning documents and project intelligence
- **Development System** (`.opencode/`) - OpenCode agent system for automated development

## 🚀 Quick Start

### Installation

**Option 1: Download Release (Recommended)**

1. **[Download the latest release](https://github.com/mscipio/bilt-transactions-export/releases/download/v1.1.0/bilt-transactions-export-v1.1.0.zip)**
2. **Extract the ZIP file** to a folder on your computer
3. **Install in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the extracted `bilt-transactions-export` folder

**Option 2: Clone Repository (For Developers)**

```bash
git clone https://github.com/mscipio/bilt-transactions-export.git
```

Then follow step 3 above, selecting the `bilt-transactions-export` folder.

4. **Pin the extension**
   - Click the puzzle piece 🧩 icon in Chrome's toolbar
   - Find "Bilt Transactions Export" and click the pin 📌 icon

### Usage

1. Go to [Bilt Rewards](https://www.biltrewards.com) and navigate to your transactions page
2. Make sure transactions are visible (scroll down to load more)
3. Click the **Bilt Export** icon in your toolbar
4. Click **Extract Transactions** in the popup
5. Watch the progress indicator as transactions are extracted
6. Review the **live preview** table showing transaction details
7. Click **Download CSV** to save the file
8. Import the CSV into Actual Budget or your preferred finance app

## 📖 Full Documentation

For detailed instructions, troubleshooting, and development info, see the **[extension README](bilt-transactions-export/README.md)**.

## ✨ Features

- ✅ **One-Click Extraction** - Extract all visible transactions instantly
- ✅ **All Transaction Types** - Detects Bilt card, dining, shopping, and rent payments
- ✅ **Smart DOM Parsing** - Position-based DOM traversal for robust extraction
- ✅ **Live Preview** - See extracted transactions before downloading
- ✅ **CSV Export** - Generates properly formatted CSV files
- ✅ **Actual Budget Compatible** - Expenses as negative, credits as positive
- ✅ **Privacy-First** - No data sent to external servers
- ✅ **Local Processing** - All extraction happens on your device
- ✅ **Duplicate Detection** - Automatically removes duplicate transactions
- ✅ **Progress Indicator** - Visual feedback during extraction
- ✅ **Smart Filenames** - Uses date/filter selection for CSV filenames
- ✅ **Auto Script Injection** - Automatically loads content script if needed
- ✅ **Status Indicator** - Shows ready/processing/error states
- ✅ **Enhanced Error Handling** - Helpful tips when extraction fails
- ✅ **Pending Transaction Filter** - Option to exclude pending transactions

## 🔒 Privacy & Security

**This extension collects NO personal data.** All processing happens locally on your device:
- ✅ No data sent to external servers
- ✅ No tracking or analytics
- ✅ No data stored after you close the popup
- ✅ Only accesses Bilt Rewards pages to extract data

## 🏗️ Project Structure

```
bilt-transactions-export/
├── bilt-transactions-export/     # Chrome extension source code
│   ├── manifest.json
│   ├── background/
│   ├── content/
│   ├── popup/
│   ├── modules/
│   └── README.md                 # Detailed extension documentation
├── .context/                     # Project context and planning
│   ├── plans/
│   ├── progress.md
│   └── map.md
└── .opencode/                    # OpenCode agent system
    ├── agents/
    ├── skills/
    └── rules/
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

Having issues?
1. Check the [detailed troubleshooting guide](bilt-transactions-export/README.md#troubleshooting)
2. Open the browser console (F12) and look for error messages
3. [Open an issue](https://github.com/mscipio/bilt-transactions-export/issues) on GitHub

---

**Disclaimer**: This is an unofficial extension and is not affiliated with or endorsed by Bilt Rewards. Use at your own risk. Always verify exported data before importing into financial software.
