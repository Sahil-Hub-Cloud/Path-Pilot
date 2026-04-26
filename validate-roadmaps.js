const { ROADMAPS } = require('./src/lib/data/roadmaps');

try {
    console.log('Validating ROADMAPS...');
    Object.values(ROADMAPS).forEach((r, i) => {
        console.log(`Checking Roadmap ${i}: ${r.title}`);
        if (!r.chapters) throw new Error(`Roadmap ${r.title} is missing chapters`);
        if (!r.steps) throw new Error(`Roadmap ${r.title} is missing steps`);

        r.chapters.forEach((c, ci) => {
            if (!c.topics) throw new Error(`Chapter ${c.title} is missing topics`);
            c.topics.forEach((t, ti) => {
                if (!t.id) throw new Error(`Topic in ${c.title} is missing id`);
                if (!t.difficulty) throw new Error(`Topic ${t.title} is missing difficulty`);
            });
        });
    });
    console.log('ROADMAPS validation successful!');
} catch (e) {
    console.error('ROADMAPS validation failed:', e.message);
}
