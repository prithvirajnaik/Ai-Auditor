import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-[#090909] border border-white/5 rounded-2xl p-5 relative overflow-hidden ${
        glow ? 'shadow-[0_0_25px_rgba(139,92,246,0.05)]' : 'shadow-xl'
      } ${className}`}
      {...props}
    >
      {glow && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
      )}
      {children}
    </div>
  );
}
