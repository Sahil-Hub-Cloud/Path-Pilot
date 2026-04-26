import { getFirebaseDb } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { StudentGraph, EvolutionLog, ConstraintModel } from "./memory-graph";
import { Module } from "./mock-data";
import { VectorBrain } from "./vector-store";

const COLLECTION = "academic_brains";

export class PersistentMemoryStore {
    // --- Initialization ---
    static async initializeStudent(userId: string, email: string, name: string): Promise<void> {
        const db = getFirebaseDb();
        if (!db) throw new Error("Firebase DB not initialized");

        const userRef = doc(db, COLLECTION, userId);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            // Create new academic brain
            const initialGraph: Partial<StudentGraph> = {
                identity: {
                    uid: userId,
                    name,
                    email,
                    createdAt: Timestamp.now(),
                    degree: { name: "Undecided", currentSemester: 1, targetYear: new Date().getFullYear() + 4 },
                    careerIntent: { primaryPath: "placement", targetRoles: [] }
                },
                vectors: {},
                constraints: {
                    weeklyHours: 20,
                    blackoutDates: [],
                    energyProfile: { peakHours: ["09:00", "18:00"], burnoutThreshold: 40 },
                    stressLevel: 0
                },
                logs: []
            };
            await setDoc(userRef, initialGraph);
        }
    }

    // --- Core Memory Access ---
    static async loadBrain(userId: string): Promise<StudentGraph | null> {
        const db = getFirebaseDb();
        if (!db) return null;

        const snap = await getDoc(doc(db, COLLECTION, userId));
        return snap.exists() ? (snap.data() as StudentGraph) : null;
    }

    // --- Evolution & Logging ---
    static async logEvent(userId: string, event: Omit<EvolutionLog, "date">): Promise<void> {
        const db = getFirebaseDb();
        if (!db) return;

        const newLog: EvolutionLog = {
            ...event,
            date: Timestamp.now()
        };

        const userRef = doc(db, COLLECTION, userId);
        await updateDoc(userRef, {
            logs: arrayUnion(newLog)
        });

        // BACKGROUND: Semantic Activity Vectorization
        if (event.context) {
            VectorBrain.indexSyllabus(userId, event.context, 9999); // 9999 = activity log type
        }
    }

    // --- Constraint Adaptation ---
    static async updateConstraints(userId: string, constraints: Partial<ConstraintModel>): Promise<void> {
        const db = getFirebaseDb();
        if (!db) return;

        const userRef = doc(db, COLLECTION, userId);
        // Merge the new constraints
        await setDoc(userRef, { constraints }, { merge: true });
    }
    // --- Syllabus Ingestion ---
    static async saveSyllabus(userId: string, rawText: string, parsedModules: Module[]): Promise<boolean> {
        // 1. Try Firestore
        const db = getFirebaseDb();
        if (db) {
            try {
                const docRef = doc(db, COLLECTION, userId, 'ingestions', Date.now().toString());
                await setDoc(docRef, {
                    raw: rawText,
                    parsed: parsedModules,
                    timestamp: Timestamp.now()
                });
                return true;
            } catch (e) {
                console.error("Firestore Save Failed, falling back to local:", e);
            }
        }

        // 2. Fallback to LocalStorage
        try {
            const savedHistory = localStorage.getItem('syllabus_history');
            let history = [];
            if (savedHistory) {
                try {
                    history = JSON.parse(savedHistory);
                } catch (parseError) {
                    console.error("Failed to parse syllabus history, resetting:", parseError);
                    history = [];
                }
            }
            if (!Array.isArray(history)) {
                console.warn("Syllabus history format invalid, resetting.");
                history = [];
            }
            history.push({ raw: rawText, parsed: parsedModules, timestamp: Date.now() });
            localStorage.setItem('syllabus_history', JSON.stringify(history));
            return true;
        } catch (e) {
            console.error("Local Save Failed:", e);
            return false;
        }
    }

    // --- Economy Authority (Server-Side) ---
    static async updateEconomy(userId: string, credits: number, energy: number): Promise<void> {
        const db = getFirebaseDb();
        if (!db) return; // Fallback to local if offline, but won't persist server-side

        const userRef = doc(db, COLLECTION, userId);

        // Transactional update to prevent race conditions
        await updateDoc(userRef, {
            "economy.credits": credits,
            "economy.energy": energy,
            "economy.lastUpdated": Timestamp.now()
        });
    }

    static async getEconomy(userId: string): Promise<{ credits: number, energy: number } | null> {
        const db = getFirebaseDb();
        if (!db) return null;

        const snap = await getDoc(doc(db, COLLECTION, userId));
        if (snap.exists()) {
            const data = snap.data();
            return data.economy ? { credits: data.economy.credits, energy: data.economy.energy } : null;
        }
        return null;
    }
}
