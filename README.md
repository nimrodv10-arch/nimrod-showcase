# nimrod-showcase

**לצפייה באתר:** https://nimrodv10-arch.github.io/nimrod-showcase/

כלים שבניתי עם Claude לבעיות אמיתיות מהעבודה ומהבית. כל הכלים עובדים, עם נתוני דוגמה בלבד.

| כלי | מה הוא מראה |
|---|---|
| [Interview OS (Case study)](https://nimrodv10-arch.github.io/nimrod-showcase/tools/interview-os/) | מערכת חיפוש עבודה עם סוכנים מתוזמנים, מודל ציון ו-Connectors |
| [Lead Quality Dashboard](https://nimrodv10-arch.github.io/nimrod-showcase/tools/lead-quality/) | איכות לידים מול CPL, התראות על שותפים |
| [דף נחיתה לעסק של שיר](https://nimrodv10-arch.github.io/nimrod-showcase/tools/shir-landing/) | דף נחיתה עם וואטסאפ |
| [לוח המדידה של דף הנחיתה](https://nimrodv10-arch.github.io/nimrod-showcase/tools/shir-board/) | Funnel מהכניסה לדף ועד תלמיד |

---

**לתחזוקה:** האתר סטטי (HTML בלבד, בלי build). כל שינוי שממוזג ל-`main` עולה לאוויר.
- `index.html`: דף הבית
- `tools/<שם>/`: כל כלי
- `assets/claude-shim.js`: מחליף את מסד הנתונים של Claude בנתוני דוגמה בדפדפן
