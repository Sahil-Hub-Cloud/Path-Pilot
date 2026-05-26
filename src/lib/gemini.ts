import { StudentGraph } from "./memory-graph";
import { getPersona } from "./diction-adapter";

export interface Module {
    id: number;
    name: string;
    description: string;
    estimatedHours: number;
    mastery: number;
    status: string;
    units: {
        id: number;
        name: string;
        difficulty: "Beginner" | "Intermediate" | "Advanced";
        estimatedTime: string;
        status: string;
        retentionScore: number;
    }[];
}
export class GeminiBrain {
    /**
     * Emergency Reroute: Trims optional fat and focuses on high-yield topics.
     */
    static async recalculateRoadmap(/* _currentGraph: StudentGraph */): Promise<{ newPlan: string[]; message: string }> {
        return {
            newPlan: ["Focus: Critical Path Only", "Drop: Optional Modules", "Reschedule: Intensive Tasks -> Weekend"],
            message: "Emergency reroute active. Schedule compressed."
        };
    }

    /**
     * Generates a "mentor-style" explanation for the current roadmap.
     */
    static async explainRoadmap(graph: StudentGraph, personaId: string = 'startup_professional'): Promise<string> {
        const persona = getPersona(personaId);
        // Compact summary to save tokens
        const profileSummary = `Intent: ${graph.identity.careerIntent.primaryPath}, Energy: ${graph.constraints.energyProfile.burnoutThreshold}h, Failures: ${graph.logs.slice(-3).map(l => l.type).join(", ")}`;

        const prompt = `
          ${persona.roleDefinition}
          ${persona.explanationPrompt(profileSummary, "Current Roadmap Goal")}
          Tone: ${persona.tone}
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            const data = await response.json();
            return data.text || "AI Reasoning Offline. (API error)";
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Unable to synthesize reasoning at this moment.";
        }
    }

    /**
     * Analyzes a missed task and suggests a correction without guilt.
     */
    static async analyzeFailure(
        graph: StudentGraph,
        missedTask: string,
        userFeedback: string
    ): Promise<{ adjustment: string; message: string }> {
        const prompt = `
          Student missed task: "${missedTask}".
            Feedback: "${userFeedback}".
                Context: Stress level is ${graph.constraints.stressLevel}/10.

        1. Propose a concrete schedule adjustment(e.g., "Split into 2 sessions").
          2. Write a short, non - judgmental message acknowledging the reality(max 15 words).
          
          Output JSON ONLY: { "adjustment": "...", "message": "..." }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, model: "gemini-1.5-flash" })
            });
            const data = await response.json();
            const text = data.text;
            const cleaned = text.replace(/```json | ```/g, "").trim();
            try {
                return JSON.parse(cleaned);
            } catch (e) {
                console.error("Failed to parse Gemini failure analysis:", e);
                return { adjustment: "Moved to tomorrow", message: "Let's try again tomorrow." };
            }
        } catch {
            return { adjustment: "Moved to tomorrow", message: "Let's try again tomorrow." };
        }
    }

    /**
     * Calculates specific trade-offs for a decision.
     */
    static async calculateTradeOff(
        action: string,
        context: string
    ): Promise<string> {
        const prompt = `
        Action: ${action}
        Context: ${context}
          
          What is the mathematical or strategic trade - off ?
            Format : "Gain [X], but Risk [Y] by [Z]%."
                `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, model: "gemini-1.5-flash" })
            });
            const data = await response.json();
            return data.text || "Analysis unavailable.";
        } catch {
            return "Analysis unavailable.";
        }
    }

    /**
     * Parses raw syllabus text into structured Learning Modules.
     */
    static async ingestSyllabus(text: string, captchaToken?: string): Promise<Module[]> {
        const prompt = `
        Act as a Curriculum Developer.Parse the following syllabus text into a structured JSON array of Learning Modules.
        
        SYLLABUS TEXT:
        "${text.slice(0, 5000)}"

        RULES:
        1. Return ONLY a JSON array.No markdown formatting.
        2. Schema per Module:
        {
            "id": number,
                "name": "Module Title",
                    "description": "Concise academic description",
                        "estimatedHours": number,
                            "mastery": 0,
                                "status": "active",
                                    "units": [
                                        { "id": number, "name": "Unit Title", "difficulty": "Beginner" | "Intermediate" | "Advanced", "estimatedTime": "X hours", "status": "not-started", "retentionScore": 0 }
                                    ]
        }
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, model: "gemini-1.5-pro", captchaToken })
            });
            const data = await response.json();

            if (response.status === 403) {
                throw new Error(data.message || "Identity verification failed.");
            }

            const cleaned = data.text.replace(/```json | ```/g, "").trim();
            try {
                return JSON.parse(cleaned);
            } catch (e) {
                console.error("Failed to parse Gemini syllabus ingestion:", e);
                return [];
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Syllabus Ingestion Failed.";
            console.error("Syllabus Ingestion Failed:", error);
            throw new Error(errorMessage);
        }
    }

    /**
     * Generates a 768-dimensional embedding for the provided text.
     */
    static async embedText(text: string): Promise<number[]> {
        try {
            const response = await fetch('/api/gemini/embed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            return data.embedding || new Array(768).fill(0);
        } catch (error) {
            console.error("Embedding Error:", error);
            return new Array(768).fill(0);
        }
    }
}
