import React from 'react';
import { EmergencyType } from '../types';
import { Ambulance, Flame, Shield, AlertTriangle, ArrowRight } from 'lucide-react';

interface StudentHomeProps {
  onSelectCategory: (category: EmergencyType) => void;
  onGoToReport: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onSelectCategory,
  onGoToReport,
}) => {
  const categories: {
    type: EmergencyType;
    icon: React.ReactNode;
    emoji: string;
    label: string;
    description: string;
    colorClasses: string;
    hoverClasses: string;
    borderClass: string;
  }[] = [
    {
      type: 'Medical',
      icon: <Ambulance className="w-10 h-10 text-red-600" />,
      emoji: '🚑',
      label: 'Medical',
      description: 'Injury, fainting, allergic reaction, or medical distress',
      colorClasses: 'bg-red-50 text-red-950',
      hoverClasses: 'hover:bg-red-100 hover:border-red-400',
      borderClass: 'border-red-200',
    },
    {
      type: 'Fire',
      icon: <Flame className="w-10 h-10 text-orange-600" />,
      emoji: '🔥',
      label: 'Fire',
      description: 'Smoke, open fire, electrical spark, or chemical hazard',
      colorClasses: 'bg-orange-50 text-orange-950',
      hoverClasses: 'hover:bg-orange-100 hover:border-orange-400',
      borderClass: 'border-orange-200',
    },
    {
      type: 'Security',
      icon: <Shield className="w-10 h-10 text-blue-600" />,
      emoji: '🛡',
      label: 'Security',
      description: 'Threat, harassment, theft, or suspicious person',
      colorClasses: 'bg-blue-50 text-blue-950',
      hoverClasses: 'hover:bg-blue-100 hover:border-blue-400',
      borderClass: 'border-blue-200',
    },
    {
      type: 'Accident',
      icon: <AlertTriangle className="w-10 h-10 text-amber-600" />,
      emoji: '⚠',
      label: 'Accident',
      description: 'Vehicle collision, slip & fall, or campus damage',
      colorClasses: 'bg-amber-50 text-amber-950',
      hoverClasses: 'hover:bg-amber-100 hover:border-amber-400',
      borderClass: 'border-amber-200',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-4 py-6 sm:py-12">
      {/* Title Section */}
      <div className="text-center mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Need Emergency Help?
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 mt-2 max-w-xl mx-auto">
          Tap a category below to instantly alert campus emergency responders with your location and details.
        </p>
      </div>

      {/* 4 Large Emergency Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6 mb-6 sm:mb-8">
        {categories.map(cat => (
          <button
            key={cat.type}
            onClick={() => onSelectCategory(cat.type)}
            className={`p-4 sm:p-7 rounded-2xl border-2 ${cat.borderClass} ${cat.colorClasses} ${cat.hoverClasses} text-left transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.99] flex items-start gap-3.5 sm:gap-4 w-full`}
          >
            <div className="p-2.5 sm:p-3 bg-white rounded-xl shadow-xs shrink-0">
              <span className="text-2xl sm:text-4xl">{cat.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{cat.label}</h2>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-2.5 sm:mt-3 inline-flex items-center text-xs font-bold text-red-600">
                Report {cat.label} Emergency →
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Primary Call-to-Action: Report Emergency */}
      <div className="text-center bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
          Have an incident to report?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-5">
          Fill out the complete emergency report form with location and severity level.
        </p>
        <button
          onClick={onGoToReport}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-base font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <span>Report Emergency</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
