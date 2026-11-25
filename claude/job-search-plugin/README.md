# job-search · Claude plugin

חיפוש עבודה עם Claude, בנוי מהשיטה שמאחורי [Interview OS](https://nimrodv10-arch.github.io/nimrod-showcase/tools/interview-os/).

| מה יש | מה זה עושה |
|---|---|
| `job-fit` (skill) | מקבל קישור למשרה ונותן ציון 1–100 לפי ארבעה חלקים, יתרונות, חסרונות והצעד הבא |
| `cv-tailor` (skill) | עד 5 שינויים בקורות החיים למשרה אחת, רק מעובדות שאישרת, ושואל לפני שמוחק |
| `interview-prep` (skill) | דף הכנה לראיון: פיץ', שאלות צפויות עם תשובות STAR, שאלות לשאול ושכר |
| `/job-search:setup` | שואל אותך כמה שאלות ויוצר `profile.md` פרטי שכל ה-skills קוראים ממנו |
| `/job-search:radar` | מגדיר סריקת משרות פעמיים בשבוע ומריץ אותה פעם ראשונה |

## התקנה (Claude Code)

```
/plugin marketplace add nimrodv10-arch/nimrod-showcase
/plugin install job-search@nimrod-tools
/job-search:setup
```

אחרי זה אפשר פשוט להדביק קישור למשרה ולשאול "זה מתאים לי?".

## עקרונות
- **בלי המצאות.** כל טענה בקורות החיים מגיעה מ-`profile.md`.
- **הפרופיל שלך נשאר אצלך.** הוא קובץ מקומי, לא חלק מה-plugin, ולא עולה לשום מקום.
- **פער שאפשר לסגור (SQL, כלי BI) מקבל חצי ניקוד, לא אפס.**
