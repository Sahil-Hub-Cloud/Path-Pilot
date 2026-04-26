export interface LanguageDetection {
    primaryLanguage: string;
    confidence: number;
    codeMixing: boolean;
    mixedLanguages?: string[];
}

export class VernacularAI {
    /**
     * Provides natural language understanding and generation in Indian languages.
     */
    async detectLanguage(text: string): Promise<LanguageDetection> {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return { primaryLanguage: 'en', confidence: 1, codeMixing: false };
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
        Detect the language of the following text and identify if it uses code-mixing (e.g., Hinglish, Tanglish).
        Return ONLY a JSON object: { "primaryLanguage": string, "confidence": number, "codeMixing": boolean, "mixedLanguages": string[] }
        
        Text: ${text.substring(0, 500)}
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let parsed = { primaryLanguage: 'en', confidence: 0, codeMixing: false };
            try {
                const text = response.text().replace(/```json|```/g, '').trim();
                if (text) {
                    parsed = JSON.parse(text);
                }
            } catch (e) {
                console.error('Error parsing language detection:', e);
            }
            return parsed;
        } catch (error) {
            console.error('Detection Error:', error);
            return { primaryLanguage: 'en', confidence: 0, codeMixing: false };
        }
    }

    async translateWithContext(text: string, targetLang: string, context: any): Promise<string> {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) return text;

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
        Translate the following text to ${targetLang} while preserving the educational context: ${JSON.stringify(context)}
        Maintain any code-mixing style if appropriate for the student.
        Text: ${text}
      `;

            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error('Translation Error:', error);
            return text;
        }
    }

    async generateResponse(prompt: string, language: string): Promise<string> {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) return "Service offline.";

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(`System: You are Path Pilot assistant. Respond in ${language}.\nUser: ${prompt}`);
            return result.response.text();
        } catch (error) {
            console.error('Generation Error:', error);
            return "Something went wrong.";
        }
    }

    async handleCodeMixing(text: string): Promise<string> {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) return text;

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
        You are a Vernacular Bridge for Path Pilot. 
        Rephrase the following student query (written in Hinglish or mixed language) into clear, academic English for the internal engine, 
        BUT keep the core sentiment and intent. If the text is already clear, return it as is.
        
        Text: ${text}
        Response: [ONLY the rephrased text]
      `;

            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error('Code-Mixing Handle Error:', error);
            return text;
        }
    }
}
