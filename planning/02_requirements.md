# Planning: Requirements for Chrome extension (Bilt Transactions OCR to CSV)

## Functional requirements
- Capture an unlimited-length screenshot of the current Bilt Rewards transactions page by scrolling and stitching the page image.
- Detect and extract the transactions table from the captured content using DOM-based parsing when available; otherwise, fall back to OCR.
- Perform OCR on the captured image to extract tabular data when DOM-based extraction is insufficient or unreliable.
- Parse extracted data into a CSV with at least the following fields: Date, Description/Payee, Amount. Include optional fields such as Category and Memo as available.
- Generate a CSV file that is import-ready for Actual Budget; support an optional user-driven column mapping step to align with Actual Budget’s schema.
- Provide a download option for the CSV from the extension UI with a clear filename.
- Offer a simple, responsive UI in the extension popup: a start button, progress indicators, and error messages.
- Include an optional post-processing option to export or copy to clipboard for quick paste-import.

## Non-functional requirements
- Privacy-first design: process data locally on-device by default; provide an opt-in cloud OCR path with clear consent if chosen.
- Performance: progress feedback for long captures; aim for keeping response times reasonable on mid-range hardware.
- Reliability: handle dynamic page loading, partial page content, and timeouts gracefully with retry options.
- Security: request minimal permissions (activeTab, storage, downloads) and ensure safe handling of user data.
- Accessibility: keyboard navigable UI and screen-reader friendly labels.
- Maintainability: modular code with clear interfaces between capture, DOM/OCR, parsing, and CSV generation modules.

## Edge cases / constraints
- Pages with non-standard transaction tables require robust detection; fallback remains OCR-based.
- Very large datasets may lead to memory/storage constraints; provide chunked processing or streaming when feasible.
- Timeouts and network connectivity (for cloud OCR) must be gracefully handled with user messaging.

## Acceptance criteria (test plan)
- A test page loads transactions; capture of an entire page completes within a reasonable time (e.g., under 60 seconds on typical hardware).
- OCR/DOM extraction yields a CSV with a header row and correct data alignment for a representative sample of transactions (>95% accuracy in field alignment in tests).
- The generated CSV can be imported into Actual Budget with minimal adjustments.
- The UI provides clear progress and actionable error states when issues occur.

## Mapping to planning artifacts
- Planning artifacts: planning/01_context.md, planning/03_design_concepts.md, planning/04_architecture.md will augment the requirements.
