# Task Context: Chrome extension for Bilt Transactions OCR to CSV

## Purpose
- Outline the planning context for building a Chrome extension that captures the Bilt Rewards transactions page, performs OCR to extract a CSV compatible with Actual Budget, and provides an import-ready file.
- Baseline design concept: Hybrid DOM extraction with OCR fallback (Concept B).

-## Context discovery results
- Context root: .opencode/context/ (default)
- ContextScout found no code-quality.md or other standards in the repository at the expected location.
- No language-specific patterns discovered in the repository context.
- New planning note: We now have a concrete DOM-extraction strategy based on the provided HTML snippet. The plan is to implement a DOM-based extractor as the primary path (Concept B baseline) with OCR as a robust fallback for edge cases. See planning/06_dom_extraction.md for details.
- Open questions may arise if/when project standards are introduced to this repository.

## Assumed standards (code-quality, accessibility, security)
- In the absence of a code-quality.md, we will rely on general best practices for chrome extensions, including:
  - Clear module boundaries and small, testable units
  - Minimal permissions and secure handling of user data
  - Accessible UI with ARIA labels and keyboard navigation
  - Defensive programming for dynamic web pages

## Stakeholders and success criteria
- Stakeholders: You (the requester) and the extension development team.
- Success criteria:
  - Full-page screenshot capture of the transactions page is achievable for pages of any length.
  - OCR output yields a CSV containing at least Date, Description/Payee, and Amount with high accuracy.
  - CSV aligns with Actual Budget’s import expectations or can be easily mapped by the user.
  - A simple, intuitive UI exists in the extension popup for initiating capture and exporting the CSV.

## Open questions for approval
- Do you want to prioritize on-device OCR (no network) with a fallback to cloud OCR if necessary?
- Should we include an optional column-mapping UI to tailor the CSV to Actual Budget’s import schema?
- Are there any additional fields from Bilt transactions you want included (e.g., currency, category, memo)?
- Do you want the extension to support multiple browser contexts or just the active tab of the Bilt page?

## Approval status
- Approved concept to proceed to Stage 3: Init Session and planning artifacts (Concept B baseline).
