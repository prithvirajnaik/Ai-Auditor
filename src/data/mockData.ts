/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIToolPricing, SubscriptionItem, AuditReport, Recommendation } from '../types';

export const AI_TOOLS_PRICING: AIToolPricing[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: '🧠',
    description: 'General intelligence chatbot system by OpenAI.',
    plans: [
      { name: 'Plus (Individual)', price: 20, billing: 'monthly', features: ['GPT-4o Access', 'Custom GPTs', 'Data Analysis'] },
      { name: 'Team', price: 25, billing: 'monthly', features: ['Admin Console', 'Shared Workspace', 'Data Privacy'] }
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    logo: '🌊',
    description: 'Constitutional AI assistant designed by Anthropic.',
    plans: [
      { name: 'Pro (Individual)', price: 20, billing: 'monthly', features: ['Claude 3.5 Sonnet', 'Projects feature', 'High limits'] },
      { name: 'Team', price: 25, billing: 'monthly', features: ['Admin controls', 'Centralized billing', 'Increased limits'] }
    ]
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: '🎯',
    description: 'AI-first code editor with deep project understanding.',
    plans: [
      { name: 'Pro', price: 20, billing: 'monthly', features: ['500 Fast queries', 'Composer multi-file edit'] },
      { name: 'Business', price: 40, billing: 'monthly', features: ['SSO', 'Privacy Mode', 'Central billing'] }
    ]
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    logo: '🐙',
    description: 'Inline autocomplete and chat programmer companion.',
    plans: [
      { name: 'Individual', price: 10, billing: 'monthly', features: ['IDE Autocomplete', 'Copilot Chat'] },
      { name: 'Business', price: 19, billing: 'monthly', features: ['Org management', 'IP indemnity'] }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    logo: '🌌',
    description: 'Google multimodal foundation assistant & Workspace AI.',
    plans: [
      { name: 'Advanced', price: 20, billing: 'monthly', features: ['1.5 Pro to Workspace', 'Large context window'] },
      { name: 'Business', price: 20, billing: 'monthly', features: ['Admin panel', 'Docs audit integration'] }
    ]
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    logo: '🔋',
    description: 'Developer endpoints for GPT-4o, embeddings, and fine-tuning.',
    plans: [
      { name: 'Tier 1 API Usage', price: 150, billing: 'monthly', features: ['Pay-as-you-go credit limits', 'Model endpoints'] },
      { name: 'Tier 2 API Usage', price: 500, billing: 'monthly', features: ['Higher rate limits', 'Dedicated throughput'] }
    ]
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    logo: '💎',
    description: 'Developer access to Claude 3.5 Sonnet, Haiku, and Opus endpoints.',
    plans: [
      { name: 'Tier 1 API Usage', price: 100, billing: 'monthly', features: ['Pay-as-you-go', 'Sonnet access'] },
      { name: 'Tier 2 API Usage', price: 350, billing: 'monthly', features: ['High throughput model limits'] }
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
      { name: 'Pro', price: 20, billing: 'monthly', features: ['Unlimited generations', 'Design-to-code exports'] }
    ]
  }
];

export const FAQS = [
  {
    question: 'How does Auto Audit work without workspace access?',
    answer: 'We operate purely on metadata logic. Instead of requesting administrative API authorization, our analysis checks your active seat counts, plan tiers, and department maps to identify duplicate tool allocations and idle accounts.'
  },
  {
    question: 'What constitutes a "duplicate tool"?',
    answer: 'Duplicate tool flags occur when identical teams run concurrent paid licenses for competing tools of overlapping capability. Common duplicate pairings include engineers holding both Claude Pro and ChatGPT Plus, or developers holding both GitHub Copilot and Cursor Pro.'
  },
  {
    question: 'Are my input numbers stored on a database?',
    answer: 'No. All uploaded lists and workspace profiles are parsed in-memory and persisted only in secure local storage configuration within your browser. There is no external database or backend synchronization to guarantee data privacy.'
  }
];

export const TESTIMONIALS = [
  {
    quote: "Auto Audit tracked down $410/mo in redundant GitHub Copilot seats we didn't realize were active among developers who had migrated to Cursor. Clear, quick financial win.",
    author: "Aris Vance",
    role: "VP of Engineering, CloudStrike",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    quote: "We consolidated 18 individual ChatGPT accounts into a single Team billing contract. Reclaimed $90/mo in shadow spending and standardized our security policy.",
    author: "Elena Markova",
    role: "Director of Operations, HyperGlow",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

// Believable startup spacing and realistic AI spending models list
export const INITIAL_SPRAWL_SUBSCRIPTIONS: SubscriptionItem[] = [
  { id: 'sub-1', toolId: 'chatgpt', toolName: 'ChatGPT', planName: 'Plus (Individual)', department: 'Engineering', seats: 12, costPerSeat: 20, totalCost: 240, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-2', toolId: 'claude', toolName: 'Claude', planName: 'Pro (Individual)', department: 'Engineering', seats: 8, costPerSeat: 20, totalCost: 160, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-3', toolId: 'cursor', toolName: 'Cursor', planName: 'Pro', department: 'Engineering', seats: 10, costPerSeat: 20, totalCost: 200, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-4', toolId: 'copilot', toolName: 'GitHub Copilot', planName: 'Business', department: 'Engineering', seats: 10, costPerSeat: 19, totalCost: 190, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-5', toolId: 'openai_api', toolName: 'OpenAI API', planName: 'Tier 1 API Usage', department: 'Engineering', seats: 1, costPerSeat: 150, totalCost: 150, billingCycle: 'monthly', status: 'active' },
  { id: 'sub-6', toolId: 'v0', toolName: 'v0', planName: 'Pro', department: 'Product', seats: 4, costPerSeat: 20, totalCost: 80, billingCycle: 'monthly', status: 'active' }
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Consolidate developer editors under Cursor Pro',
    description: 'Engineering holds overlapping subscriptions for both Cursor and GitHub Copilot. Standardize on Cursor to reclaim Copilot seat licensing costs.',
    currentSpend: 390,
    recommendedAction: 'Decommission duplicate GitHub Copilot licenses ($19/seat) for the 10 common developer seats.',
    estimatedMonthlySavings: 190,
    estimatedAnnualSavings: 2280,
    reasoning: 'Cursor Pro includes high-speed Claude 3.5 Sonnet and GPT-4o context natively. Retaining separate autocomplete packages duplicates cost without expanding output.',
    toolId: 'copilot',
    type: 'consolidate',
    status: 'pending'
  },
  {
    id: 'rec-2',
    title: 'Deduplicate concurrent ChatGPT and Claude seat pairings',
    description: 'Overlap analysis suggests roughly 8 team members hold concurrent active individual subscriptions to both ChatGPT Plus and Claude Pro.',
    currentSpend: 400,
    recommendedAction: 'Adopt one primary general-purpose model as standard, and decommission overlapping duplicate seats.',
    estimatedMonthlySavings: 160,
    estimatedAnnualSavings: 1920,
    reasoning: 'Running concurrent premium chat seats for identical employees represents direct capability redundancy. Finance standards recommend standardizing on a single organization-wide core package.',
    toolId: 'claude',
    type: 'remove_redundant',
    status: 'pending'
  }
];

export const DEFAULT_MOCK_REPORT: AuditReport = {
  id: 'rep-default',
  companyName: 'Acme Rockets Inc.',
  domainName: 'acme-rockets.com',
  auditDate: 'May 2026',
  teamSize: 22,
  primaryUseCase: 'Product Development',
  currentSpendMonthly: 1020,
  optimizedSpendMonthly: 670,
  potentialMonthlySavings: 350,
  potentialAnnualSavings: 4200,
  duplicateToolsCount: 2,
  inactiveSeatsCount: 3,
  subscriptionsAnalyzed: INITIAL_SPRAWL_SUBSCRIPTIONS,
  recommendations: MOCK_RECOMMENDATIONS,
  teamMetrics: [
    { department: 'Engineering', spend: 940, seats: 41, costPerEmployee: 22.92, toolsUsed: ['ChatGPT', 'Claude', 'Cursor', 'GitHub Copilot', 'OpenAI API'] },
    { department: 'Product', spend: 80, seats: 4, costPerEmployee: 20.00, toolsUsed: ['v0'] }
  ],
  aiSummary: "Your team is running unmanaged concurrent developer environments and chatbot seat subscriptions. De-duplicating individual developer licenses across both Cursor Pro and GitHub Copilot in Engineering saves an immediate $190/mo, while centralizing overlapping Claude Pro and ChatGPT Plus seats recovers another $160/mo. Standardizing on core tools provides clear finance governance and locks in a flat cost of $670/mo."
};
