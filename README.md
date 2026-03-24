# Metaverse Classroom 3D

כיתה תלת-ממדית אינטראקטיבית לגוגל מיט. במקום קוביות משעממות - עולם 3D עם אבטרים, משימות, ו-gamification.

## מה זה עושה

- **אבטרים 3D** - כל תלמיד מיוצג כאבטר תלת-ממדי במקום קוביה שטוחה
- **כיתה מטאברס** - חלל 3D עם שולחנות, לוח דיגיטלי, וכוכבים
- **משימות** - מודלים 3D (DNA, מולקולות, גלובוס) עם אינטראקציה
- **AI Assistant** - סייען הוראה חכם (Gemini API)
- **Gamification** - XP, רמות, הישגים, ומשימות
- **צ'אט** - הודעות בזמן אמת
- **ריאקציות** - אימוג'י, הרמת יד, אינדיקטור דיבור

## התקנה (Chrome Extension)

### אפשרות 1: מקובץ ZIP (מומלץ למורים)
1. הורד את `metaverse-classroom-extension.zip`
2. חלץ לתיקייה
3. פתח `chrome://extensions/`
4. הפעל "Developer mode" (מצב מפתח)
5. לחץ "Load unpacked" (טען ללא אריזה)
6. בחר את התיקייה שחילצת
7. פתח Google Meet - תראה כפתור 🚀

### אפשרות 2: מתיקיית extension/
1. `git clone` את הריפו
2. פתח `chrome://extensions/`
3. הפעל Developer mode
4. Load unpacked → בחר תיקיית `extension/`

## פיתוח

```bash
npm install
npm run dev     # שרת פיתוח
npm run build   # build רגיל
npx vite build --config vite.extension.config.ts  # build לתוסף
```

## שימוש

1. פתח Google Meet ‏(meet.google.com)
2. לחץ על כפתור 🚀 (צף בפינה הימנית)
3. הכיתה 3D נפתחת כשכבה על Meet
4. ESC או כפתור ✕ לסגירה

## טכנולוגיות

- React 19 + TypeScript
- Three.js + React Three Fiber + Drei
- Tailwind CSS v4
- Framer Motion
- Gemini AI API
- Chrome Extension Manifest V3
