// PathPilot Bharat Configuration
export const PATHPILOT_CONFIG = {
  // AWS Configuration
  aws: {
    region: process.env.AWS_REGION || 'ap-south-1',
    bedrock: {
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      maxTokens: 4096,
    },
    dynamodb: {
      studentsTable: 'pathpilot-students',
      schedulesTable: 'pathpilot-schedules',
      metricsTable: 'pathpilot-metrics',
    },
    s3: {
      bucket: 'pathpilot-content',
      region: 'ap-south-1',
    },
  },

  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },

  // WhatsApp Configuration
  whatsapp: {
    businessApiUrl: process.env.WHATSAPP_BUSINESS_API_URL,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  },

  // Language Support
  languages: {
    supported: ['hi', 'en', 'te', 'ta', 'bn', 'mr'],
    default: 'hi',
    codeMixing: ['hinglish', 'tanglish', 'benglish'],
  },

  // Performance Constraints
  performance: {
    maxPayloadSize: 100 * 1024, // 100KB for 2G networks
    responseTimeout: 5000, // 5 seconds
    cacheTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxConcurrentUsers: 10000,
  },

  // Bio-Logic Parameters
  bioLogic: {
    energyLevels: {
      HIGH: { start: 6, end: 10 }, // 6 AM - 10 AM
      MEDIUM: { start: 14, end: 18 }, // 2 PM - 6 PM
      LOW: { start: 20, end: 22 }, // 8 PM - 10 PM
    },
    sessionDurations: {
      HIGH: 90, // minutes
      MEDIUM: 60,
      LOW: 30,
    },
    breakDurations: {
      SHORT: 15, // minutes
      MEDIUM: 30,
      LONG: 60,
    },
  },

  // Burnout Detection
  burnout: {
    indicators: {
      studyDurationThreshold: 8, // hours per day
      sleepThreshold: 6, // minimum hours
      performanceDeclineThreshold: 0.2, // 20% decline
      stressLevelThreshold: 7, // out of 10
    },
    predictionWindow: 48, // hours
    interventionTypes: ['REST', 'EXERCISE', 'SOCIAL', 'PROFESSIONAL'],
  },

  // Career Simulation
  careers: {
    totalPaths: 50,
    scenariosPerCareer: 5,
    simulationDuration: 30, // minutes
    assessmentCriteria: 10,
  },

  // Pricing
  pricing: {
    freeTier: {
      features: ['neural_ingestion', 'bio_logic', 'burnout_prediction', 'whatsapp'],
      limits: {
        syllabusUploads: 5,
        scheduleGenerations: 10,
        careerSimulations: 3,
      },
    },
    premium: {
      priceINR: 49,
      features: ['all_free', 'unlimited_simulations', 'proof_of_mastery', 'peer_clusters'],
      limits: {
        unlimited: true,
      },
    },
  },

  // Security
  security: {
    encryption: 'AES-256',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    dataRetention: 365, // days
  },
};

// Environment validation
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_WEBHOOK_VERIFY_TOKEN',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
}

// Feature flags for gradual rollout
export const FEATURE_FLAGS = {
  NEURAL_INGESTION: true,
  BIO_LOGIC_SCHEDULER: true,
  BURNOUT_PREDICTION: true,
  CAREER_SIMULATOR: true,
  WHATSAPP_INTERFACE: true,
  VERNACULAR_AI: true,
  OFFLINE_SYNC: false, // P1 feature
  PROOF_OF_MASTERY: false, // P1 feature
  PEER_CLUSTERS: false, // P2 feature
  EMPLOYER_API: false, // P2 feature
};

export default PATHPILOT_CONFIG;
