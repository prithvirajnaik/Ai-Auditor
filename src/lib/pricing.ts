import { AIToolPricing } from '../types';

export const AI_TOOLS_PRICING: AIToolPricing[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: '🧠',
    description: 'General intelligence chatbot system by OpenAI.',
    plans: [
      { name: 'Plus (Individual)', price: 20, billing: 'monthly', features: ['GPT-4o Access', 'Custom GPTs', 'Data Analysis'] },
      { name: 'Team', price: 25, billing: 'monthly', features: ['Admin Console', 'Shared Workspace', 'Data Privacy'] },
      { name: 'Enterprise', price: 60, billing: 'monthly', features: ['Unlimited high-speed GPT-4o', 'Dedicated workspace controls', 'Enterprise support'] },
      { name: 'API', price: 100, billing: 'monthly', features: ['Usage-based API key tokens', 'Custom fine-tuning endpoints'] }
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    logo: '🌊',
    description: 'Constitutional AI assistant designed by Anthropic.',
    plans: [
      { name: 'Free', price: 0, billing: 'monthly', features: ['Basic access to Claude models', 'Web usage limits'] },
      { name: 'Pro (Individual)', price: 20, billing: 'monthly', features: ['Claude 3.5 Sonnet', 'Projects feature', 'High limits'] },
      { name: 'Max', price: 40, billing: 'monthly', features: ['Double usage capacity of Pro', 'Early access to new features'] },
      { name: 'Team', price: 25, billing: 'monthly', features: ['Admin controls', 'Centralized billing', 'Increased limits'] },
      { name: 'Enterprise', price: 75, billing: 'monthly', features: ['Enterprise security compliance', 'Priority 24/7 support'] },
      { name: 'API', price: 100, billing: 'monthly', features: ['Developer console API key access'] }
    ]
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: '🎯',
    description: 'AI-first code editor with deep project understanding.',
    plans: [
      { name: 'Hobby', price: 0, billing: 'monthly', features: ['Basic autocomplete', '50 slow GPT-4 queries'] },
      { name: 'Pro', price: 20, billing: 'monthly', features: ['500 Fast queries', 'Composer multi-file edit'] },
      { name: 'Business', price: 40, billing: 'monthly', features: ['SSO', 'Privacy Mode', 'Central billing'] },
      { name: 'Enterprise', price: 100, billing: 'monthly', features: ['Enterprise guardrails', 'Dedicated custom models'] }
    ]
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    logo: '🐙',
    description: 'Inline autocomplete and chat programmer companion.',
    plans: [
      { name: 'Individual', price: 10, billing: 'monthly', features: ['IDE Autocomplete', 'Copilot Chat'] },
      { name: 'Business', price: 19, billing: 'monthly', features: ['Org management', 'IP indemnity'] },
      { name: 'Enterprise', price: 39, billing: 'monthly', features: ['Fine-tuned models', 'Advanced codebase search'] }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    logo: '🌌',
    description: 'Google multimodal foundation assistant & Workspace AI.',
    plans: [
      { name: 'Pro', price: 20, billing: 'monthly', features: ['1.5 Pro to Workspace', 'Large context window'] },
      { name: 'Ultra', price: 30, billing: 'monthly', features: ['Highest capability reasoning engine', 'Docs integration'] },
      { name: 'API', price: 100, billing: 'monthly', features: ['Google AI Studio API key developer endpoints'] }
    ]
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    logo: '🔋',
    description: 'Developer endpoints for GPT-4o, embeddings, and fine-tuning.',
    plans: [
      { name: 'Tier 1 API Usage', price: 100, billing: 'monthly', features: ['Pay-as-you-go credit limits', 'Model endpoints'] },
      { name: 'Tier 2 API Usage', price: 250, billing: 'monthly', features: ['Higher rate limits', 'Dedicated throughput'] },
      { name: 'Tier 3 API Usage', price: 500, billing: 'monthly', features: ['Tier 3 organization quotas'] },
      { name: 'Tier 4 API Usage', price: 1000, billing: 'monthly', features: ['Premium high-capacity quotas'] }
    ]
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    logo: '💎',
    description: 'Developer access to Claude 3.5 Sonnet, Haiku, and Opus endpoints.',
    plans: [
      { name: 'Tier 1 API Usage', price: 100, billing: 'monthly', features: ['Pay-as-you-go', 'Sonnet access'] },
      { name: 'Tier 2 API Usage', price: 250, billing: 'monthly', features: ['High throughput model limits'] },
      { name: 'Tier 3 API Usage', price: 500, billing: 'monthly', features: ['Tier 3 Anthropic Console quotas'] }
    ]
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    logo: '🏄',
    description: 'AI-first code editor with interactive agent features by Codeium.',
    plans: [
      { name: 'Pro', price: 15, billing: 'monthly', features: ['Unlimited autocomplete', 'AI flow agent'] },
      { name: 'Team', price: 30, billing: 'monthly', features: ['Shared policies', 'Centralized billing'] }
    ]
  },
  {
    id: 'v0',
    name: 'v0',
    logo: '✨',
    description: 'Generative UI and React component builder by Vercel.',
    plans: [
      { name: 'Pro', price: 20, billing: 'monthly', features: ['Unlimited generations', 'Design-to-code exports'] },
      { name: 'Enterprise', price: 60, billing: 'monthly', features: ['Team workspace controls', 'Shared design tokens'] }
    ]
  }
];

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
  'Finance',
  'Design',
  'Support'
];

export const USE_CASES = [
  'Coding',
  'Writing & Copywriting',
  'Research',
  'Data Analytics',
  'Mixed Usage'
];
