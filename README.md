# Bilt Transactions Export

A Chrome browser extension that extracts transaction data from the Bilt Rewards website and exports it to CSV format compatible with Actual Budget and other personal finance applications.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 What This Repository Contains

This repository includes:
- **Complete Chrome Extension** (`bilt-transactions-export/`) - Ready to install and use
- **Planning Documents** (`planning/`) - Project context, requirements, and architecture
- **Development Context** (`.opencode/context/`) - Code quality standards and project intelligence

## 🚀 Quick Start

### Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/mscipio/bilt-transactions-export.git
   ```

2. **Install the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `bilt-transactions-export/bilt-transactions-export` folder

3. **Pin the extension**
   - Click the puzzle piece 🧩 icon in Chrome's toolbar
   - Find "Bilt Transactions Export" and click the pin 📌 icon

### Usage

1. Go to [Bilt Rewards](https://www.biltrewards.com) and navigate to your transactions page
2. Make sure transactions are visible (scroll down to load more)
3. Click the **Bilt Export** icon in your toolbar
4. Click **"Extract Transactions"**
5. Review the preview and click **"Download CSV"**
6. Import the CSV into Actual Budget or your preferred finance app

## 📖 Full Documentation

For detailed instructions, troubleshooting, and development info, see the **[extension README](bilt-transactions-export/README.md)**.

## ✨ Features

- ✅ **One-Click Extraction** - Extract all visible transactions instantly
- ✅ **Smart DOM Parsing** - Automatically identifies transaction data on Bilt pages  
- ✅ **Live Preview** - See extracted transactions before downloading
- ✅ **CSV Export** - Generates properly formatted CSV files
- ✅ **Privacy-First** - No data sent to external servers
- ✅ **Local Processing** - All extraction happens on your device
- ✅ **Duplicate Detection** - Automatically removes duplicate transactions

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
├── planning/                     # Project planning documents
│   ├── 01_context.md
│   ├── 02_requirements.md
│   ├── 03_design_concepts.md
│   └── ...
└── .opencode/context/           # Development context and standards
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