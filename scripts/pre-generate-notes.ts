import './load-env';
import * as admin from 'firebase-admin';
import { ROADMAPS } from '../src/lib/data/roadmaps';
import { db } from '../src/lib/firebase-admin';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
    process.exit(1);
}

async function generateNote(topicName: string, courseName: string) {
    const prompt = `Write in English. Explain ${topicName} from ${courseName} for Indian engineering students. Include: definition, 5 key concepts, code example, real world use. Max 300 words.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
        throw { status: response.status, message: data.error?.message || 'unknown' };
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Notes not available';
}

async function main() {
    const courses = Object.values(ROADMAPS);
    console.log(`Found ${courses.length} courses.`);

    const allTasks: any[] = [];
    for (const course of courses) {
        if (!course.chapters) continue;
        for (const chapter of course.chapters) {
            if (!chapter.topics) continue;
            for (const topic of chapter.topics) {
                allTasks.push({
                    courseId: course.id,
                    courseName: course.title,
                    topicId: topic.id,
                    topicName: topic.title,
                    language: 'english'
                });
            }
        }
    }

    console.log(`Found ${allTasks.length} topics to generate notes for.`);

    let generatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < allTasks.length; i++) {
        const { courseId, courseName, topicId, topicName, language } = allTasks[i];
        const docId = `${courseId}_${topicId}_${language}`;
        const docRef = db.collection('topic_notes').doc(docId);

        try {
            const noteContent = await generateNote(topicName, courseName);
            
            await docRef.set({
                notes: noteContent,
                courseId,
                topicId,
                topicName,
                language,
                generatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            generatedCount++;
            console.log(`Generated ${i + 1}/${allTasks.length} topics... (${courseName} - ${topicName})`);

            // Delay to avoid quota issues
            await new Promise(resolve => setTimeout(resolve, 4000));

        } catch (error: any) {
            if (error.status === 429 || error.status === 403) {
                console.log(`Skipping due to quota (${error.status}) on ${topicName}`);
                skippedCount++;
            } else {
                console.error(`Error generating note for ${topicName}: ${error.message}`);
                failedCount++;
            }
            console.log(`Generated ${i + 1}/${allTasks.length} topics...`);
        }
    }

    console.log(`Completed: ${generatedCount} success, ${skippedCount} skipped due to quota, ${failedCount} errors`);
}

main().catch(console.error);
