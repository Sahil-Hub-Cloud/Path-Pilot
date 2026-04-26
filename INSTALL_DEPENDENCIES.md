# Install Required Dependencies

Due to PowerShell execution policy, please run these commands manually:

## Option 1: Using CMD (Recommended)
Open Command Prompt and run:
```cmd
cd d:\Chatbot\path-pilot
npm install @monaco-editor/react qrcode
npm install --save-dev @types/qrcode
```

## Option 2: Using PowerShell with Bypass
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
cd d:\Chatbot\path-pilot
npm install @monaco-editor/react qrcode
npm install --save-dev @types/qrcode
```

## After Installation

Start the development server:
```cmd
npm run dev
```

Then navigate to: **http://localhost:3000/complete**

---

## What These Packages Do

- **@monaco-editor/react** - Powers the interactive code editor in labs (same engine as VS Code)
- **qrcode** - Generates QR codes for certificate verification
