import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ROADMAPS } from '../src/lib/data/roadmaps';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY is missing in environment variables.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Initialize Firebase Admin
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (privateKey && clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

const db = admin.firestore();

async function generateWithRetry(prompt: string, retries = 3): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
  
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota')) {
        console.warn(`[Quota Error] Retrying in ${Math.pow(2, i) * 2} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 2000));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

async function main() {
  const courses = Object.values(ROADMAPS);
  console.log(`Starting pre-generation for ${courses.length} courses...`);
  
  for (const course of courses) {
    console.log(`\nProcessing course: ${course.title} (${course.id})`);
    
    for (const chapter of course.chapters) {
      for (const topic of chapter.topics) {
        const lang = 'English'; // Pre-generating in English as default
        const docId = `${course.id}_${topic.id}_${lang}`;
        const cacheRef = db.collection('topic_notes').doc(docId);
        
        const existing = await cacheRef.get();
        if (existing.exists) {
          console.log(`  [SKIP] Notes already exist for topic: ${topic.title}`);
          continue;
        }

        console.log(`  [GENERATE] Generating notes for topic: ${topic.title}...`);
        const prompt = `Explain ${topic.title} from ${course.title} course in simple ${lang} for an Indian engineering student. Structure your response as markdown with these sections:
1) Simple Definition (2-3 sentences)
2) Key Concepts (5 bullet points)
3) Real World Example (3-4 sentences)
4) Common Mistakes (3 bullets)
5) Quick Summary (1 sentence)

Keep under 300 words. Use clear headings (##) for each section.`;

        try {
          const notes = await generateWithRetry(prompt);
          
          await cacheRef.set({
            courseId: course.id,
            topicId: topic.id,
            notes,
            language: lang,
            createdAt: Date.now(),
          });
          
          console.log(`  [SUCCESS] Saved notes for: ${topic.title}`);
          
          // Small delay to be polite to the API rate limits
          await new Promise(r => setTimeout(r, 1000));
        } catch (error: any) {
          console.error(`  [ERROR] Failed to generate notes for ${topic.title}:`, error.message);
        }
      }
    }
  }
  
  console.log('\n✅ Pre-generation complete!');
  process.exit(0);
}

main().catch(console.error);
