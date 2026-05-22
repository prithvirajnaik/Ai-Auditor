import React from 'react';
import { Zap } from 'lucide-react';
import { Recommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApply: (id: string) => void;
}

export default function RecommendationCard({ recommendation, onApply }: RecommendationCardProps) {
  const isApplied = recommendation.status === 'applied';

  return (
    <div
      className={`border rounded-xl p-5 space-y-4 transition-all ${
        isApplied
          ? 'bg-[#040906] border-emerald-500/20 opacity-75'
          : 'bg-black border-white/5 hover:border-purple-500/20'
      }`}
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
        <div className="space-y-1 py-0.5">
          <span
            className={`inline-block px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold rounded ${
              isApplied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-300'
            }`}
          >
            {recommendation.type.replace('_', ' ')}
          </span>
          <h4 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
            {recommendation.title}
          </h4>
        </div>

        <div className="text-left sm:text-right font-mono text-xs whitespace-nowrap">
          <p className={`${isApplied ? 'text-emerald-400 font-bold' : 'text-rose-400 font-semibold'}`}>
            {isApplied ? '✓ Applied Savings' : `+ $${recommendation.estimatedMonthlySavings}/mo saved`}
          </p>
          {!isApplied && (
            <p className="text-[10px] text-gray-500">
              Estimated ${recommendation.estimatedAnnualSavings}/yr savings
            </p>
          )}
        </div>
      </div>

      {/* Recommended Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-white/5 py-3 text-xs leading-normal">
        <div>
          <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Current Spend</p>
          <p className="font-mono text-white mt-0.5">${recommendation.currentSpend}/mo</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Recommended Action</p>
          <p className="text-gray-300 mt-0.5">{recommendation.recommendedAction}</p>
        </div>
      </div>

      {/* Description & Reasoning */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400 leading-relaxed font-sans">{recommendation.description}</p>
        
        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-[11px] leading-relaxed text-gray-500">
          <span className="font-mono text-[9px] text-purple-400 uppercase tracking-wider font-bold block mb-1">
            Finance Reasoning
          </span>
          {recommendation.reasoning}
        </div>
      </div>

      {/* Action Controls */}
      {!isApplied && (
        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={() => onApply(recommendation.id)}
            className="bg-purple-950/45 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-500/50 text-purple-300 px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-300" />
            Apply Recommendation
          </button>
        </div>
      )}
    </div>
  );
}
