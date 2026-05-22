import React from 'react';
import { Trash2 } from 'lucide-react';
import { SubscriptionItem } from '../../types';
import { AI_TOOLS_PRICING, DEPARTMENTS } from '../../lib/pricing';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface SubscriptionCardProps {
  subscription: SubscriptionItem;
  onChange: (updated: SubscriptionItem) => void;
  onRemove: () => void;
}

export default function SubscriptionCard({ subscription, onChange, onRemove }: SubscriptionCardProps) {
  const currentTool = AI_TOOLS_PRICING.find(t => t.id === subscription.toolId) || AI_TOOLS_PRICING[0];
  const planOptions = currentTool.plans.map(p => ({ value: p.name, label: `${p.name} ($${p.price}/mo)` }));

  const handleToolChange = (toolId: string) => {
    const nextTool = AI_TOOLS_PRICING.find(t => t.id === toolId);
    if (!nextTool) return;

    const defaultPlan = nextTool.plans[0];
    onChange({
      ...subscription,
      toolId,
      toolName: nextTool.name,
      planName: defaultPlan.name,
      costPerSeat: defaultPlan.price,
      totalCost: subscription.seats * defaultPlan.price
    });
  };

  const handlePlanChange = (planName: string) => {
    const plan = currentTool.plans.find(p => p.name === planName);
    if (!plan) return;

    onChange({
      ...subscription,
      planName,
      costPerSeat: plan.price,
      totalCost: subscription.seats * plan.price
    });
  };

  const handleSeatsChange = (seatsVal: number) => {
    const seats = Math.max(1, seatsVal);
    onChange({
      ...subscription,
      seats,
      totalCost: seats * subscription.costPerSeat
    });
  };

  const handleCostChange = (costPerSeat: number) => {
    const rate = Math.max(0, costPerSeat);
    onChange({
      ...subscription,
      costPerSeat: rate,
      totalCost: subscription.seats * rate
    });
  };

  const handleDepartmentChange = (department: string) => {
    onChange({
      ...subscription,
      department
    });
  };

  const handleStatusChange = (status: 'active' | 'inactive') => {
    onChange({
      ...subscription,
      status
    });
  };

  return (
    <Card className="border border-white/5 bg-[#090909]/40 hover:border-purple-500/25 transition-all p-5 space-y-4">
      {/* Card Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentTool.logo}</span>
          <span className="font-extrabold text-sm text-white">{subscription.toolName}</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          title="Remove Tool Card"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Select
          label="Tool Brand"
          value={subscription.toolId}
          onChange={(e) => handleToolChange(e.target.value)}
          options={AI_TOOLS_PRICING.map(t => ({ value: t.id, label: t.name }))}
        />

        <Select
          label="Plan Option"
          value={subscription.planName}
          onChange={(e) => handlePlanChange(e.target.value)}
          options={planOptions}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            label="Active Seats"
            min="1"
            value={subscription.seats}
            onChange={(e) => handleSeatsChange(parseInt(e.target.value) || 1)}
          />
          <Input
            type="number"
            label="Rate / Seat"
            min="0"
            value={subscription.costPerSeat}
            onChange={(e) => handleCostChange(parseInt(e.target.value) || 0)}
          />
        </div>

        <Select
          label="Department"
          value={subscription.department}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          options={DEPARTMENTS}
        />
      </div>

      {/* Footer and Summary */}
      <div className="flex justify-between items-center pt-2.5 border-t border-white/5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-500 uppercase font-sans">Status:</label>
          <select
            value={subscription.status}
            onChange={(e) => handleStatusChange(e.target.value as 'active' | 'inactive')}
            className="bg-black border border-white/10 rounded px-1.5 py-0.5 text-white text-[11px] cursor-pointer focus:outline-none focus:border-purple-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-500 uppercase font-sans mr-2">Monthly Spend:</span>
          <span className="font-extrabold text-cyan-400 text-sm">${subscription.totalCost}</span>
        </div>
      </div>
    </Card>
  );
}
