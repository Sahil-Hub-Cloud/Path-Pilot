export type AIProvider = 'gemini' | 'groq' | 'openrouter';

export class CyberneticBrain {

    /**
     * Rapid-Fire Socratic Questioning (Optimized for Groq Llama 3 70b)
     * "Fast inferences for conversational loops"
     */
    static async socraticQuery(topic: string, context: string): Promise<string> {
        try {
            const response = await fetch('/api/socratic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, context })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error("Malformed JSON response from Socratic API", e);
                throw new Error("Invalid AI response format");
            }
            return data?.message || "Synthesizing...";
        } catch (error) {
            console.error('Socratic query failed:', error);
            return `[SIMULATION PROTOCOL] Connection failed. Reflect on this: How does the ${topic} module connect to your larger goal?`;
        }
    }

    /**
     * Deep Reasoning (Optimized for OpenRouter / Claude-3 / Haiku)
     * Generates strategic advice based on the specific module and user track.
     */
    static async strategicReasoning(moduleName: string, moduleDesc: string, track: string): Promise<{ logic: string, impact: string, action: string }> {
        try {
            const response = await fetch('/api/strategic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleName, moduleDesc, track })
            });

            if (!response.ok) {
                throw new Error('Strategic reasoning request failed');
            }

            try {
                return await response.json();
            } catch (e) {
                console.error("Malformed JSON response from Strategic API", e);
                throw new Error("Invalid Reasoning format");
            }
        } catch (e) {
            console.error("Reasoning Error", e);
            return {
                logic: "Signal Interference. Strategy unavailable.",
                impact: "low",
                action: "Retry Uplink"
            };
        }
    }
}
