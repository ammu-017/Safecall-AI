import React from 'react';
import { Shield, Activity, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
}

export const SafeCallLogo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  linkTo = '/',
}) => {
  const sizeClasses = {
    sm: {
      shield: 'w-7 h-7',
      iconInner: 'w-3.5 h-3.5',
      title: 'text-lg',
      tagline: 'text-[10px]',
    },
    md: {
      shield: 'w-9 h-9',
      iconInner: 'w-4 h-4',
      title: 'text-xl',
      tagline: 'text-xs',
    },
    lg: {
      shield: 'w-12 h-12',
      iconInner: 'w-6 h-6',
      title: 'text-2xl',
      tagline: 'text-xs',
    },
  }[size];

  const content = (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Brand Icon Shield with Waveform and Checkmark */}
      <div className={`relative ${sizeClasses.shield} rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-teal-800 text-white flex items-center justify-center shadow-md shadow-slate-950/20 ring-1 ring-white/10 shrink-0`}>
        <Shield className="w-full h-full p-1.5 text-teal-400 opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center relative">
            <Activity className="w-3.5 h-3.5 text-teal-200 stroke-[2.5]" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 shadow-sm">
              <Check className="w-2 h-2 text-white stroke-[3]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col leading-tight">
        <span className={`font-black tracking-tight text-slate-900 ${sizeClasses.title}`}>
          SafeCall <span className="text-teal-600 font-extrabold">AI</span>
        </span>
        {showTagline && (
          <span className={`text-slate-500 font-medium tracking-normal ${sizeClasses.tagline}`}>
            Detect the manipulation. Protect the moment.
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
