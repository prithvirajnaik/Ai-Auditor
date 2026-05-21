/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AIToolPricing {
  id: string;
  name: string;
  logo: string;
  plans: {
    name: string;
    price: number; // per month
    billing: 'monthly' | 'annual';
    features: string[];
  }[];
  description: string;
}

export interface SubscriptionItem {
  id: string;
  toolId: string;
  toolName: string;
  planName: string;
  department: string;
  seats: number;
  costPerSeat: number; // monthly
  totalCost: number; // monthly
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'inactive';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  currentSpend: number;
  recommendedAction: string;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  reasoning: string;
  toolId: string;
  type: 'consolidate' | 'downgrade' | 'remove_redundant' | 'usage_routing';
  status: 'pending' | 'applied';
}

export interface TeamSpendMetric {
  department: string;
  spend: number;
  seats: number;
  costPerEmployee: number;
  toolsUsed: string[];
}

export interface AuditReport {
  id: string;
  companyName: string;
  domainName: string;
  auditDate: string;
  teamSize: number;
  primaryUseCase: string;
  currentSpendMonthly: number;
  optimizedSpendMonthly: number;
  potentialMonthlySavings: number;
  potentialAnnualSavings: number;
  duplicateToolsCount: number;
  inactiveSeatsCount: number;
  subscriptionsAnalyzed: SubscriptionItem[];
  recommendations: Recommendation[];
  teamMetrics: TeamSpendMetric[];
  aiSummary: string;
}
