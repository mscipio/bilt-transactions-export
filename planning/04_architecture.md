# Architecture overview (Chrome Extension: Bilt Transactions OCR -> CSV)

## Module overview
- CaptureModule: Handles full-page scrolling capture and stitching into a single image.
- DominExtractionModule: Robust DOM-based extraction of the transactions table from the page DOM when available.
- OCRModule: Performs optical character recognition on the captured image; supports on-device OCR with a fallback to cloud OCR if enabled.
- ParserModule: Normalizes and parses extracted data into structured rows representing transactions.
- CSVModule: Generates a CSV file and optional column-mapping metadata for Actual Budget import.
- UI/PopupModule: Provides the user interface for initiating capture, showing progress, and downloading the CSV.
- PersistenceModule: Manages temporary session data in .tmp/sessions and context.md for downstream tasks.

// New/updated: DOM extraction module concept
- DOMExtractionModule: Dedicated logic to parse the page's DOM to identify and extract transactions without OCR when possible.
- Interface example:
-    extractTransactionsFromDom(root: HTMLElement) => Transaction[]
-    detectDateHeaders(root: HTMLElement) => Array<{dateText: string, startIndex: number}>
- Data model: Transaction { date: string, payee: string, amount: number, currency?: string, category?: string, memo?: string }
- CaptureModule: Handles full-page scrolling capture and stitching into a single image.
- DominExtractionModule: Efficiently detects and extracts the transactions table from the DOM when available.
- OCRModule: Performs optical character recognition on the captured image; supports on-device OCR with a fallback to cloud OCR if enabled.
- ParserModule: Normalizes and parses extracted data into structured rows representing transactions.
- CSVModule: Generates a CSV file and optional column-mapping metadata for Actual Budget import.
- UI/PopupModule: Provides the user interface for initiating capture, showing progress, and downloading the CSV.
- PersistenceModule: Manages temporary session data in .tmp/sessions and context.md for downstream tasks.

## Data models
- Transaction: { date: string, description: string, amount: number, currency?: string, category?: string, memo?: string }
- CSV schema: date, description/payee, amount, category, memo (adjustable via mapping UI)
- SessionContext: metadata about the current planning/run, status, timestamps, and task references.

## Interfaces / API surface
- CaptureModule.captureFullPage(url) -> Promise<ImageData>
- DominExtractionModule.extractTable(image) -> Promise<Array<Transaction>>
- OCRModule.run(image, options) -> Promise<Array<Transaction>>
- ParserModule.normalize(rawRows) -> Array<Transaction>
- CSVModule.toCSV(transactions, headers) -> Blob or downloadable string
- PersistenceModule.saveContext(contextMd) -> void

## Extensibility notes
- Easily swap OCR engine (on-device vs cloud) via a single interface.
- Abstract DOM parsing to support future variations in Bilt's transactions page or other sites.
- Localize or adapt to other Budget import formats with a mapping layer.
