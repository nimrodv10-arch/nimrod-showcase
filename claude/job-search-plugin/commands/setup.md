---
description: Create your private profile.md for the job-search plugin by answering a few questions
---

Help the user create `profile.md` from the template at `${CLAUDE_PLUGIN_ROOT}/templates/profile.md`.

Ask one short group of questions at a time, in the user's language, in this order: targets and roles they do not want; hard filters (location, work model, full-time); preferences and salary floor; their career facts, one job at a time, asking for each number exactly as they can defend it; skill gaps; people who can refer them.

Write the answers into `profile.md` in the current folder (or where the user says). Do not invent anything; leave a field empty if they skip it. At the end, show what is still empty and say the file is private and should stay out of public repos.
