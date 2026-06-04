const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

// 1. Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            // Attempt to initialize without explicit credentials (relies on GOOGLE_APPLICATION_CREDENTIALS)
            admin.initializeApp();
        }
    } catch (error) {
        console.error("Firebase admin initialization failed:", error.message);
        process.exit(1);
    }
}

const db = admin.firestore();

// 2. Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateNote(topicName, courseName) {
    const prompt = `Explain ${topicName} from ${courseName} for Indian engineering students. Structure: ## What is it? (2-3 sentences) ## Key Concepts (5 bullets) ## Code Example (if applicable) ## Real World Use (2-3 sentences) ## Quick Summary (1 sentence). Max 350 words.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function main() {
    console.log("Reading roadmaps from TS file...");
    let ROADMAPS = {};
    const tempScriptPath = path.join(__dirname, 'temp-read-roadmaps.ts');
    
    try {
        // Write a temporary TypeScript file to extract ROADMAPS
        const scriptContent = `
import { ROADMAPS } from '../src/lib/data/roadmaps';
console.log('---JSON_START---');
console.log(JSON.stringify(ROADMAPS));
console.log('---JSON_END---');
`;
        fs.writeFileSync(tempScriptPath, scriptContent);
        
        // Execute the script using tsx
        const output = execSync(`npx -y tsx "${tempScriptPath}"`, { 
            encoding: 'utf-8', 
            maxBuffer: 50 * 1024 * 1024,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        const jsonStart = output.indexOf('---JSON_START---') + '---JSON_START---'.length;
        const jsonEnd = output.indexOf('---JSON_END---');
        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("Could not find JSON markers in output.");
        }
        
        const jsonStr = output.substring(jsonStart, jsonEnd).trim();
        ROADMAPS = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to read roadmaps.ts:", e.message);
        if (e.stderr) {
            console.error("stderr:", e.stderr.toString());
        }
        process.exit(1);
    } finally {
        // Clean up temp file
        if (fs.existsSync(tempScriptPath)) {
            fs.unlinkSync(tempScriptPath);
        }
    }

    const courses = Object.values(ROADMAPS);
    console.log(`Found ${courses.length} courses.`);

    let totalTopics = 0;
    const allTopics = [];

    for (const course of courses) {
        if (!course.chapters) continue;
        for (const chapter of course.chapters) {
            if (!chapter.topics) continue;
            for (const topic of chapter.topics) {
                allTopics.push({
                    courseId: course.id,
                    courseName: course.title,
                    chapterId: chapter.id,
                    topicId: topic.id,
                    topicName: topic.title,
                });
                totalTopics++;
            }
        }
    }

    console.log(`Found ${totalTopics} topics to generate notes for.`);

    let generatedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < allTopics.length; i++) {
        const { courseId, courseName, topicId, topicName } = allTopics[i];
        const docId = `${courseId}_${topicId}`;
        const docRef = db.collection('topic_notes').doc(docId);

        try {
            const noteContent = await generateNote(topicName, courseName);
            
            await docRef.set({
                notes: noteContent,
                courseId: courseId,
                topicId: topicId,
                topicName: topicName,
                generatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            generatedCount++;
            console.log(`Generated ${generatedCount + failedCount}/${totalTopics} topics... (${courseName} - ${topicName})`);
            
            // Add a small delay to respect rate limits
            await delay(1000); 

        } catch (error) {
            console.error(`\nError generating note for ${topicName} in ${courseName}: ${error.message}`);
            failedCount++;
            console.log(`Generated ${generatedCount + failedCount}/${totalTopics} topics...`);
        }
    }

    console.log(`Successfully generated ${generatedCount} notes, ${failedCount} failed`);
}

main().catch(console.error);
