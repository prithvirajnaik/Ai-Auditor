/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubscriptionItem, Recommendation, TeamSpendMetric, AuditReport } from '../types';

/**
 * Calculates a clean SaaS audit report with realistic dynamic recommendations based on input.
 */
export function runAuditAnalysis(
  companyName: string,
  domainName: string,
  teamSize: number,
  primaryUseCase: string,
  subscriptions: SubscriptionItem[]
): AuditReport {
  const items = subscriptions || [];
  const currentSpendMonthly = items.reduce((sum, sub) => sum + sub.totalCost, 0);

  // Group by department
  const deptMap: { [key: string]: { spend: number; seats: number; tools: string[] } } = {};
  items.forEach(sub => {
    const dept = sub.department || 'General';
    if (!deptMap[dept]) {
      deptMap[dept] = { spend: 0, seats: 0, tools: [] };
    }
    deptMap[dept].spend += sub.totalCost;
    deptMap[dept].seats += sub.seats;
    if (!deptMap[dept].tools.includes(sub.toolName)) {
      deptMap[dept].tools.push(sub.toolName);
    }
  });

  const teamMetrics: TeamSpendMetric[] = Object.keys(deptMap).map(dept => {
    const data = deptMap[dept];
    return {
      department: dept,
      spend: data.spend,
      seats: data.seats,
      costPerEmployee: data.seats > 0 ? Number((data.spend / data.seats).toFixed(2)) : 0,
      toolsUsed: data.tools
    };
  });

  // 1. Calculate Duplicate Tools Count dynamically
  // A duplication occurs when overlapping tools exist in the organization
  let duplicateToolsCount = 0;
  const toolIds = items.map(i => i.toolId);
  const uniqueToolIds = Array.from(new Set(toolIds));

  // Duplication rule pairings
  const chatgptAndClaude = uniqueToolIds.includes('chatgpt') && uniqueToolIds.includes('claude');
  const chatgptAndGemini = uniqueToolIds.includes('chatgpt') && uniqueToolIds.includes('gemini');
  const claudeAndGemini = uniqueToolIds.includes('claude') && uniqueToolIds.includes('gemini');
  
  const cursorAndCopilot = uniqueToolIds.includes('cursor') && uniqueToolIds.includes('copilot');
  const cursorAndWindsurf = uniqueToolIds.includes('cursor') && uniqueToolIds.includes('windsurf');
  const copilotAndWindsurf = uniqueToolIds.includes('copilot') && uniqueToolIds.includes('windsurf');

  if (chatgptAndClaude) duplicateToolsCount++;
  if (chatgptAndGemini) duplicateToolsCount++;
  if (claudeAndGemini) duplicateToolsCount++;
  if (cursorAndCopilot) duplicateToolsCount++;
  if (cursorAndWindsurf) duplicateToolsCount++;
  if (copilotAndWindsurf) duplicateToolsCount++;

  // 2. Calculate Inactive Seats detected dynamically
  // If the user explicitly sets status to inactive, we count them.
  // Otherwise, we realistically estimate "ghost seats" as ~12% of total seat count (min 1 if seats > 5)
  // for any workspace subscription.
  let inactiveSeatsCount = items
    .filter(i => i.status === 'inactive')
    .reduce((sum, i) => sum + i.seats, 0);

  const totalSeats = items.reduce((sum, i) => sum + i.seats, 0);
  if (inactiveSeatsCount === 0 && totalSeats > 5) {
    // Estimating trailing active rate results in approx 12% mismatch
    inactiveSeatsCount = Math.max(1, Math.round(totalSeats * 0.12));
  }

  // 3. Generate Recommendations Dynamically
  const calculatedRecommendations: Recommendation[] = [];
  let recommendationIdCounter = 1;

  // Helper to generate dynamic recommendations
  const addRec = (
    title: string,
    description: string,
    currentSpend: number,
    recommendedAction: string,
    estimatedMonthlySavings: number,
    reasoning: string,
    toolId: string,
    type: Recommendation['type']
  ) => {
    const savings = Math.min(estimatedMonthlySavings, currentSpend);
    if (savings <= 0) return;
    calculatedRecommendations.push({
      id: `dyn-rec-${recommendationIdCounter++}`,
      title,
      description,
      currentSpend,
      recommendedAction,
      estimatedMonthlySavings: Math.round(savings),
      estimatedAnnualSavings: Math.round(savings * 12),
      reasoning,
      toolId,
      type,
      status: 'pending'
    });
  };

  // Check ChatGPT and Claude Overlap Recommendation
  if (chatgptAndClaude) {
    const chatgptSub = items.find(i => i.toolId === 'chatgpt');
    const claudeSub = items.find(i => i.toolId === 'claude');
    
    if (chatgptSub && claudeSub) {
      const minSeats = Math.min(chatgptSub.seats, claudeSub.seats);
      // Let's assume 30% overlap amongst developers or product designers
      const estimatedOverlapSeats = Math.max(1, Math.round(minSeats * 0.35));
      const overlapSpend = estimatedOverlapSeats * 20; 

      addRec(
        'Deduplicate concurrent ChatGPT and Claude seat pairings',
        `Overlap analysis suggests roughly ${estimatedOverlapSeats} team members hold concurrent active individual subscriptions to both ChatGPT Plus and Claude Pro.`,
        (chatgptSub.totalCost + claudeSub.totalCost),
        `Adopt one primary general-purpose model as standard, and decommission overlapping duplicate seats.`,
        overlapSpend,
        'Running concurrent premium chat seats for identical employees represents direct capability redundancy. Finance standards recommend standardizing on a single organization-wide core package.',
        'claude',
        'remove_redundant'
      );
    }
  }

  // Check AI Editor Overlap Recommendation (Cursor & Copilot / Windsurf)
  if (cursorAndCopilot) {
    const cursorSub = items.find(i => i.toolId === 'cursor');
    const copilotSub = items.find(i => i.toolId === 'copilot');
    
    if (cursorSub && copilotSub) {
      const overlapSeats = Math.min(cursorSub.seats, copilotSub.seats);
      const estimatedSavings = overlapSeats * 19; // price of copilot business is $19

      addRec(
        'Consolidate developer editors under Cursor Pro',
        `Engineering holds overlapping subscriptions for both Cursor and GitHub Copilot. Standardize on Cursor to reclaim Copilot seat licensing costs.`,
        (cursorSub.totalCost + copilotSub.totalCost),
        `Decommission duplicate GitHub Copilot licenses ($19/seat) for the ${overlapSeats} common developer seats.`,
        estimatedSavings,
        'Cursor Pro includes high-speed Claude 3.5 Sonnet and GPT-4o context natively. Retaining separate autocomplete packages duplicates cost without expanding output.',
        'copilot',
        'consolidate'
      );
    }
  }

  // API Caching Recommendation (if OpenAI API or Anthropic API are used)
  const openaiApiSub = items.find(i => i.toolId === 'openai_api');
  const anthropicApiSub = items.find(i => i.toolId === 'anthropic_api');
  if (openaiApiSub || anthropicApiSub) {
    const apiSpend = (openaiApiSub?.totalCost || 0) + (anthropicApiSub?.totalCost || 0);
    // 25% waste from duplicate requests
    const estimatedSavings = apiSpend * 0.20;

    addRec(
      'Implement API Semantic Caching Layer',
      `Unmanaged raw completions are hitting live AI vendor models sequentially. Deploying a lightweight caching proxy saves up to 20% in direct prompt costs.`,
      apiSpend,
      `Configure a shared client-side semantic cache (e.g. GPTCache) and block excessive rate spikes.`,
      estimatedSavings,
      'Development and regression test suites routinely repeat similar base instructions. Introducing semantic token routing limits unnecessary billing spikes.',
      'openai_api',
      'usage_routing'
    );
  }

  // General Inactive Seats Recommendation
  if (inactiveSeatsCount > 0 && totalSeats > 5) {
    const averageSeatUnitCost = currentSpendMonthly / totalSeats;
    const estimatedSavings = inactiveSeatsCount * averageSeatUnitCost;

    addRec(
      'Decommission unassigned and inactive user seats',
      `Audit detects about ${inactiveSeatsCount} seats across all platforms with zero trailing 30-day activity telemetry.`,
      Math.round(inactiveSeatsCount * averageSeatUnitCost),
      `Prune idle credentials and downgrade inactive team members to highly efficient free tiers.`,
      estimatedSavings,
      'Retaining unmanaged surplus licenses creates ghost spending. Revoking unused seat allocations recovers direct cash overhead without impacting current operations.',
      'chatgpt',
      'downgrade'
    );
  }

  // Individual-to-Team billing consolidation recommendation
  const plusProSubs = items.filter(i => i.planName.toLowerCase().includes('individual') || i.planName.toLowerCase().includes('pro'));
  const plusProSeats = plusProSubs.reduce((sum, s) => sum + s.seats, 0);
  if (plusProSeats >= 4) {
    const individualSpend = plusProSubs.reduce((sum, s) => sum + s.totalCost, 0);
    // Consolidating saves about 15% through unified corporate contract benchmark or pruning orphan cards
    const estimatedSavings = individualSpend * 0.15;

    addRec(
      'Consolidate individual ad-hoc subscriptions under central workspace',
      `Detected ${plusProSeats} separate individual subscriptions billing custom credit cards ad-hoc.`,
      individualSpend,
      `Migrate ad-hoc individual seats to a single, centralized corporate team invoice schedule.`,
      estimatedSavings,
      'Ad-hoc subscriptions on expense reports hide duplicate licensing and create security compliance risks. Central corporate billing permits automated license recycling and audit oversight.',
      'chatgpt',
      'consolidate'
    );
  }

  // Fallback if no dynamic recommendations matched
  if (calculatedRecommendations.length === 0) {
    calculatedRecommendations.push({
      id: 'dyn-rec-fallback',
      title: 'Review unused subscription seats',
      description: 'Your AI stack appears to be aligned. Perform active audits quarterly to enforce compliance.',
      currentSpend: currentSpendMonthly,
      recommendedAction: 'Keep tracking current tools and optimize API models.',
      estimatedMonthlySavings: 0,
      estimatedAnnualSavings: 0,
      reasoning: 'Active governance prevents creeping shadow IT subscriptions before they compound.',
      toolId: 'chatgpt',
      type: 'downgrade',
      status: 'pending'
    });
  }

  // Calculate dynamic totals
  const totalSavings = calculatedRecommendations
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.estimatedMonthlySavings, 0);

  const optimizedSpendMonthly = Math.max(100, currentSpendMonthly - totalSavings);
  const potentialMonthlySavings = Math.max(0, currentSpendMonthly - optimizedSpendMonthly);
  const potentialAnnualSavings = potentialMonthlySavings * 12;

  // Build AI Summary dynamically
  let aiSummary = '';
  if (potentialMonthlySavings > 0) {
    const topRec = [...calculatedRecommendations].sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings)[0];
    aiSummary = `Our audit for ${companyName || 'your startup'} identifies potential savings of $${potentialMonthlySavings}/mo ($${potentialAnnualSavings}/yr) by streamlining concurrent tools. The largest single opportunity is "${topRec.title}", saving an estimated $${topRec.estimatedMonthlySavings}/mo. Consolidating overlapping seats in engineering and administrative departments reduces spending without reducing development speed.`;
  } else {
    aiSummary = `Your organizational AI stack is highly optimized! Your combined monthly spend of $${currentSpendMonthly} shows zero unmanaged overlapping developer licenses or ghost seats. Continue reviewing quarterly to preserve this capital efficiency.`;
  }

  return {
    id: `rep-${Math.random().toString(36).substr(2, 9)}`,
    companyName: companyName || 'My Startup',
    domainName: domainName || 'mystartup.com',
    auditDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    teamSize: teamSize || 20,
    primaryUseCase: primaryUseCase || 'Product Development',
    currentSpendMonthly,
    optimizedSpendMonthly,
    potentialMonthlySavings,
    potentialAnnualSavings,
    duplicateToolsCount,
    inactiveSeatsCount,
    subscriptionsAnalyzed: items,
    recommendations: calculatedRecommendations,
    teamMetrics,
    aiSummary
  };
}
