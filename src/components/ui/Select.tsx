import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[] | string[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-black border border-white/10 rounded-xl px-2 py-2 text-white focus:border-purple-500 focus:outline-none text-xs transition-colors font-sans cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}
