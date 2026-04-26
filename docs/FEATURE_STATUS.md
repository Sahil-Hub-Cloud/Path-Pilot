# PathPilot – Living Feature Ledger
**Legend:** ✅ shipped | 🚧 WIP | ⏳ queued | ❌ cut/parked

## 🧠 1. Core Intelligence (“The Brain”)
| Feature | Status | Ship-file | Last-known gap / next micro-task |
| :--- | :--- | :--- | :--- |
| **Cybernetic HUD** | ✅ | `CyberneticAssistant.tsx` | — |
| **Socratic Debugger** | ✅ | `CyberneticBrain.socraticQuery()` | Add “question-only” token guard (≤ 5% answer tokens) |
| **Strategic Reasoning** | ✅ | `CyberneticBrain.strategicReasoning()` | Cache Claude 3 response for 30 min to save $$ |
| **Neural Ingestion** | ✅ | `GeminiBrain.ingestSyllabus()` | PDF → text boundary-box still lost on scan-heavy docs |
| **Neural Link panel** | 🚧 | `NeuralLinkModal.tsx` | Wire real OAuth after v0.2 demo |
| **Ghost Protocol** (focus lock) | ⏳ | — | Needs browser-extension scaffold |
| **Shadow Curriculum DAG** | ⏳ | — | Auto-build after ingestion; export GraphML |
| **“Proof-of-Mastery” export** | ⏳ | — | Design interactive résumé link |

## ⚡ 2. Bio-Logic (Gamification)
| Feature | Status | Ship-file | Last-known gap |
| :--- | :--- | :--- | :--- |
| **Cognitive Energy** | ✅ | `NeuralEngine.processPassiveDrain()` | — |
| **Circadian Graveyard Penalty** | ✅ | same | — |
| **Stress Mode** (red theme) | ✅ | `useUITheme()` | Simulate +20% XP gain to justify extra drain |
| **Skill Decay** | ✅ | `NeuralEngine.calculateDecay()` | Show “volatility flame” icon when σ > 15 |
| **Emergency Reroute** | ✅ | `EngineKernel.panicPurge()` | — |
| **System Collapse** screen | ⏳ | — | Build “Recovery Protocol” mini-game |
| **Antifragility Quiz** | ⏳ | — | Once/week harder quiz; +Resilience on fail |
| **Trade-Off** (Class Class) | ⏳ | — | Permanent branch: Placement vs Research |

## 📚 3. Curriculum & Content
| Feature | Status | Ship-file | Last-known gap |
| :--- | :--- | :--- | :--- |
| **PDF upload & parse** | ✅ | `PdfUploader.tsx` | OCR layer for scan-heavy PDFs |
| **YouTube content-script** | 🚧 | `extension/src/content.js` | Needs Chrome-store manifest v3 |
| **Notion sync** | ⏳ | — | Blocked on real OAuth |
| **HealthKit sleep** | ⏳ | — | Blocked on real OAuth |

## 🖥️ 4. UI / OS Shell
| Feature | Status | Ship-file | Last-known gap |
| :--- | :--- | :--- | :--- |
| **Glassmorphism OS shell** | ✅ | `globals.css` | — |
| **Skill Graph** (d3-force) | ✅ | `SkillGraph.tsx` | Mobile pinch-zoom jittery |
| **System Hub tabs** | ✅ | `SystemHub.tsx` | Market & BIOS tabs are placeholders |
| **Login Gate** | ✅ | `LoginGate.tsx` | Upgrade to Firebase Auth anonymous + email-link |
| **Offline “Calm” mode** | ✅ | `useOfflineFallback()` | — |

## 🔐 5. Trust & Safety
| Feature | Status | Ship-file | Last-known gap |
| :--- | :--- | :--- | :--- |
| **Data privacy toggles** | ⏳ | — | Add “AI can/cannot store prompts” switch |
| **FERPA / COPPA copy** | ⏳ | — | Add to onboarding footer |
| **Key rotation warning** | ⏳ | — | Surface “rotate keys” banner after 80 days |
