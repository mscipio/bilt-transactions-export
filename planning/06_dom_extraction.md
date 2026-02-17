# Planning: DOM Extraction Strategy for Bilt Rewards Transactions

This document defines how we will extract transactions from the Bilt Rewards activity page using DOM-based parsing as the primary path, with OCR as a fallback.

Observations from provided HTML snippet (February 2026 full-scroll page)
- The page is built with a complex React-like structure and numerous nested divs with dynamic class names (sc-*, Mui*). The transaction rows are not in a traditional HTML table.
- Each date section appears as a header (e.g., February 14, 2026, Yesterday) followed by a series of transaction blocks.
- Each transaction block contains at least: Payee/Description and Amount. The Payee text is typically in a paragraph element with class containing fwWhJc or similar, and the Amount is in a paragraph with class lkndMw.
- There are icons, additional fields (category/notes) that might be present or absent depending on the row.

Strategy overview
- Primary path: Traverse the DOM to locate date headers and then collect subsequent transaction blocks until the next date header.
- Secondary path (fallback): If no reliable DOM structure is detected for a given month, switch to an ROI-based full-page screenshot and OCR flow (as planned in Concept B).
- ROI planning: Define a region of interest that includes the central list area containing transactions; otherwise, OCR will capture the rest of the content.

Data model (TypeScript-like)
- type Transaction = {
  date: string; // ISO YYYY-MM-DD
  payee: string;
  amount: number; // can be negative for expenses
  currency?: string;
  category?: string;
  memo?: string;
  raw?: string; // optional raw text for debugging
}

DOM extraction workflow (high level)
- Step 1: Identify the root container for the transaction list. Potential anchors:
  - main#universal-layout-content
  - div[aria-label*="Rewards"], div[id^="shadowLL"]
- Step 2: Locate date headers by scanning for text that matches date patterns or keywords like "Yesterday"/"Today".
- Step 3: For each date header, collect the following sibling blocks as transactions until the next date header or end of list.
- Step 4: For each transaction block, attempt to extract:
  - Payee/Description: prefer text nodes inside elements with plausible payee-like content; fall back to heuristic selectors when class names are unstable.
  - Amount: locate text matching currency format (e.g., $123.45, -$12.34).
- Step 5: Normalize dates to ISO format; convert amounts to numbers; trim whitespace.
- Step 6: Assemble an array of Transaction objects; pass to CSV generator.

Robust selectors (suggested starting points)
- Date headers: xpath-like pattern or CSS selectors that match common date header text, e.g. contains text like /January|February|March|...|Yesterday|Today/
- Transaction row: find direct children of the date section that contain a payee and amount; rely on positional patterns rather than class names when possible.
- Payee: element containing non-numeric text near the amount element (e.g., .fwWhJc, .fhbElE, or any text node under the transaction block).
- Amount: element that contains a $ sign and a numeric value, possibly with commas and decimals.

Error handling and fallbacks
- If a date header or any transaction block cannot be parsed, log the issue and skip gracefully.
- If DOM parsing fails for a whole month, fall back to the OCR-based pipeline (planning/01_context.md references planning/06_example_screenshot.md).

Testing and validation (manual checks)
- Verify that at least 2 sample days produce a non-empty transaction list with correctly parsed Payee, Date, and Amount.
- Validate Date normalization for a mix of explicit dates and relative headers like Yesterday.
- Validate CSV export formatting and that the values map sensibly to Actual Budget fields.

Next steps
- If you approve, I will:
  - Add detailed task JSONs for DOM extraction subtasks in .tmp/tasks/bilt-transactions-ocr-export/subtask_XX.json
  - Update planning/02_requirements.md with DOM extraction requirements and success criteria
  - Update planning/04_architecture.md with API surface for DOMExtractionModule
