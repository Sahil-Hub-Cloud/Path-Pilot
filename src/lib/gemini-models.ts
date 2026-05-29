import { GoogleGenerativeAI } from '@google/generative-ai';

/** Models that support generateContent for this project's API key. */
export const GEMINI_GENERATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite-001',
  'gemini-pro-latest',
] as const;

export function isGeminiModelNotFoundError(message: string): boolean {
  const msg = message.toLowerCase();
  return (
    msg.includes('404') ||
    msg.includes('not found') ||
    msg.includes('not supported') ||
    msg.includes('is not found for api version')
  );
}

export async function generateTextWithFallback(
  apiKey: string,
  prompt: string,
  logPrefix = '[gemini]'
): Promise<{ text: string; model: string }> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: Error | null = null;

  for (const modelName of GEMINI_GENERATE_MODELS) {
    try {
      console.log(`${logPrefix} Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim() || '';
      if (!text) throw new Error('Empty response from Gemini');
      console.log(`${logPrefix} Success with ${modelName}, chars=${text.length}`);
      return { text, model: modelName };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`${logPrefix} Model ${modelName} failed:`, message);
      lastError = err instanceof Error ? err : new Error(message);
      if (!isGeminiModelNotFoundError(message)) break;
    }
  }

  throw lastError ?? new Error('All Gemini models failed');
}
