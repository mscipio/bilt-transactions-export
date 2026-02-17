# Example screenshot analysis: February 2026 Bilt Rewards transactions page

This document captures observations and planning notes derived from the full-scroll screenshot provided for February 2026 transactions.

Observations from the screenshot
- Layout: A long vertical list of transaction blocks with a header area at the top (likely containing page title and filters). Each transaction row shows a date, a description/payee, and a monetary amount aligned to the right. Some transactions appear with a second line for additional details.
- Columns inferred: Date, Description/Payee, Amount. Optional fields (Balance, Category, Memo) are not clearly visible in all rows; may require extraction in a secondary pass.
- Continuity: The page appears to be a single, extended list with repeated blocks for each day; an infinite-scroll or pagination state is not obviously visible in the provided snapshot, but February 2026 is represented in a long list.
- Visual quirks: Some rows show subtle shading to separate transactions; header row height and font size are small, suggesting OCR region needs careful cropping to avoid misreads of column boundaries.
- Edge states to test: end-of-month boundary rows, days with multiple transactions, and days with multiple subtotals or refunds that might appear as separate blocks.

Proposed CSV mapping (baseline)
- Date -> ISO date (YYYY-MM-DD)
- Description/Payee -> string
- Amount -> numeric value (negative for expenses, positive for credits)
- Optional: Category -> string, Memo -> string, Currency -> string (if shown)
- Output header: Date,Description,Amount,Category,Memo,Currency

OCR strategy notes
- Region of interest (ROI): Focus on the vertical band where the transaction list resides, excluding page chrome (filters, header) to improve OCR accuracy.
- Page stitching: If the page spans multiple viewport heights, ensure stitched image retains row alignment for reliable row parsing.
- Table/row delimitation: Expect rows with line breaks inside a single transaction; plan to merge lines when necessary based on consistent indentation or bullet markers.
- Tesseract configuration: Use a layout-aware mode (PSM 6/PSM 4) suitable for dense tabular text; consider custom OCR for currencies and decimal points.

DOM vs OCR decisions informed by screenshot
- If a readable table DOM exists, prefer DOM extraction first for accuracy and speed.
- If the DOM is not structured as a standard table, OCR-based extraction becomes necessary; plan to implement a robust post-OCR parsing to reconstruct rows.

Validation and QA notes
- Cross-check a subset of transactions against manually parsed data to estimate OCR/parse accuracy.
- Validate export: the generated CSV should import into Actual Budget with minimal manual mapping.

Next steps for this screenshot state
- Add planning entry planning/07_screenshots.md to capture additional screenshots (e.g., mid-month, end-of-month, narrow viewport).
- Update planning/02_requirements.md with any insights about column mappings and edge cases discovered here.
- Update planning/04_architecture.md to consider ROI-based OCR module refinements and potential DOM-first extraction optimizations.
