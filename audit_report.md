# PathPilot Bharat - Deep Code & Architecture Audit

This report dives deep into the *actual implementation, logic, and data models* written into the source code of PathPilot Bharat. It moves past generic stack details to expose the inner workings of the cybernetic learning OS.

## 1. The Neural Knowledge Graph (`memory-graph.ts`)
The core data structure tracking a user's entire learning lifecycle isn't a simple database table; it's a multi-tier neural graph consisting of:
*   **Tier 1: Identity & Intent**: Tracks the student's degree, target graduation year, and career intent (Placement, Research, or Entrepreneurship) along with dream companies.
*   **Tier 2: Learning Vectors**: Topics aren't just "complete/incomplete". They are tracked as vectors containing `domain`, `confidence` (AI's trust in the student, 0.0 - 1.0), and crucially, a `decayRate` (modeling how fast the student forgets).
*   **Tier 3: Constraint Models**: Actively models reality by storing `weeklyHours`, `blackoutDates` (exams, events), and an `energyProfile` (peak focus hours and burnout thresholds). It also tracks a `stressLevel` (0-10) sensed from interactions and missed tasks.
*   **Tier 4: Evolution Log**: An AI-driven "failure memory". If a user misses tasks due to burnout, it logs an `EvolutionLog` (e.g., "Skipped 3 days of DSA") and an `aiAdjustment` (e.g., "Reduced plan density by 20%").

## 2. Cybernetic Scoring Engine (`scoring-engine.ts`)
The app does not use traditional grading. It implements a multi-heuristic `Scoring Engine` with specific weighting to calculate a **Readiness Score**:
*   **Logic (35%)**: Heavily penalized for hints. 0 hints = +0.1, >2 hints = -0.05.
*   **Debugging (25%)**: Rewards fixing code on the first attempt (+0.1) and speed (< 2 minutes gets a +0.02 speed bonus).
*   **Syntax (20%)**: Starts at 1.0, minus 0.1 for every error found via heuristic parsing of stderr (looking for Tracebacks, TypeErrors).
*   **Prompt Quality (20%)**: Rewards the student for *how* they ask AI for help. Analyzes length and presence of conceptual keywords like "why", "how does", or "time complexity".

Based on these heuristics, users are classified dynamically into skill labels: `Novice 🔴`, `Beginner 🌱`, `Developing 🔧`, `Proficient ⚡`, and `Expert 🏆`.

## 3. The AI Brain (`gemini.ts` & `api/notes/route.ts`)
The platform acts as a literal copilot using multiple Google Gemini models (1.5-flash, 1.5-pro, 2.0-flash):
*   **Syllabus Ingestion**: Uses `gemini-1.5-pro` to ingest 5000+ characters of raw syllabus text, outputting structured JSON trees (`Modules` -> `Units` -> `Difficulty`/`Time`).
*   **Mentor Explanations**: Modifies AI tone based on personas (e.g., "startup_professional") and the user's `energyProfile` and `intent`.
*   **Guilt-Free Failure Analysis**: When a student misses a task, the AI analyzes the failure based on the student's current stress level out of 10, proposing a concrete schedule adjustment in under 15 words without judgment.
*   **Notes Generation API**: Utilizes the newest `gemini-2.0-flash` endpoint to construct perfectly structured markdown notes (What is it, Key Concepts, Code, Real World Use).

## 4. Cybernetic Profile & Economy (`user-profile.ts`)
The `UserProfile` enforces a gamified cybernetic RPG loop:
*   **Stats**: Tracks a user's `focus`, `speed`, `resilience`, `logic`, and `creativity` (0-100 scales).
*   **Ranks**: Users evolve from `SCRIPT KIDDIE` to `NEOPHYTE`, `PILOT`, and finally `SYSTEM ARCHITECT` based on module completions.
*   **Offline-First Architecture**: Profile state extensively uses React hooks tied to `localStorage`, with an intelligent background sync to Firebase Firestore (`onSnapshot`, `setDoc`). This guarantees the app functions on patchy 2G Bharat networks without blocking the UI.
*   **Economy**: A `credits` system integrated with an inventory, allowing users to "purchase" or unlock items/achievements.

## 5. Visualizing the Neural Network (`SkillGraph.tsx`)
The application features a fully custom visualization engine using `D3.js` and `Framer Motion`:
*   Renders a "Neural Constellation" mapping skill dependencies.
*   Implements physics simulations (gravity, collision, charge) for nodes to float realistically.
*   Nodes glow with cybernetic themes (Cyan, SVG drop-shadows) and display the `energy_cost` required to learn a specific topic.
*   Supports pan, zoom, and drag-and-drop mechanics.

## 6. Remote Code Execution (`piston.ts`)
Instead of mocking tests, the app routes compilation requests through `/api/execute` which appears to interface with **Judge0**:
*   Executes arbitrary code submitted by the student.
*   Parses raw `stdout` and `stderr`/`compile_output`.
*   Supports running entire hidden test case suites concurrently to validate challenge solutions.

### Conclusion of Internal Architecture
PathPilot Bharat is fundamentally engineered as an empathetic RPG. It tracks *how* a student learns, calculates their cognitive decay and stress thresholds, and uses AI not just to answer questions, but to modify their calendar and roadmap to prevent mental burnout. It is an intricate web of offline-capable React states, multi-layered heuristics, and targeted AI interventions.
