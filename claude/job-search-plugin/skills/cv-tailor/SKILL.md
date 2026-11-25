---
name: cv-tailor
description: Tailor the user's CV to one job posting with at most 5 changes, using only confirmed facts from profile.md, and explain each change. Use when the user asks to adapt, tailor or "fix" their CV for a specific job.
---

# Tailor a CV to one job

Inputs: the job posting, the user's current CV (file or text), and `profile.md`.

## Steps
1. Pull the posting's top 5 asks (skills, tools, outcomes) and the exact words it uses.
2. Map each ask to a confirmed fact in the profile or the CV. Unmatched asks are gaps: list them, never paper over them.
3. Propose at most **5 changes**, ranked by impact. Each: before → after → which ask it answers. Prefer, in order: the headline under the name, the order of bullets, swapping a word for the posting's word, one bullet rewrite.
4. Wait for the user's OK, then apply only the approved changes.

## Rules (non-negotiable)
- Never invent, inflate or round up a number, title, tool or result. If a fact is not in `profile.md` or the CV, ask.
- Ask before deleting any existing line.
- Keep the user's own wording where it already works.
- Keep the layout: one page, education below experience, plain bullets an ATS can read.
- The file name stays generic (`First_Last_CV.pdf`); the company name goes only in the folder name.
- Clean the PDF metadata (no author or title from an old template).
