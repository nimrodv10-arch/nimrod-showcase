# interview-os-mcp

שרת MCP קטן שחושף את רשימת המשרות של [Interview OS](https://nimrodv10-arch.github.io/nimrod-showcase/tools/interview-os/) ככלים. כך אפשר לכתוב ל-Claude (או לכל לקוח MCP) "תוסיף את המשרה הזו" או "מה דחוף השבוע", והוא קורא וכותב ישירות לקובץ.

| Tool | מה הוא עושה |
|---|---|
| `list_jobs` | רשימת משרות, עם סינון לפי סטטוס, ציון מינימלי או טקסט |
| `get_job` | כל מה שיש על משרה אחת: חלקי הציון, יתרונות, חסרונות, היסטוריה |
| `add_job` | מוסיף משרה בסטטוס "לבדוק", ודוחה קישור שכבר קיים |
| `move_job` | משנה סטטוס ושומר היסטוריה, כולל הצעד הבא והתאריך שלו |
| `pipeline_stats` | ספירה לפי סטטוס, ציון ממוצע, אחוז תגובה ומה דחוף ב-7 הימים הקרובים |

הקובץ נשמר אצלך בלבד. בלי `PIPELINE_FILE` השרת עובד על `demo-pipeline.json`, שבו 24 חברות בדויות.

## הרצה

```
cd claude/interview-os-mcp
npm install
npm test          # מריץ את השרת על עותק של קובץ הדמו וקורא לכל הכלים
```

## חיבור ל-Claude Code

```
claude mcp add interview-os -e PIPELINE_FILE=/path/to/pipeline.json -- node /path/to/claude/interview-os-mcp/server.js
```

ל-Claude Desktop: אותו `command` ו-`args` בקובץ `claude_desktop_config.json`.

## למה זה בנוי ככה
- **אותו מבנה נתונים כמו Interview OS** (`{ rows: [...] }`), כך שקובץ שמייצאים מהמערכת עובד כמו שהוא.
- **כתיבה אטומית** (קובץ זמני ואז החלפה), כדי שקריסה באמצע לא תשאיר קובץ שבור.
- **הערות לכלים** (`readOnlyHint`, `idempotentHint`), כדי שהלקוח יידע אילו כלים רק קוראים ואפשר להריץ בלי אישור.
- **בדיקת עשן** (`test.js`) שמריצה את השרת אמיתי מעל stdio, כמו שלקוח היה מריץ אותו.
