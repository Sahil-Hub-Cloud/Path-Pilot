# Academic Intelligence Platform - Startup Setup

**Current Status:** Production Architecture Ready.
The platform is configured to run as a "Academic Operating System" with Persistent Memory (Firebase) and Active Reasoning (Gemini).

## 1. Environment Configuration

Create a `.env.local` file in the root directory with the following keys:

```bash
# Firebase (Persistent Memory Graph)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini (Reasoning Engine)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

## 2. Features Active (Offline Mode)

Even without API keys, the system runs in **Graceful Degradation Mode**:
*   **UI/UX**: "Calm Intelligence" Theme (Indigo/Cyan) is active.
*   **Roadmap**: Uses `PersistentMemoryStore` logic (simulated async loading).
*   **Reasoning**: Uses a static fallback for `NeuralEngine` logic until Gemini key is provided.
*   **Safety**: Hydration errors from extensions are suppressed.

## 3. Next Steps for MVP Launch

1.  **Deploy Firestore Rules**: Secure the `academic_brains` collection.
2.  **Enable Auth**: Turn on Email/Google Auth in Firebase Console.
3.  **Train Gemini**: Refine the prompt engineering in `src/lib/gemini.ts` with real student data.
