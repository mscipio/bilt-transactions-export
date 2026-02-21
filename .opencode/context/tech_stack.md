# Tech Stack Blueprint: BILTscraper

## Primary Technologies

| Category | Technology | Version/Details |
|----------|------------|-----------------|
| **Platform** | Chrome Extension | Manifest V3 |
| **Language** | JavaScript | ES6+ |
| **Build** | None (pure JS) | - |

## Framework & Libraries

### No External Package Manager
This project does not use npm/yarn/pnpm. All dependencies are bundled directly in the extension.

## Architecture Patterns

### Extension Architecture
- **Content Script**: `BiltTransactionExtractor` - DOM-based extraction
- **Popup UI**: `PopupController` - User interaction
- **Background**: Service Worker - Tab capture coordination
- **Shared Module**: `CSVGenerator` - CSV formatting (reused across contexts)

### Extraction Strategy
- **Primary**: DOM-based extraction using CSS class selectors

## File Structure Conventions

```
bilt-transactions-export/
├── {feature}/           # Feature folder (content, popup, background)
│   ├── {feature}.js     # Main entry point
│   └── {feature}.html   # HTML for popup (if applicable)
└── modules/             # Shared utilities
    └── csv.js
```

## Key Permissions
- `activeTab` - Access current tab
- `downloads` - Save CSV files
- `storage` - Extension settings
- `scripting` - Inject scripts

## Host Permissions
- `https://*.bilt.com/*`
- `https://*.biltrewards.com/*`

## Browser API Usage
- `chrome.tabs.query()` - Get active tab
- `chrome.tabs.sendMessage()` - Communicate with content script
- `chrome.scripting.executeScript()` - Inject content script
- `chrome.downloads.download()` - Trigger file download
- `chrome.storage.local` - Persist settings

---
*Generated: 2026-02-20 | Version: 1.0.0*
