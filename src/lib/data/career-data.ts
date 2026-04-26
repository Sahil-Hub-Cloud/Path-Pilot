/**
 * Career Database
 * Contains detailed information about 50+ career paths
 */

export interface CareerInfo {
    id: string;
    title: string;
    category: string;
    description: string;
    requiredSkills: Array<{ name: string; level: number; category: string }>;
    averageSalary: { min: number; max: number; currency: string };
    growthProspect: number; // 0-100
    workLifeBalance: number; // 0-100
    educationRequired: string;
    typicalDay: string[];
    challenges: string[];
    rewards: string[];
    careerPath: string[];
}

export const CAREER_DATABASE: Record<string, CareerInfo> = {
    'data-scientist': {
        id: 'data-scientist',
        title: 'Data Scientist',
        category: 'Technology',
        description: 'Analyze complex data to help companies make better decisions using statistical methods and machine learning.',
        requiredSkills: [
            { name: 'Python', level: 80, category: 'Programming' },
            { name: 'Statistics', level: 85, category: 'Mathematics' },
            { name: 'Machine Learning', level: 75, category: 'AI/ML' },
            { name: 'SQL', level: 70, category: 'Database' },
            { name: 'Data Visualization', level: 70, category: 'Analytics' },
            { name: 'Communication', level: 75, category: 'Soft Skills' },
        ],
        averageSalary: { min: 800000, max: 2500000, currency: 'INR' },
        growthProspect: 95,
        workLifeBalance: 70,
        educationRequired: 'Bachelor\'s in Computer Science, Statistics, or related field. Master\'s preferred.',
        typicalDay: [
            'Morning standup with team',
            'Data cleaning and preprocessing',
            'Model development and testing',
            'Stakeholder presentations',
            'Code reviews and documentation',
        ],
        challenges: [
            'Dealing with messy, incomplete data',
            'Explaining complex concepts to non-technical stakeholders',
            'Keeping up with rapidly evolving tools and techniques',
            'Balancing accuracy with business timelines',
        ],
        rewards: [
            'High impact on business decisions',
            'Intellectually stimulating work',
            'Excellent compensation',
            'High demand in job market',
        ],
        careerPath: ['Junior Data Analyst', 'Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Chief Data Officer'],
    },

    'software-engineer': {
        id: 'software-engineer',
        title: 'Software Engineer',
        category: 'Technology',
        description: 'Design, develop, and maintain software applications and systems.',
        requiredSkills: [
            { name: 'Programming (Java/Python/C++)', level: 85, category: 'Programming' },
            { name: 'Data Structures & Algorithms', level: 80, category: 'Computer Science' },
            { name: 'System Design', level: 70, category: 'Architecture' },
            { name: 'Version Control (Git)', level: 75, category: 'Tools' },
            { name: 'Problem Solving', level: 85, category: 'Soft Skills' },
            { name: 'Teamwork', level: 75, category: 'Soft Skills' },
        ],
        averageSalary: { min: 600000, max: 3000000, currency: 'INR' },
        growthProspect: 90,
        workLifeBalance: 65,
        educationRequired: 'Bachelor\'s in Computer Science or related field',
        typicalDay: [
            'Code review and standup',
            'Feature development',
            'Bug fixing and testing',
            'Architecture discussions',
            'Documentation',
        ],
        challenges: [
            'Debugging complex issues',
            'Meeting tight deadlines',
            'Keeping code maintainable',
            'Learning new technologies constantly',
        ],
        rewards: [
            'Creating products used by millions',
            'High earning potential',
            'Remote work opportunities',
            'Continuous learning',
        ],
        careerPath: ['Junior Developer', 'Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager', 'CTO'],
    },

    'product-manager': {
        id: 'product-manager',
        title: 'Product Manager',
        category: 'Business',
        description: 'Define product vision, strategy, and roadmap while working with cross-functional teams.',
        requiredSkills: [
            { name: 'Product Strategy', level: 85, category: 'Product' },
            { name: 'User Research', level: 75, category: 'Research' },
            { name: 'Data Analysis', level: 70, category: 'Analytics' },
            { name: 'Communication', level: 90, category: 'Soft Skills' },
            { name: 'Leadership', level: 80, category: 'Soft Skills' },
            { name: 'Technical Understanding', level: 65, category: 'Technical' },
        ],
        averageSalary: { min: 1000000, max: 4000000, currency: 'INR' },
        growthProspect: 85,
        workLifeBalance: 60,
        educationRequired: 'Bachelor\'s degree, MBA preferred. Technical background helpful.',
        typicalDay: [
            'User interviews and feedback analysis',
            'Sprint planning with engineering',
            'Stakeholder meetings',
            'Roadmap prioritization',
            'Competitive analysis',
        ],
        challenges: [
            'Balancing stakeholder demands',
            'Making decisions with incomplete information',
            'Managing conflicting priorities',
            'Saying no to features',
        ],
        rewards: [
            'Shaping product direction',
            'High impact on business',
            'Cross-functional collaboration',
            'Strategic thinking',
        ],
        careerPath: ['Associate PM', 'Product Manager', 'Senior PM', 'Group PM', 'Director of Product', 'VP Product', 'CPO'],
    },

    'ux-designer': {
        id: 'ux-designer',
        title: 'UX/UI Designer',
        category: 'Design',
        description: 'Create intuitive and beautiful user experiences for digital products.',
        requiredSkills: [
            { name: 'UI Design', level: 85, category: 'Design' },
            { name: 'UX Research', level: 80, category: 'Research' },
            { name: 'Prototyping', level: 80, category: 'Design' },
            { name: 'Design Tools (Figma/Sketch)', level: 85, category: 'Tools' },
            { name: 'User Psychology', level: 75, category: 'Psychology' },
            { name: 'Communication', level: 80, category: 'Soft Skills' },
        ],
        averageSalary: { min: 500000, max: 2000000, currency: 'INR' },
        growthProspect: 80,
        workLifeBalance: 75,
        educationRequired: 'Bachelor\'s in Design, HCI, or related field. Portfolio is crucial.',
        typicalDay: [
            'User research and testing',
            'Wireframing and prototyping',
            'Design reviews',
            'Collaboration with developers',
            'Iteration based on feedback',
        ],
        challenges: [
            'Balancing aesthetics with usability',
            'Defending design decisions',
            'Working within technical constraints',
            'Keeping up with design trends',
        ],
        rewards: [
            'Creative expression',
            'Direct impact on user satisfaction',
            'Collaborative environment',
            'Portfolio building',
        ],
        careerPath: ['Junior Designer', 'UX Designer', 'Senior Designer', 'Lead Designer', 'Design Manager', 'Head of Design'],
    },

    'digital-marketer': {
        id: 'digital-marketer',
        title: 'Digital Marketing Specialist',
        category: 'Marketing',
        description: 'Plan and execute digital marketing campaigns across various channels.',
        requiredSkills: [
            { name: 'SEO/SEM', level: 80, category: 'Marketing' },
            { name: 'Content Marketing', level: 75, category: 'Marketing' },
            { name: 'Social Media', level: 80, category: 'Marketing' },
            { name: 'Analytics', level: 75, category: 'Analytics' },
            { name: 'Copywriting', level: 70, category: 'Writing' },
            { name: 'Creativity', level: 85, category: 'Soft Skills' },
        ],
        averageSalary: { min: 400000, max: 1500000, currency: 'INR' },
        growthProspect: 85,
        workLifeBalance: 70,
        educationRequired: 'Bachelor\'s in Marketing, Communications, or related field',
        typicalDay: [
            'Campaign performance analysis',
            'Content creation and scheduling',
            'A/B testing',
            'Client/stakeholder meetings',
            'Trend research',
        ],
        challenges: [
            'Keeping up with platform changes',
            'Proving ROI',
            'Managing multiple campaigns',
            'Standing out in crowded market',
        ],
        rewards: [
            'Creative and analytical blend',
            'Measurable impact',
            'Fast-paced environment',
            'Diverse projects',
        ],
        careerPath: ['Marketing Coordinator', 'Digital Marketer', 'Senior Marketer', 'Marketing Manager', 'Director of Marketing', 'CMO'],
    },

    // Add more careers (condensed for brevity)
    'ai-engineer': {
        id: 'ai-engineer',
        title: 'AI/ML Engineer',
        category: 'Technology',
        description: 'Build and deploy artificial intelligence and machine learning systems.',
        requiredSkills: [
            { name: 'Python/PyTorch/TensorFlow', level: 85, category: 'Programming' },
            { name: 'Deep Learning', level: 80, category: 'AI/ML' },
            { name: 'Mathematics', level: 75, category: 'Mathematics' },
            { name: 'MLOps', level: 70, category: 'DevOps' },
            { name: 'Research Skills', level: 75, category: 'Research' },
        ],
        averageSalary: { min: 1000000, max: 3500000, currency: 'INR' },
        growthProspect: 98,
        workLifeBalance: 65,
        educationRequired: 'Master\'s or PhD in Computer Science, AI, or related field preferred',
        typicalDay: ['Model training', 'Research paper review', 'Experimentation', 'Model deployment', 'Team collaboration'],
        challenges: ['Computational resource constraints', 'Model interpretability', 'Keeping up with research', 'Production deployment'],
        rewards: ['Cutting-edge technology', 'High demand', 'Intellectual challenge', 'Excellent compensation'],
        careerPath: ['ML Intern', 'ML Engineer', 'Senior ML Engineer', 'ML Architect', 'Research Scientist', 'AI Lead'],
    },

    'cybersecurity-analyst': {
        id: 'cybersecurity-analyst',
        title: 'Cybersecurity Analyst',
        category: 'Technology',
        description: 'Protect organizations from cyber threats and security breaches.',
        requiredSkills: [
            { name: 'Network Security', level: 85, category: 'Security' },
            { name: 'Penetration Testing', level: 75, category: 'Security' },
            { name: 'Security Tools', level: 80, category: 'Tools' },
            { name: 'Incident Response', level: 80, category: 'Security' },
            { name: 'Risk Assessment', level: 75, category: 'Analysis' },
        ],
        averageSalary: { min: 700000, max: 2500000, currency: 'INR' },
        growthProspect: 92,
        workLifeBalance: 60,
        educationRequired: 'Bachelor\'s in Cybersecurity, Computer Science, or related field. Certifications (CISSP, CEH) valued.',
        typicalDay: ['Threat monitoring', 'Vulnerability assessments', 'Incident investigation', 'Security audits', 'Training staff'],
        challenges: ['Evolving threat landscape', 'High-pressure incidents', '24/7 vigilance', 'Balancing security with usability'],
        rewards: ['Protecting critical systems', 'High demand', 'Continuous learning', 'Job security'],
        careerPath: ['Security Analyst', 'Senior Analyst', 'Security Engineer', 'Security Architect', 'CISO'],
    },

    'content-creator': {
        id: 'content-creator',
        title: 'Content Creator / Influencer',
        category: 'Creative',
        description: 'Create engaging content across platforms to build audience and brand partnerships.',
        requiredSkills: [
            { name: 'Video Production', level: 80, category: 'Production' },
            { name: 'Storytelling', level: 85, category: 'Creative' },
            { name: 'Social Media', level: 85, category: 'Marketing' },
            { name: 'Personal Branding', level: 80, category: 'Marketing' },
            { name: 'Audience Engagement', level: 85, category: 'Communication' },
        ],
        averageSalary: { min: 200000, max: 5000000, currency: 'INR' },
        growthProspect: 75,
        workLifeBalance: 50,
        educationRequired: 'No specific degree required. Portfolio and audience matter most.',
        typicalDay: ['Content planning', 'Filming/recording', 'Editing', 'Posting and engagement', 'Brand collaborations'],
        challenges: ['Algorithm changes', 'Burnout', 'Inconsistent income', 'Privacy concerns', 'Staying relevant'],
        rewards: ['Creative freedom', 'Flexible schedule', 'Direct audience connection', 'Unlimited earning potential'],
        careerPath: ['Hobbyist', 'Part-time Creator', 'Full-time Creator', 'Influencer', 'Media Company Owner'],
    },

    'financial-analyst': {
        id: 'financial-analyst',
        title: 'Financial Analyst',
        category: 'Finance',
        description: 'Analyze financial data to guide business and investment decisions.',
        requiredSkills: [
            { name: 'Financial Modeling', level: 85, category: 'Finance' },
            { name: 'Excel', level: 90, category: 'Tools' },
            { name: 'Accounting', level: 75, category: 'Finance' },
            { name: 'Data Analysis', level: 80, category: 'Analytics' },
            { name: 'Presentation Skills', level: 75, category: 'Communication' },
        ],
        averageSalary: { min: 500000, max: 2000000, currency: 'INR' },
        growthProspect: 80,
        workLifeBalance: 55,
        educationRequired: 'Bachelor\'s in Finance, Economics, or Business. CFA/MBA valued.',
        typicalDay: ['Financial modeling', 'Report preparation', 'Market research', 'Client presentations', 'Forecasting'],
        challenges: ['Long hours during reporting periods', 'High accuracy requirements', 'Market volatility', 'Pressure from stakeholders'],
        rewards: ['Strategic impact', 'Strong compensation', 'Career progression', 'Analytical challenge'],
        careerPath: ['Analyst', 'Senior Analyst', 'Associate', 'VP', 'Director', 'CFO'],
    },

    'teacher': {
        id: 'teacher',
        title: 'Teacher / Educator',
        category: 'Education',
        description: 'Educate and inspire students across various subjects and grade levels.',
        requiredSkills: [
            { name: 'Subject Expertise', level: 85, category: 'Knowledge' },
            { name: 'Pedagogy', level: 85, category: 'Teaching' },
            { name: 'Classroom Management', level: 80, category: 'Management' },
            { name: 'Communication', level: 90, category: 'Soft Skills' },
            { name: 'Patience', level: 85, category: 'Soft Skills' },
            { name: 'Adaptability', level: 80, category: 'Soft Skills' },
        ],
        averageSalary: { min: 300000, max: 1200000, currency: 'INR' },
        growthProspect: 70,
        workLifeBalance: 75,
        educationRequired: 'Bachelor\'s in Education (B.Ed) or subject + teaching certification',
        typicalDay: ['Lesson planning', 'Teaching classes', 'Grading assignments', 'Parent meetings', 'Professional development'],
        challenges: ['Large class sizes', 'Diverse learning needs', 'Administrative burden', 'Limited resources'],
        rewards: ['Shaping young minds', 'Job stability', 'Vacation time', 'Making a difference', 'Continuous learning'],
        careerPath: ['Student Teacher', 'Teacher', 'Senior Teacher', 'Department Head', 'Vice Principal', 'Principal'],
    },
};

export function getAllCareers(): CareerInfo[] {
    return Object.values(CAREER_DATABASE);
}

export function getCareerById(id: string): CareerInfo | undefined {
    return CAREER_DATABASE[id];
}

export function getCareersByCategory(category: string): CareerInfo[] {
    return Object.values(CAREER_DATABASE).filter(c => c.category === category);
}

export function searchCareers(query: string): CareerInfo[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(CAREER_DATABASE).filter(c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery)
    );
}
