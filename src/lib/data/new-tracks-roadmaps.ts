import type { Roadmap, Topic, Chapter } from './roadmaps';

type Difficulty = Topic['difficulty'];

function topic(
  id: number,
  title: string,
  difficulty: Difficulty,
  videoId: string,
  tags: string[],
  hours = 1.5
): Topic {
  const tid = `topic_${id}`;
  return {
    id: tid,
    title,
    difficulty,
    duration: `${hours} hours`,
    estimatedHours: hours,
    tags,
    challengeId: tid,
    resourceId: tid,
    videoUrl: `https://www.youtube.com/embed/${videoId}`,
  };
}

function chapter(
  courseId: string,
  idx: number,
  title: string,
  description: string,
  topics: Topic[]
): Chapter {
  const hours = topics.reduce((s, t) => s + (t.estimatedHours || 1.5), 0);
  return {
    id: `ch${idx}-${courseId}`,
    title,
    description,
    estimatedHours: Math.round(hours),
    topics,
  };
}

function baseRoadmap(
  id: string,
  title: string,
  description: string,
  duration: string,
  level: Roadmap['level'],
  icon: string,
  color: string,
  skills: string[],
  outcomes: string[],
  chapters: Chapter[]
): Roadmap {
  return {
    id,
    title,
    description,
    duration,
    level,
    difficulty: level === 'beginner' ? 'Beginner' : level === 'advanced' ? 'Hard' : 'Intermediate',
    icon,
    color,
    outcome: 'Job-ready portfolio and interview preparedness',
    skills,
    careerOutcomes: outcomes,
    chapters,
    steps: [],
  };
}

// ─── 1. AI/ML Engineer (14 weeks, 49 topics) ────────────────────────────────
let tid = 801;
const aiTopics = (titles: string[], videoId: string, tag: string): Topic[] =>
  titles.map((title, i) =>
    topic(
      tid++,
      title,
      i % 3 === 0 ? 'Beginner' : i % 3 === 1 ? 'Intermediate' : 'Hard',
      videoId,
      [tag, 'AI/ML', 'Python']
    )
  );

const AI_ML_CHAPTERS = [
  chapter('ai-ml-engineer', 1, 'Neural Network Foundations', 'Build deep learning fundamentals', aiTopics([
    'Perceptrons and activation functions', 'Backpropagation intuition', 'Gradient descent optimizers',
    'Loss functions for classification', 'Regularization and dropout', 'Batch normalization', 'Building your first MLP',
  ], 'NWONeJKn9Kc', 'Neural Networks')),
  chapter('ai-ml-engineer', 2, 'PyTorch Deep Dive', 'Hands-on tensor programming', aiTopics([
    'Tensors and autograd', 'Dataset and DataLoader', 'Custom nn.Module layers', 'Training loops and checkpoints',
    'GPU acceleration', 'Transfer learning basics', 'Model evaluation metrics',
  ], 'NWONeJKn9Kc', 'PyTorch')),
  chapter('ai-ml-engineer', 3, 'Transformers & NLP', 'Modern sequence modeling', aiTopics([
    'Attention mechanism', 'Transformer architecture', 'BERT and fine-tuning', 'Tokenization strategies',
    'HuggingFace Transformers library', 'Text classification pipelines', 'Named entity recognition',
  ], 'rmVRLeJRpdo', 'Transformers')),
  chapter('ai-ml-engineer', 4, 'LLM Fine-tuning', 'Adapt large models to tasks', aiTopics([
    'Prompt engineering patterns', 'LoRA and QLoRA', 'RLHF overview', 'Instruction tuning datasets',
    'Evaluation with BLEU and ROUGE', 'Deploying LLM APIs', 'Cost optimization for inference',
  ], 'rmVRLeJRpdo', 'LLM')),
  chapter('ai-ml-engineer', 5, 'Computer Vision', 'Image understanding systems', aiTopics([
    'CNN architectures', 'Object detection with YOLO', 'Image segmentation', 'Data augmentation',
    'Vision transformers', 'OpenCV preprocessing', 'Model export with ONNX',
  ], 'NWONeJKn9Kc', 'Vision')),
  chapter('ai-ml-engineer', 6, 'MLOps Production', 'Ship models reliably', aiTopics([
    'MLflow experiment tracking', 'Feature stores', 'Model registry', 'CI/CD for ML pipelines',
    'A/B testing models', 'Monitoring drift', 'Docker for ML services',
  ], 'NWONeJKn9Kc', 'MLOps')),
  chapter('ai-ml-engineer', 7, 'Capstone & Interviews', 'Portfolio and career prep', aiTopics([
    'End-to-end ML project design', 'Kaggle competition strategy', 'System design for ML', 'Resume ML projects',
    'Interview: bias and fairness', 'Interview: scaling inference', 'Capstone: deploy a fine-tuned model',
  ], 'NWONeJKn9Kc', 'Career')),
];

// ─── 2. Data Engineering (12 weeks, 48 topics) ─────────────────────────────
const deTopics = (titles: string[], tag: string): Topic[] =>
  titles.map((title, i) =>
    topic(tid++, title, i % 3 === 0 ? 'Beginner' : 'Intermediate', 'r-uOLxNrNk8', [tag, 'Data Engineering', 'SQL'])
  );

const DATA_ENG_CHAPTERS = [
  chapter('data-engineering', 1, 'SQL & Data Modeling', 'Relational foundations', deTopics([
    'Advanced SQL joins', 'Window functions', 'Query optimization', 'Star and snowflake schemas',
    'Normalization vs denormalization', 'Indexing strategies', 'PostgreSQL administration', 'Data quality checks',
  ], 'SQL')),
  chapter('data-engineering', 2, 'NoSQL & Streaming', 'Beyond relational stores', deTopics([
    'MongoDB aggregation', 'Redis caching patterns', 'Cassandra data modeling', 'Kafka producers and consumers',
    'Event-driven architecture', 'Schema registry', 'Stream processing concepts', 'Exactly-once semantics',
  ], 'NoSQL')),
  chapter('data-engineering', 3, 'Apache Spark', 'Distributed data processing', deTopics([
    'Spark RDD vs DataFrame', 'Spark SQL queries', 'Partitioning and shuffling', 'Spark on AWS EMR',
    'Delta Lake basics', 'PySpark ETL jobs', 'Performance tuning', 'Spark Structured Streaming',
  ], 'Spark')),
  chapter('data-engineering', 4, 'Airflow & Orchestration', 'Workflow automation', deTopics([
    'DAG design patterns', 'Airflow operators', 'Scheduling and backfill', 'Task dependencies',
    'Airflow on Kubernetes', 'dbt transformations', 'Data lineage', 'Alerting and SLAs',
  ], 'Airflow')),
  chapter('data-engineering', 5, 'Data Lakes & Warehouses', 'Modern analytics stacks', deTopics([
    'S3 data lake layout', 'Parquet and Avro formats', 'Snowflake architecture', 'BigQuery best practices',
    'ETL vs ELT pipelines', 'Data cataloging', 'Lakehouse pattern', 'Cost governance',
  ], 'Data Lakes')),
  chapter('data-engineering', 6, 'Production Pipelines', 'Ship data products', deTopics([
    'Batch vs real-time pipelines', 'Idempotent pipelines', 'Data contracts', 'Great Expectations validation',
    'Interview: pipeline design', 'Interview: handling late data', 'Capstone: end-to-end ETL', 'Portfolio review',
  ], 'ETL')),
];

// ─── 3. Web3/Blockchain Pro (14 weeks, 49 topics) ───────────────────────────
const web3Topics = (titles: string[], tag: string): Topic[] =>
  titles.map((title, i) =>
    topic(tid++, title, i % 4 === 3 ? 'Hard' : 'Intermediate', 'ipwxYa-F1uY', [tag, 'Web3', 'Solidity'])
  );

const WEB3_CHAPTERS = [
  chapter('web3-pro', 1, 'Solidity Advanced', 'Production smart contracts', web3Topics([
    'Inheritance and interfaces', 'Libraries and linking', 'Assembly and opcodes', 'Gas optimization patterns',
    'Upgradeable proxy patterns', 'Diamond standard (EIP-2535)', 'Custom errors and events',
  ], 'Solidity')),
  chapter('web3-pro', 2, 'Smart Contract Auditing', 'Security-first development', web3Topics([
    'Reentrancy attacks', 'Integer overflow history', 'Access control flaws', 'Flash loan exploits',
    'Slither static analysis', 'Foundry testing framework', 'Formal verification intro',
  ], 'Auditing')),
  chapter('web3-pro', 3, 'DeFi Protocols', 'Decentralized finance mechanics', web3Topics([
    'AMM math (Uniswap V2/V3)', 'Lending protocols (Aave)', 'Yield farming risks', 'Stablecoin mechanisms',
    'Liquidity mining', 'Oracle manipulation', 'MEV and front-running',
  ], 'DeFi')),
  chapter('web3-pro', 4, 'IPFS & Decentralized Storage', 'Off-chain data patterns', web3Topics([
    'IPFS content addressing', 'Pinning services', 'NFT metadata standards', 'Arweave permanence',
    'Ceramic network', 'Decentralized identity', 'Storage cost optimization',
  ], 'IPFS')),
  chapter('web3-pro', 5, 'DAO Development', 'On-chain governance', web3Topics([
    'Governance token design', 'Snapshot off-chain voting', 'Timelock controllers', 'Multisig wallets',
    'Proposal lifecycle', 'Treasury management', 'Legal considerations for DAOs',
  ], 'DAO')),
  chapter('web3-pro', 6, 'Cross-chain Bridges', 'Multi-chain interoperability', web3Topics([
    'Bridge architecture types', 'Lock-and-mint patterns', 'LayerZero and CCIP', 'Bridge security incidents',
    'Cross-chain messaging', 'Chain abstraction UX', 'Testing cross-chain flows',
  ], 'Bridges')),
  chapter('web3-pro', 7, 'Web3 Capstone', 'Launch a DeFi product', web3Topics([
    'Full-stack dApp architecture', 'Hardhat deployment pipeline', 'Etherscan verification', 'Mainnet launch checklist',
    'Interview: Solidity patterns', 'Interview: DeFi risks', 'Capstone: audited token + staking', 'Portfolio presentation',
  ], 'Capstone')),
];

// ─── 4. Cloud Native Developer (12 weeks, 48 topics) ────────────────────────
const cloudTopics = (titles: string[], tag: string): Topic[] =>
  titles.map((title, i) =>
    topic(tid++, title, i % 3 === 0 ? 'Beginner' : 'Intermediate', 'fqMOX6JJhGo', [tag, 'Cloud Native', 'DevOps'])
  );

const CLOUD_NATIVE_CHAPTERS = [
  chapter('cloud-native', 1, 'Docker Compose & Containers', 'Multi-container apps', cloudTopics([
    'Dockerfile best practices', 'Multi-stage builds', 'Docker Compose services', 'Networking in Compose',
    'Volume management', 'Health checks', 'Container security scanning', 'Registry workflows',
  ], 'Docker')),
  chapter('cloud-native', 2, 'Kubernetes Core', 'Orchestration fundamentals', cloudTopics([
    'Pods and Deployments', 'Services and Ingress', 'ConfigMaps and Secrets', 'Persistent volumes',
    'RBAC and namespaces', 'Resource limits', 'Helm charts', 'kubectl debugging',
  ], 'Kubernetes')),
  chapter('cloud-native', 3, 'Kubernetes Operators', 'Automating complex apps', cloudTopics([
    'CRD and controllers', 'Operator SDK overview', 'StatefulSets patterns', 'Custom resources',
    'Admission webhooks', 'GitOps with ArgoCD', 'Kustomize overlays', 'Cluster upgrades',
  ], 'Operators')),
  chapter('cloud-native', 4, 'Terraform IaC', 'Infrastructure as code', cloudTopics([
    'Terraform state management', 'Modules and workspaces', 'AWS provider patterns', 'Plan and apply workflow',
    'Remote state with S3', 'Policy as code (OPA)', 'Drift detection', 'Multi-environment setups',
  ], 'Terraform')),
  chapter('cloud-native', 5, 'Observability Stack', 'Monitor production systems', cloudTopics([
    'Prometheus metrics', 'Grafana dashboards', 'Alertmanager rules', 'OpenTelemetry tracing',
    'Log aggregation (Loki)', 'SLOs and error budgets', 'On-call runbooks', 'Incident response',
  ], 'Observability')),
  chapter('cloud-native', 6, 'CI/CD & Service Mesh', 'Advanced delivery patterns', cloudTopics([
    'GitHub Actions pipelines', 'Canary deployments', 'Blue-green releases', 'Istio service mesh',
    'mTLS between services', 'Traffic splitting', 'Capstone: cloud-native microservice', 'Interview: K8s troubleshooting',
  ], 'CI/CD')),
];

export const NEW_TRACK_ROADMAPS: Record<string, Roadmap> = {
  'ai-ml-engineer': baseRoadmap(
    'ai-ml-engineer',
    'AI/ML Engineer',
    'Master neural networks, transformers, MLOps, HuggingFace, PyTorch, and LLM fine-tuning for production AI roles.',
    '14 weeks',
    'advanced',
    '🧠',
    'from-violet-500 to-purple-600',
    ['PyTorch', 'Transformers', 'MLOps', 'HuggingFace', 'LLM Fine-tuning', 'Computer Vision'],
    ['ML Engineer', 'AI Engineer', 'MLOps Engineer', 'LLM Engineer'],
    AI_ML_CHAPTERS
  ),
  'data-engineering': baseRoadmap(
    'data-engineering',
    'Data Engineering',
    'Build production data pipelines with SQL, Spark, Airflow, Kafka, data lakes, and ETL best practices.',
    '12 weeks',
    'intermediate',
    '🗄️',
    'from-blue-500 to-cyan-600',
    ['SQL', 'Spark', 'Airflow', 'Kafka', 'Data Lakes', 'ETL'],
    ['Data Engineer', 'Analytics Engineer', 'Platform Engineer'],
    DATA_ENG_CHAPTERS
  ),
  'web3-pro': baseRoadmap(
    'web3-pro',
    'Web3/Blockchain Pro',
    'Advanced Solidity, smart contract auditing, DeFi protocols, IPFS, DAO development, and cross-chain bridges.',
    '14 weeks',
    'advanced',
    '⛓️',
    'from-amber-500 to-orange-600',
    ['Solidity', 'DeFi', 'Auditing', 'IPFS', 'DAO', 'Cross-chain'],
    ['Smart Contract Developer', 'Web3 Engineer', 'DeFi Developer', 'Blockchain Auditor'],
    WEB3_CHAPTERS
  ),
  'cloud-native': baseRoadmap(
    'cloud-native',
    'Cloud Native Developer',
    'Docker Compose, Kubernetes operators, Terraform, Prometheus/Grafana, advanced CI/CD, and service mesh.',
    '12 weeks',
    'intermediate',
    '☁️',
    'from-sky-500 to-indigo-600',
    ['Docker', 'Kubernetes', 'Terraform', 'Prometheus', 'CI/CD', 'Service Mesh'],
    ['Cloud Engineer', 'Platform Engineer', 'SRE', 'DevOps Engineer'],
    CLOUD_NATIVE_CHAPTERS
  ),
};
