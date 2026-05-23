import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-black border ${
          error ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/10 focus:border-purple-500'
        } rounded-xl px-3 py-2 text-white placeholder-gray-700 focus:outline-none text-xs transition-colors font-sans ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 font-mono">{error}</p>}
    </div>
  );
}
