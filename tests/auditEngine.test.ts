import { describe, test, expect } from 'vitest';
import { runAuditAnalysis } from '../src/lib/auditEngine';
import { SubscriptionItem } from '../src/types';

describe('Auto Audit Heuristics Engine', () => {
  
  // Test 1: Duplicate tool detection
  test('should detect duplicate code editors (Cursor + Copilot) in the same department', () => {
    const subscriptions: SubscriptionItem[] = [
      {
        id: 'sub-1',
        toolId: 'cursor',
        toolName: 'Cursor',
        planName: 'Pro',
        department: 'Engineering',
        seats: 5,
        costPerSeat: 20,
        totalCost: 100,
        billingCycle: 'monthly',
        status: 'active'
      },
      {
        id: 'sub-2',
        toolId: 'copilot',
        toolName: 'GitHub Copilot',
        planName: 'Individual',
        department: 'Engineering',
        seats: 5,
        costPerSeat: 10,
        totalCost: 50,
        billingCycle: 'monthly',
        status: 'active'
      }
    ];

    const report = runAuditAnalysis(
      'Test Company',
      'testcompany.com',
      10,
      'Coding',
      subscriptions
    );

    // Assert duplicate tools are detected
    expect(report.duplicateToolsCount).toBe(1);

    // Assert recommendation to consolidate exists
    const consolidationRec = report.recommendations.find(
      rec => rec.type === 'remove_redundant' && rec.toolId === 'copilot'
    );
    expect(consolidationRec).toBeDefined();
    expect(consolidationRec?.estimatedMonthlySavings).toBe(50); // 5 overlapping seats * $10/seat
  });

  // Test 2: Plan downgrade recommendations
  test('should recommend downgrading Claude Team plan with less than 5 seats to Individual Pro', () => {
    const subscriptions: SubscriptionItem[] = [
      {
        id: 'sub-1',
        toolId: 'claude',
        toolName: 'Claude',
        planName: 'Team',
        department: 'Product',
        seats: 3,
        costPerSeat: 25,
        totalCost: 125, // Claude Team bills 5 seat minimum: 5 * 25 = 125
        billingCycle: 'monthly',
        status: 'active'
      }
    ];

    const report = runAuditAnalysis(
      'Test Company',
      'testcompany.com',
      10,
      'Writing',
      subscriptions
    );

    const downgradeRec = report.recommendations.find(
      rec => rec.type === 'downgrade' && rec.toolId === 'claude'
    );
    expect(downgradeRec).toBeDefined();
    // Billed 5 * 25 = 125. Downgraded to 3 * 20 = 60. Savings should be 125 - 60 = 65.
    expect(downgradeRec?.estimatedMonthlySavings).toBe(65);
  });

  test('should recommend downgrading ChatGPT Team plan with 1 seat to Plus', () => {
    const subscriptions: SubscriptionItem[] = [
      {
        id: 'sub-1',
        toolId: 'chatgpt',
        toolName: 'ChatGPT',
        planName: 'Team',
        department: 'Operations',
        seats: 1,
        costPerSeat: 25,
        totalCost: 50, // ChatGPT Team bills 2 seat minimum: 2 * 25 = 50
        billingCycle: 'monthly',
        status: 'active'
      }
    ];

    const report = runAuditAnalysis(
      'Test Company',
      'testcompany.com',
      10,
      'Mixed Usage',
      subscriptions
    );

    const downgradeRec = report.recommendations.find(
      rec => rec.type === 'downgrade' && rec.toolId === 'chatgpt'
    );
    expect(downgradeRec).toBeDefined();
    // Billed 2 * 25 = 50. Downgraded to 1 * 20 = 20. Savings: 50 - 20 = 30.
    expect(downgradeRec?.estimatedMonthlySavings).toBe(30);
  });

  // Test 3: Ghost seat detection
  test('should detect ghost seats when active seats exceed 130% of headcount', () => {
    const subscriptions: SubscriptionItem[] = [
      {
        id: 'sub-1',
        toolId: 'chatgpt',
        toolName: 'ChatGPT',
        planName: 'Plus (Individual)',
        department: 'Marketing',
        seats: 15,
        costPerSeat: 20,
        totalCost: 300,
        billingCycle: 'monthly',
        status: 'active'
      }
    ];

    // Team size of 10. Max allowed active seats = 10 * 1.3 = 13.
    // Overlap/ghost seats = 15 - 13 = 2 seats.
    const report = runAuditAnalysis(
      'Test Company',
      'testcompany.com',
      10,
      'Mixed Usage',
      subscriptions
    );

    // Verify inactive seats count has detected the 2 ghost seats
    expect(report.inactiveSeatsCount).toBe(2);

    const ghostRec = report.recommendations.find(
      rec => rec.title.toLowerCase().includes('ghost')
    );
    expect(ghostRec).toBeDefined();
    // 2 ghost seats * $20 average seat cost = $40 savings.
    expect(ghostRec?.estimatedMonthlySavings).toBe(40);
  });

  // Test 4: API overspending recommendations
  test('should recommend semantic caching layer for OpenAI API active developer spend', () => {
    const subscriptions: SubscriptionItem[] = [
      {
        id: 'sub-1',
        toolId: 'openai_api',
        toolName: 'OpenAI API',
        planName: 'Tier 2 API Usage',
        department: 'Engineering',
        seats: 1,
        costPerSeat: 250,
        totalCost: 250,
        billingCycle: 'monthly',
        status: 'active'
      }
    ];

    const report = runAuditAnalysis(
      'Test Company',
      'testcompany.com',
      10,
      'Coding',
      subscriptions
    );

    const apiRec = report.recommendations.find(
      rec => rec.type === 'usage_routing' && rec.toolId === 'openai_api'
    );
    expect(apiRec).toBeDefined();
    // 20% of $250 is $50.
    expect(apiRec?.estimatedMonthlySavings).toBe(50);
  });

  // Test 5: Annual savings calculations
  test('should accurately calculate total annual savings based on monthly recommendations', () => {
    const subscriptions: SubscriptionItem[] = [
      {
        id: 'sub-1',
        toolId: 'openai_api',
        toolName: 'OpenAI API',
        planName: 'Tier 2 API Usage',
        department: 'Engineering',
        seats: 1,
        costPerSeat: 250,
        totalCost: 250,
        billingCycle: 'monthly',
        status: 'active'
      },
      {
        id: 'sub-2',
        toolId: 'cursor',
        toolName: 'Cursor',
        planName: 'Pro',
        department: 'Engineering',
        seats: 5,
        costPerSeat: 20,
        totalCost: 100,
        billingCycle: 'monthly',
        status: 'active'
      },
      {
        id: 'sub-3',
        toolId: 'copilot',
        toolName: 'GitHub Copilot',
        planName: 'Individual',
        department: 'Engineering',
        seats: 5,
        costPerSeat: 10,
        totalCost: 50,
        billingCycle: 'monthly',
        status: 'active'
      }
    ];

    const report = runAuditAnalysis(
      'Test Company',
      'testcompany.com',
      10,
      'Coding',
      subscriptions
    );

    // Monthly savings:
    // API Caching: 20% of $250 = $50.
    // Editor redundancy: 5 * $10 = $50.
    // Cursor individual consolidation: 15% of $100 = $15.
    // Copilot individual consolidation: 15% of $50 = $8.
    // Total monthly savings: $123.
    // Annual savings: $123 * 12 = $1476.
    expect(report.potentialMonthlySavings).toBe(123);
    expect(report.potentialAnnualSavings).toBe(1476);
  });
});
