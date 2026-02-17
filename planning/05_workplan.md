# Work plan and milestones (Stage 3 onward)

## Milestones
- Stage 3: Init Session
  - Create session directory and context.md with planning details (document the approved concept and context discovery).
  - Load code-quality standards (if available) and populate planning MD files.
- Stage 4: Plan
  - If needed, use TaskManager to break down the design into atomic subtasks and create temporary task JSONs.
- Stage 5: Execute
  - Implement Concept B baseline with iterative, incremental development.
  - Validate after each step (lint, type checks, and basic tests).
- Stage 6: Validate and Handoff
  - Run full system checks and propose Test Engineer/Code Reviewer handoff.

## Timeline (illustrative)
- Week 1: Finalize planning docs and Stage 3 initialization
- Week 2: Implement core capture + DOM extraction + CSV generation
- Week 3: Add optional mapping UI and export refinements
- Week 4: End-to-end testing and user validation

## Risks and mitigations
- OCR accuracy risk: implement DOM-first approach with OCR fallback and enable mapping UI to correct issues quickly.
- Privacy concerns for cloud OCR: default to on-device OCR; cloud OCR only with explicit user consent.
- Page variability: design DOM extraction with robust selectors and fallback to OCR.
