import { ROADMAPS } from './src/lib/data/roadmaps.js';

try {
    console.log('Validating ROADMAPS...');
    const values = Object.values(ROADMAPS);
    console.log(`Found ${values.length} roadmaps.`);
    values.forEach((r, i) => {
        console.log(`Checking Roadmap ${i}: ${r.title}`);
        if (!r.chapters) throw new Error(`Roadmap ${r.title} is missing chapters`);
        r.chapters.forEach((c) => {
            if (!c.topics) throw new Error(`Chapter ${c.title} is missing topics`);
            c.topics.forEach((t) => {
                if (!t.id) throw new Error(`Topic ${t.title} is missing id`);
                if (!t.difficulty) console.warn(`Topic ${t.title} is missing difficulty`);
            });
        });
    });
    console.log('ROADMAPS validation successful!');
} catch (e) {
    console.error('ROADMAPS validation failed:', e.message);
}
