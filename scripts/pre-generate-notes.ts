import './load-env';
import { FieldValue } from 'firebase-admin/firestore';
import { ROADMAPS } from '../src/lib/data/roadmaps';
import { adminDb as db } from '../src/lib/firebase-admin';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
    process.exit(1);
}

async function generateNote(topicName: string, courseName: string): Promise<string> {
    const prompt = `Write in English. Explain ${topicName} from ${courseName} for Indian engineering students. Include: definition, 5 key concepts, code example, real world use. Max 300 words.`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw { status: response.status, message: data.error?.message || 'Unknown error' };
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Notes not available';
}

async function main() {
    const allTasks = Object.values(ROADMAPS).flatMap(course =>
        (course.chapters || []).flatMap(chapter =>
            (chapter.topics || []).map(topic => ({
                courseId: course.id,
                courseName: course.title,
                topicId: topic.id,
                topicName: topic.title,
                language: 'english'
            }))
        )
    );

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
                generatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

            generatedCount++;
            console.log(`[${i + 1}/${allTasks.length}] Generated note for ${courseName} - ${topicName}`);

            // Delay to avoid quota issues
            await new Promise(resolve => setTimeout(resolve, 4000));
        } catch (error: any) {
            if (error.status === 429 || error.status === 403) {
                console.log(`Skipping due to quota (${error.status}) on ${topicName}`);
                skippedCount++;
            } else {
                console.error(`Error generating note for ${topicName}: ${error.message || error}`);
                failedCount++;
            }
        }
    }

    console.log(`Completed: ${generatedCount} success, ${skippedCount} skipped due to quota, ${failedCount} errors`);
}

main().catch(console.error);
