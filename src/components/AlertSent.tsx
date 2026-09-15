import React from 'react';
import { Emergency } from '../types';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Home, List } from 'lucide-react';

interface AlertSentProps {
  emergency: Emergency;
  onGoHome: () => void;
  onGoToReports: () => void;
  onSwitchToResponder: () => void;
}

export const AlertSent: React.FC<AlertSentProps> = ({
  emergency,
  onGoHome,
  onGoToReports,
  onSwitchToResponder,
}) => {
  // Simple progress: Reported -> Accepted -> Resolved
  const steps = [
    { label: 'Reported', completed: true, current: emergency.status === 'PENDING' },
    {
      label: 'Accepted',
      completed: emergency.status === 'ACCEPTED' || emergency.status === 'RESOLVED',
      current: emergency.status === 'ACCEPTED',
    },
    {
      label: 'Resolved',
      completed: emergency.status === 'RESOLVED',
      current: emergency.status === 'RESOLVED',
    },
  ];

  const getSeverityBadge = () => {
    switch (emergency.severity) {
      case 'Critical':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Critical</span>;
      case 'High':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Medium</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (emergency.status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            PENDING
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            ACCEPTED
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
            RESOLVED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3.5 sm:px-4 py-6 sm:py-8">
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs text-center">
        {/* Success Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 sm:mb-2">
          Emergency Alert Sent Successfully
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6">
          Campus emergency responders have received your distress alert.
        </p>

        {/* Simple Progress Bar: Reported -> Accepted -> Resolved */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-5 sm:mb-6">
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-left">
            Live Response Progress
          </div>
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
            {steps.map((step, idx) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.completed
                      ? 'bg-green-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  } ${step.current ? 'ring-4 ring-green-100' : ''}`}
                >
                  {step.completed ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-1 font-bold ${
                    step.current
                      ? 'text-slate-900'
                      : step.completed
                      ? 'text-green-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Details Card */}
        <div className="bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 text-left mb-5 sm:mb-6 space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Incident ID
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
              {emergency.incident_code}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Type
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {emergency.emergency_type}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Severity
            </span>
            <div>{getSeverityBadge()}</div>
          </div>

          <div className="flex items-start justify-between border-b border-slate-200 pb-2 gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide shrink-0 mt-0.5">
              Exact Location
            </span>
            <div className="text-right min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center justify-end gap-1">
                <span>📍</span>
                <span className="truncate">{emergency.location}</span>
              </span>
              {emergency.coordinates && (
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-mono mt-0.5 break-all">
                  GPS: {emergency.coordinates}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Status
            </span>
            <div>{getStatusBadge()}</div>
          </div>

          {emergency.description && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                Description
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200 break-words">
                "{emergency.description}"
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            <button
              onClick={onGoHome}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={onGoToReports}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <List className="w-4 h-4" />
              <span>My Reports</span>
            </button>
          </div>

          {/* Quick Switch to Responder Dashboard */}
          <button
            onClick={onSwitchToResponder}
            className="w-full py-3 px-3.5 sm:px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs"
          >
            <span className="truncate">👉 View in Responder Dashboard</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
