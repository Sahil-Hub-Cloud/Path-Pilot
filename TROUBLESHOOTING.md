# Troubleshooting Guide - /complete Page Errors

## Steps to Debug

### 1. Check What You See
Visit `http://localhost:3000/complete` and tell me:
- Is the page completely blank/white?
- Do you see a purple gradient welcome screen?
- Do you see any error overlay?

### 2. Check Browser Console
1. Press `F12` to open Developer Tools
2. Click the "Console" tab
3. Look for RED error messages
4. Copy and paste the full error messages

### 3. Common Errors and Fixes

#### Error: "Cannot find module @monaco-editor/react"
**Fix:** Run `npm install @monaco-editor/react`

#### Error: "Cannot find module qrcode"
**Fix:** Run `npm install qrcode @types/qrcode`

#### Error: "Module not found: Can't resolve '@/lib/types/complete-types'"
**Fix:** The types file exists, this should work. Try restarting the dev server.

#### Error: "Firebase: Error (auth/unauthorized-domain)"
**Fix:** Already fixed with separate layout. Refresh the page.

#### Blank Page
**Check:** Are there any console errors? Look for import errors.

### 4. Quick Test Commands

```bash
# Restart dev server
npm run dev

# Check if files exist
dir src\components\onboarding
dir src\lib\types
```

## What I Fixed Already

✅ Type inconsistency in `AICareerChat.tsx`  
✅ Separated `/complete` layout to bypass Firebase  
✅ Installed dependencies (monaco-editor, qrcode)

## Next Steps

Share the console errors with me so I can fix the exact issue!
