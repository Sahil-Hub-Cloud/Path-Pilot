import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ROADMAPS, COURSE_SLUG_MAP } from '@/lib/data/roadmaps';
import { LABS } from '@/lib/data/labs';

/**
 * Adaptive Recommendation System
 * Calculates topic priority based on:
 * 1. Lab performance (< 70% score -> High Priority)
 * 2. Career Prerequisites (First 2 chapters -> High Priority)
 * 3. Roadmap Proximity (Next 5 topics -> Medium Priority)
 * 4. Completion Status (Excluded)
 */
export async function calculateTopicPriority(userId: string) {
    if (!db || !userId) return;

    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const { learningPath, completedTopics = [] } = userData;

        // 1. Identify current roadmap
        // Use normalized mapping (hyphenated-slug or underscore_key)
        const roadmapId = COURSE_SLUG_MAP[learningPath] || learningPath.toLowerCase().replace(/\s+/g, '-');
        const roadmap = ROADMAPS[roadmapId];
        if (!roadmap) return;

        // 2. Fetch all submissions to check for weak areas
        const submissionsRef = collection(db, 'users', userId, 'submissions');
        const submissionsSnap = await getDocs(submissionsRef);
        const submissions = submissionsSnap.docs.map(d => d.data());

        // Identify labs with scores < 70%
        const weakLabs = submissions.filter(s => {
            const pct = s.totalCount > 0 ? (s.passedCount / s.totalCount) * 100 : 0;
            return pct < 70;
        });

        // 3. Identify all topics in roadmap
        const allTopics = roadmap.chapters.flatMap(ch => ch.topics);
        const remainingTopics = allTopics.filter(t => !completedTopics.includes(t.id));

        if (remainingTopics.length === 0) return;

        // 4. Score each remaining topic
        const scoredTopics = remainingTopics.map(topic => {
            let priority = 0; // 0 = Low, 1 = Medium, 2 = High
            let reason = '';

            // --- RULE 1: Performance-based (HIGH) ---
            // Heuristic: check if lab category or title matches topic/skill
            const relatedWeakLab = weakLabs.find(l => {
                const labDef = LABS[l.labId];
                if (!labDef) return false;
                const labCat = labDef.category.toLowerCase();
                const topicTitle = topic.title.toLowerCase();
                return topicTitle.includes(labCat) || labCat.includes(topicTitle) || 
                       labDef.title.toLowerCase().includes(topicTitle);
            });

            if (relatedWeakLab) {
                priority = 2;
                reason = `We recommend this because your ${LABS[relatedWeakLab.labId].category} score needs improvement`;
            }

            // --- RULE 2: Career Prerequisite (HIGH) ---
            // Heuristic: The first 2 chapters of any roadmap are foundational prerequisites
            const isPrereq = roadmap.chapters.slice(0, 2).some(ch => 
                ch.topics.some(t => t.id === topic.id)
            );
            if (priority < 2 && isPrereq) {
                priority = 2;
                const outcomes = roadmap.careerOutcomes && roadmap.careerOutcomes.length > 0 && roadmap.careerOutcomes[0] !== roadmap.title
                    ? roadmap.careerOutcomes.slice(0, 3).join(', ') 
                    : learningPath;
                reason = `This topic unlocks 3 career roles in ${outcomes}`;
            }

            // --- RULE 3: Roadmap Proximity (MEDIUM) ---
            // Next few topics in the defined order
            const nextTopics = allTopics.filter(t => !completedTopics.includes(t.id)).slice(0, 5);
            const isUpcoming = nextTopics.some(t => t.id === topic.id);
            if (priority < 1 && isUpcoming) {
                priority = 1;
                reason = `This topic is next in your ${roadmap.duration} roadmap`;
            }

            // Default fallback
            if (priority === 0 && !reason) {
                reason = `Deepen your ${learningPath} mastery with this module`;
            }

            return { id: topic.id, priority, reason };
        });

        // Sort by priority desc
        scoredTopics.sort((a, b) => b.priority - a.priority);

        const topRecommendation = scoredTopics[0];

        // 5. Persist to Firestore
        await updateDoc(userRef, {
            nextRecommendedTopic: topRecommendation.id,
            recommendationReason: topRecommendation.reason,
            // Store simple mapping for Learn page UI
            topicPriorities: scoredTopics.reduce((acc, t) => {
                acc[t.id] = t.priority;
                return acc;
            }, {} as Record<string, number>)
        });

        return { nextRecommendedTopic: topRecommendation.id, recommendationReason: topRecommendation.reason };
    } catch (e) {
        console.error("Recommendation System Error:", e);
        return null;
    }
}
