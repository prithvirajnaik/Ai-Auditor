import { SubscriptionItem, TeamSpendMetric, Recommendation } from '../types';

/**
 * Calculates the total monthly cost of all active subscriptions.
 */
export function calculateTotalSpend(subscriptions: SubscriptionItem[]): number {
  return subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.totalCost, 0);
}

/**
 * Groups subscription items by department and calculates spend metrics.
 */
export function groupSpendByDepartment(subscriptions: SubscriptionItem[]): TeamSpendMetric[] {
  const activeSubs = subscriptions.filter(sub => sub.status === 'active');
  const deptMap: { [key: string]: { spend: number; seats: number; tools: string[] } } = {};

  activeSubs.forEach(sub => {
    const dept = sub.department || 'Operations';
    if (!deptMap[dept]) {
      deptMap[dept] = { spend: 0, seats: 0, tools: [] };
    }
    deptMap[dept].spend += sub.totalCost;
    deptMap[dept].seats += sub.seats;
    if (!deptMap[dept].tools.includes(sub.toolName)) {
      deptMap[dept].tools.push(sub.toolName);
    }
  });

  return Object.keys(deptMap).map(dept => {
    const data = deptMap[dept];
    return {
      department: dept,
      spend: data.spend,
      seats: data.seats,
      costPerEmployee: data.seats > 0 ? Number((data.spend / data.seats).toFixed(2)) : 0,
      toolsUsed: data.tools
    };
  });
}

/**
 * Calculates the potential optimized spend by deducting active savings from the current spend.
 */
export function calculateOptimizedSpend(
  currentSpend: number,
  recommendations: Recommendation[]
): number {
  const appliedSavings = recommendations
    .filter(rec => rec.status === 'applied')
    .reduce((sum, rec) => sum + rec.estimatedMonthlySavings, 0);
  
  return Math.max(0, currentSpend - appliedSavings);
}

/**
 * Applies active recommendations to subscription items to get the optimized subscriptions list.
 */
export function applyRecommendationsToSubscriptions(
  subscriptions: SubscriptionItem[],
  recommendations: Recommendation[]
): SubscriptionItem[] {
  const nextSubs = subscriptions.map(sub => ({ ...sub }));

  recommendations.filter(r => r.status === 'applied').forEach(rec => {
    // Extract department name if present in title (e.g. "in Engineering")
    const deptMatch = rec.title.match(/in ([A-Za-z]+)/);
    const dept = deptMatch ? deptMatch[1] : null;

    if (rec.type === 'remove_redundant' || rec.type === 'consolidate') {
      const sub = nextSubs.find(
        s => s.toolId === rec.toolId && (!dept || s.department.toLowerCase() === dept.toLowerCase()) && s.status === 'active'
      );
      if (sub) {
        if (rec.estimatedMonthlySavings >= sub.totalCost) {
          sub.status = 'inactive';
          sub.seats = 0;
          sub.totalCost = 0;
        } else {
          const seatsSaved = Math.round(rec.estimatedMonthlySavings / (sub.costPerSeat || 1));
          sub.seats = Math.max(0, sub.seats - seatsSaved);
          sub.totalCost = Math.max(0, sub.totalCost - rec.estimatedMonthlySavings);
          if (sub.seats === 0) {
            sub.status = 'inactive';
          }
        }
      }
    } else if (rec.type === 'downgrade') {
      const sub = nextSubs.find(s => s.toolId === rec.toolId && s.status === 'active');
      if (sub) {
        if (rec.toolId === 'claude') {
          sub.planName = 'Pro (Individual)';
          sub.costPerSeat = 20;
          sub.totalCost = sub.seats * 20;
        } else if (rec.toolId === 'chatgpt') {
          sub.planName = 'Plus (Individual)';
          sub.costPerSeat = 20;
          sub.totalCost = sub.seats * 20;
        } else {
          sub.totalCost = Math.max(0, sub.totalCost - rec.estimatedMonthlySavings);
          const seatsSaved = Math.round(rec.estimatedMonthlySavings / (sub.costPerSeat || 1));
          sub.seats = Math.max(0, sub.seats - seatsSaved);
        }
      }
    } else if (rec.type === 'usage_routing') {
      const sub = nextSubs.find(s => s.toolId === rec.toolId && s.status === 'active');
      if (sub) {
        sub.totalCost = Math.max(0, sub.totalCost - rec.estimatedMonthlySavings);
      }
    }
  });

  return nextSubs;
}

/**
 * Calculates the number of inactive seats from subscriptions (including ghost/idle seats).
 */
export function calculateInactiveSeats(subscriptions: SubscriptionItem[], teamSize: number): number {
  let inactiveCount = subscriptions
    .filter(i => i.status === 'inactive')
    .reduce((sum, i) => sum + i.seats, 0);

  const totalActiveSeats = subscriptions
    .filter(i => i.status === 'active')
    .reduce((sum, i) => sum + i.seats, 0);

  const activeSeatsLimit = Math.round(teamSize * 1.3);
  if (totalActiveSeats > activeSeatsLimit) {
    inactiveCount += (totalActiveSeats - activeSeatsLimit);
  }
  return inactiveCount;
}

/**
 * Calculates the duplicate tools count from subscriptions.
 */
export function calculateDuplicateTools(subscriptions: SubscriptionItem[]): number {
  let duplicateToolsCount = 0;
  const departmentsWithTools: { [dept: string]: string[] } = {};
  subscriptions
    .filter(i => i.status === 'active')
    .forEach(item => {
      const dept = item.department || 'Operations';
      if (!departmentsWithTools[dept]) {
        departmentsWithTools[dept] = [];
      }
      departmentsWithTools[dept].push(item.toolId);
    });

  Object.values(departmentsWithTools).forEach(tools => {
    const uniqueTools = Array.from(new Set(tools));
    const hasChatOverlap = 
      (uniqueTools.includes('chatgpt') && uniqueTools.includes('claude')) ||
      (uniqueTools.includes('chatgpt') && uniqueTools.includes('gemini')) ||
      (uniqueTools.includes('claude') && uniqueTools.includes('gemini'));
    
    const hasEditorOverlap = 
      (uniqueTools.includes('cursor') && uniqueTools.includes('copilot')) ||
      (uniqueTools.includes('cursor') && uniqueTools.includes('windsurf')) ||
      (uniqueTools.includes('copilot') && uniqueTools.includes('windsurf'));

    if (hasChatOverlap) duplicateToolsCount++;
    if (hasEditorOverlap) duplicateToolsCount++;
  });
  return duplicateToolsCount;
}


