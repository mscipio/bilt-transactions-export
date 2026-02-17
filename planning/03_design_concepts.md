# Design concepts for Chrome extension (Bilt Transactions OCR to CSV)

This document compares design concepts to support a hybrid DOM extraction + OCR fallback approach as the baseline, with alternatives explored for future flexibility.

## Concept A: Full-page screenshot + on-device OCR
- Summary: Stitch the entire page into a single high-resolution image; run OCR on the image to extract text; reconstruct a transactions table from the OCR output and export CSV.
- Architecture sketch:
  - Extension Popup UI
  - Capture module: Scroll-to-end stitching pipeline
  - OCR module: Tesseract.js or similar running in background/script context
  - Table reconstruction: parse OCR text into structured rows
  - CSV generator: create CSV with required headers
  - Download/export module
- Pros: DOM-agnostic; works with dynamic pages; self-contained offline processing.
- Cons: OCR errors risk; table reconstruction from image can be brittle; performance may vary on devices.
- When to choose: If DOM content is heavily protected or non-extractable.

## Concept B: Hybrid DOM extraction + OCR fallback (Baseline)
- Summary: Primary path uses DOM parsing to locate and extract the transactions table directly from page. If the table cannot be reliably parsed (missing or dynamic), fallback to full-page screenshot + OCR.
- Architecture sketch:
  - Extension Popup UI
  - DOM extraction module: locate table and convert rows to CSV schema
  - OCR fallback module: run OCR if DOM extraction fails or is incomplete
  - Table normalization: unify date formats, currency, and column alignment
  - CSV generator and optional mapping UI
- Pros: Best accuracy and speed when the table is accessible; robust fallback for edge cases.
- Cons: Requires robust DOM detection logic and careful edge-case handling.
- When to choose: Default baseline for reliability and performance.

## Concept C: Cloud OCR as a fallback with privacy controls
- Summary: Similar to Concept B but uses cloud OCR for the fallback path when on-device OCR is insufficient; ensures higher OCR accuracy with user consent and transparent data handling.
- Pros: Higher OCR accuracy; faster completion.
- Cons: Privacy concerns; network dependency; potential costs.
- When to choose: When pure on-device OCR fails consistently and user opt-in for cloud OCR is acceptable.

## Concept D: Optional post-processing and mapping UI
- Summary: After extraction, present a mapping UI allowing users to align fields to Actual Budget (Date, Payee, Amount, etc.).
- Pros: Flexible, reduces manual correction during import.
- Cons: Increases UI complexity; more steps for the user.
- When to choose: If Actual Budget import schemas vary significantly across users.

## Recommendation and rationale
- Recommended baseline: Concept B (Hybrid DOM extraction with OCR fallback).
- Rationale: Maximizes accuracy and speed when the page exposes a table in the DOM, while providing robust handling for non-standard pages via OCR. Concept D can be layered on top as an optional feature for post-processing.
