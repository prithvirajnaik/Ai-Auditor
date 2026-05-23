import { SubscriptionItem, Recommendation, TeamSpendMetric, AuditReport } from '../types';
import {
  calculateTotalSpend,
  groupSpendByDepartment,
  calculateOptimizedSpend,
  calculateInactiveSeats,
  calculateDuplicateTools
} from './calculations';

/**
 * Runs the deterministic AI audit engine analysis on current subscription metadata.
 */
export function runAuditAnalysis(
  companyName: string,
  domainName: string,
  teamSize: number,
  primaryUseCase: string,
  subscriptions: SubscriptionItem[]
): AuditReport {
  const items = subscriptions || [];
  const currentSpendMonthly = calculateTotalSpend(items);
  const teamMetrics = groupSpendByDepartment(items);

  // 1. Calculate Inactive Seats
  // Direct inactive seats + estimated ghost seats if active seats are disproportionate to team size
  const inactiveSeatsCount = calculateInactiveSeats(items, teamSize);

  const totalSeats = items
    .filter(i => i.status === 'active')
    .reduce((sum, i) => sum + i.seats, 0);

  // If active subscription seats are extremely high compared to the team size, flag the surplus as ghost seats
  const activeSeatsLimit = Math.round(teamSize * 1.3);
  const estimatedGhostSeats = Math.max(0, totalSeats - activeSeatsLimit);

  // 2. Calculate Duplicate Tools
  // Count departments having duplicate tools
  const duplicateToolsCount = calculateDuplicateTools(items);


  // 3. Generate Recommendations
  const recommendations: Recommendation[] = [];
  let recIdCounter = 1;

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
    const savings = Math.max(0, Math.min(estimatedMonthlySavings, currentSpend));
    if (savings <= 0) return;
    recommendations.push({
      id: `rec-rule-${recIdCounter++}`,
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

  // RULE A: Cursor + Copilot Overlap in same department (Engineering)
  items.filter(i => i.status === 'active').forEach(item1 => {
    if (item1.toolId === 'cursor') {
      const copilotOverlap = items.find(
        i => i.toolId === 'copilot' && i.department === item1.department && i.status === 'active'
      );
      if (copilotOverlap) {
        const overlapSeats = Math.min(item1.seats, copilotOverlap.seats);
        const savings = overlapSeats * copilotOverlap.costPerSeat;
        addRec(
          `Consolidate Developer Editors under Cursor in ${item1.department}`,
          `Engineering is running concurrent active seat allocations for both Cursor ($${item1.costPerSeat}/seat) and GitHub Copilot ($${copilotOverlap.costPerSeat}/seat) in the ${item1.department} department.`,
          item1.totalCost + copilotOverlap.totalCost,
          `Decommission duplicate GitHub Copilot licenses ($${copilotOverlap.costPerSeat}/seat) for the ${overlapSeats} overlapping developers.`,
          savings,
          `Cursor includes native autocomplete, chat interfaces, and codebase indexing utilizing Claude 3.5 Sonnet and GPT-4o. Keeping standalone GitHub Copilot licenses for the same users duplicates costs with no additional yield.`,
          'copilot',
          'remove_redundant'
        );
      }
    }
  });

  // RULE B: Cursor + Windsurf Overlap in same department
  items.filter(i => i.status === 'active').forEach(item1 => {
    if (item1.toolId === 'cursor') {
      const windsurfOverlap = items.find(
        i => i.toolId === 'windsurf' && i.department === item1.department && i.status === 'active'
      );
      if (windsurfOverlap) {
        const overlapSeats = Math.min(item1.seats, windsurfOverlap.seats);
        const savings = overlapSeats * windsurfOverlap.costPerSeat;
        addRec(
          `Standardize on one AI Code Editor in ${item1.department}`,
          `We detected developers using both Cursor and Windsurf code editors concurrently in ${item1.department}. This creates workflow fragmentation and billing sprawl.`,
          item1.totalCost + windsurfOverlap.totalCost,
          `Consolidate all developer editor seats under Cursor and decommission ${overlapSeats} duplicate Windsurf subscriptions.`,
          savings,
          `Standardizing on a single AI code editor simplifies organization-wide codebase indexing policies, unifies license management, and prevents overlapping subscription overhead.`,
          'windsurf',
          'consolidate'
        );
      }
    }
  });

  // RULE C: Chatbot Duplication Overlap (ChatGPT vs Claude vs Gemini)
  const chatIds = ['chatgpt', 'claude', 'gemini'];
  // Group by department to check for chat tool overlaps
  const depts = Array.from(new Set(items.map(i => i.department)));
  depts.forEach(dept => {
    const deptChatSubs = items.filter(
      i => chatIds.includes(i.toolId) && i.department === dept && i.status === 'active'
    );
    if (deptChatSubs.length > 1) {
      // Find the two largest chat subs by spend
      const sortedChatSubs = [...deptChatSubs].sort((a, b) => b.totalCost - a.totalCost);
      const sub1 = sortedChatSubs[0];
      const sub2 = sortedChatSubs[1];
      const overlapSeats = Math.min(sub1.seats, sub2.seats);
      const savings = overlapSeats * sub2.costPerSeat;

      addRec(
        `Deduplicate concurrent ${sub1.toolName} & ${sub2.toolName} seats in ${dept}`,
        `We identified overlapping chat assistant licenses in the ${dept} department. Multiple team members are expensing seats for both ${sub1.toolName} and ${sub2.toolName}.`,
        sub1.totalCost + sub2.totalCost,
        `Choose one primary assistant standard (e.g. ${sub1.toolName}) and decommission ${overlapSeats} redundant seats of ${sub2.toolName}.`,
        savings,
        `Both general-purpose assistants provide comparable capability in document summarization, reasoning, and research. Pruning overlapping seats saves direct tooling costs without impacting department output.`,
        sub2.toolId,
        'remove_redundant'
      );
    }
  });

  // RULE D: Small Teams Overpaying for Team Plans (with high seat minimums or higher unit rates)
  items.filter(i => i.status === 'active').forEach(sub => {
    if (sub.toolId === 'claude' && sub.planName.toLowerCase().includes('team')) {
      // Claude Team has a 5-seat minimum. If seat count is less than 5, they are billed for 5.
      // If they only have, say, 2 users, they pay $25 * 5 = $125.
      // Downgrading to Pro (Individual) at $20/seat for 2 seats costs $40. Savings = $85.
      if (sub.seats < 5) {
        const currentBilledCost = 5 * sub.costPerSeat; // bills 5 minimum
        const individualBilledCost = sub.seats * 20; // 20 per individual Pro seat
        const savings = currentBilledCost - individualBilledCost;

        addRec(
          `Optimize Claude Team Plan seat minimums`,
          `Your team is paying for Claude Team tier ($25/seat) with only ${sub.seats} users. Because the Team plan requires a 5-seat minimum, you are being billed for ${5 - sub.seats} empty slots.`,
          currentBilledCost,
          `Downgrade Claude Team to ${sub.seats} Claude Pro individual licenses to bypass the seat minimum rule.`,
          savings,
          `Startups with under 5 users can bypass Claude's Team plan seat minimum billing constraints by migrating to individual Pro accounts. This preserves identical model capacities while saving up to $105/mo.`,
          'claude',
          'downgrade'
        );
      }
    }

    if (sub.toolId === 'chatgpt' && sub.planName.toLowerCase().includes('team')) {
      // ChatGPT Team has a 2-seat minimum. If they have 1 seat on Team ($25/seat * 2 = $50),
      // they can downgrade to Plus ($20/seat * 1 = $20) and save $30.
      if (sub.seats === 1) {
        const currentBilledCost = 2 * sub.costPerSeat;
        const individualBilledCost = 20;
        const savings = currentBilledCost - individualBilledCost;

        addRec(
          `Downgrade ChatGPT Team license to Plus`,
          `ChatGPT Team tier ($25/seat) is configured for 1 user. Team plans enforce a 2-seat minimum, billing you $50/mo.`,
          currentBilledCost,
          `Downgrade to a single ChatGPT Plus individual account ($20/mo).`,
          savings,
          `Single-user workloads do not require team admin consoles or shared spaces. Pruning the extra empty slot saves $30/mo.`,
          'chatgpt',
          'downgrade'
        );
      }
    }
  });

  // RULE E: Ghost / Idle Seats (excess seat counts vs total team size)
  if (estimatedGhostSeats > 0) {
    // We calculate savings on pruning the excess seats. Let's find average cost per seat.
    const averageSeatCost = currentSpendMonthly / Math.max(totalSeats, 1);
    const savings = estimatedGhostSeats * averageSeatCost;

    addRec(
      `Prune Ghost Licenses and Idle Seat Allocations`,
      `Your combined AI active seat allocations (${totalSeats}) exceeds your reported organization team size of ${teamSize} by a wide margin. Our diagnostics estimate at least ${estimatedGhostSeats} inactive or unallocated seats.`,
      Math.round(estimatedGhostSeats * averageSeatCost),
      `Perform a seat audit on Okta/Google Workspace and decommission ${estimatedGhostSeats} idle user accounts.`,
      savings,
      `Unused seats commonly pile up as team members depart or transition to alternative roles. Standardizing seat audits recovers overhead immediately.`,
      'chatgpt',
      'downgrade'
    );
  }

  // Also catch explicitly inactive subscriptions and recommend removing them
  items.forEach(sub => {
    if (sub.status === 'inactive' && sub.seats > 0) {
      addRec(
        `Cancel inactive ${sub.toolName} subscription`,
        `The subscription for ${sub.toolName} (${sub.planName}) in ${sub.department} is marked as inactive but still represents an active billing agreement.`,
        sub.totalCost,
        `Formally cancel the ${sub.toolName} billing agreement.`,
        sub.totalCost,
        `Subscriptions marked as inactive should be deleted at the provider level to avoid recurring credit card charges.`,
        sub.toolId,
        'remove_redundant'
      );
    }
  });

  // RULE F: API Overspending (OpenAI & Anthropic API Caching)
  const openaiApi = items.find(i => i.toolId === 'openai_api' && i.status === 'active');
  const anthropicApi = items.find(i => i.toolId === 'anthropic_api' && i.status === 'active');
  if (openaiApi || anthropicApi) {
    const combinedSpend = (openaiApi?.totalCost || 0) + (anthropicApi?.totalCost || 0);
    const savings = combinedSpend * 0.20; // 20% savings

    addRec(
      `Deploy API Semantic Caching Layer`,
      `Your development environment is hitting raw LLM APIs directly. Integrating a semantic caching proxy (e.g. GPTCache) filters repetitive prompts.`,
      combinedSpend,
      `Configure a shared client-side caching layer to reduce raw model API calls by ~20%.`,
      savings,
      `Development suites and user prompts often repeat similar instructions. An organization-wide semantic token cache prevents redundant completion hits to OpenAI/Anthropic, saving up to 20% on token fees.`,
      openaiApi ? 'openai_api' : 'anthropic_api',
      'usage_routing'
    );
  }

  // RULE G: Consolidation of individual Pro/Plus accounts to central invoices
  const individualSubs = items.filter(
    i => (i.planName.toLowerCase().includes('individual') || i.planName.toLowerCase().includes('pro') || i.planName.toLowerCase().includes('plus')) &&
         i.seats >= 3 &&
         i.status === 'active' &&
         !['openai_api', 'anthropic_api'].includes(i.toolId)
  );

  individualSubs.forEach(sub => {
    // If there are 3 or more individual seats expensed separately, suggest moving them to a centralized invoice
    // which usually saves administrative overhead and lets the admin prune orphan accounts.
    const savings = sub.totalCost * 0.15; // 15% estimated administrative and orphan pruning savings
    addRec(
      `Consolidate individual ${sub.toolName} seats under central corporate invoice`,
      `We detected ${sub.seats} individual ${sub.toolName} accounts expensed separately on employee cards in ${sub.department}.`,
      sub.totalCost,
      `Migrate ad-hoc cards to a centralized workspace team billing agreement.`,
      savings,
      `Ad-hoc subscription reporting hides orphan accounts and blocks central license recycling. Centralizing team agreements reduces administrative card leakage by 15% on average.`,
      sub.toolId,
      'consolidate'
    );
  });

  // Fallback if no dynamic recommendations matched
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-fallback',
      title: 'Maintain subscription audits quarterly',
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

  // Calculate dynamic totals based on the original report
  const potentialMonthlySavings = recommendations.reduce((sum, r) => sum + r.estimatedMonthlySavings, 0);
  const optimizedSpendMonthly = Math.max(0, currentSpendMonthly - potentialMonthlySavings);
  const potentialAnnualSavings = potentialMonthlySavings * 12;

  // Build AI Summary dynamically
  let aiSummary = '';
  if (potentialMonthlySavings > 0) {
    const topRec = [...recommendations].sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings)[0];
    aiSummary = `Our audit for ${companyName || 'your startup'} identifies potential savings of $${potentialMonthlySavings}/mo ($${potentialAnnualSavings}/yr) by streamlining concurrent tools. The largest single opportunity is "${topRec.title}", saving an estimated $${topRec.estimatedMonthlySavings}/mo. Consolidating overlapping seats in engineering and administrative departments reduces spending without reducing development speed.`;
  } else {
    aiSummary = `Your organizational AI stack is highly optimized! Your combined monthly spend of $${currentSpendMonthly} shows zero unmanaged overlapping developer licenses or ghost seats. Continue reviewing quarterly to preserve this capital efficiency.`;
  }

  return {
    id: `rep-${Math.random().toString(36).substr(2, 9)}`,
    companyName: companyName || 'My Startup',
    domainName: domainName || 'mystartup.com',
    auditDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    teamSize: teamSize || 10,
    primaryUseCase: primaryUseCase || 'Product Development',
    currentSpendMonthly,
    optimizedSpendMonthly,
    potentialMonthlySavings,
    potentialAnnualSavings,
    duplicateToolsCount,
    inactiveSeatsCount,
    subscriptionsAnalyzed: items,
    recommendations,
    teamMetrics,
    aiSummary
  };
}
