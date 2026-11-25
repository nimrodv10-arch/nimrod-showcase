---
name: job-fit
description: Score a job posting or link 1-100 against the user's profile.md (four weighted parts), list pros, cons and red flags, and say the next step. Use when the user pastes a job link or text, asks "is this job for me", or asks to rank several jobs.
---

# Job fit score

Read `profile.md` first (ask once where it is if you cannot find it; offer `/job-search:setup` if it does not exist). Never ask for anything the profile already answers.

## Steps
1. Get the full posting. If it is a link, open it; if it fails, ask for the text. Note the posting date and whether it is still open.
2. Check the hard filters from the profile. A broken hard filter: score it anyway, mark it `archive`, say which filter.
3. Score four parts. Show each part as `points / max`:
   | Part | Max | What earns points |
   |---|---|---|
   | Requirements vs. experience | 25 | Each must-have matched by a confirmed fact. A closable gap (SQL, a BI tool) earns half, not zero. Being slightly overqualified is fine. |
   | Role and growth | 25 | Matches target roles, adds new skills, not on the "do not want" list. |
   | Chance to get hired | 20 | Realistic bar, a contact inside (+3 to +8 by closeness), language and years asked. |
   | Company and conditions | 30 | Preferences from the profile: brand, pace, hybrid, city, stability. |
4. Total = sum. Bands: 80+ strong, 70-79 good, 60-69 borderline, under 60 skip unless there is a referral.
5. Output, short:
   - One line: score, band, verdict (apply / referral first / skip).
   - The four parts.
   - 3 pros, 3 cons, up to 3 red flags to check on a call.
   - Next step with a date.

## Rules
- Every claim about the user comes from `profile.md`. If the posting asks for something the profile does not cover, say "unknown", do not guess.
- Cite where a fact about the company came from and its date.
- Several jobs: one table sorted by score, then the details of the top 3 only.
- If the user keeps a tracker (a sheet, Notion, an Interview OS page), give the row ready to paste: company, role, score, status, next step, next date.
