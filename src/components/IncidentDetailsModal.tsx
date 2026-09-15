import React from 'react';
import { Emergency, EmergencyStatus } from '../types';
import { X, Check, CheckCircle2, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';

interface IncidentDetailsModalProps {
  emergency: Emergency | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: (id: string) => void;
  onResolve?: (id: string) => void;
  isResponder?: boolean;
}

export const IncidentDetailsModal: React.FC<IncidentDetailsModalProps> = ({
  emergency,
  isOpen,
  onClose,
  onAccept,
  onResolve,
  isResponder = false,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !emergency) return null;

  const getSeverityBadge = () => {
    switch (emergency.severity) {
      case 'Critical':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-700 border border-orange-200">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
            Medium
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = () => {
    const priority = emergency.priority || (
      emergency.severity === 'Critical'
        ? 'HIGH PRIORITY'
        : emergency.severity === 'High'
        ? 'MEDIUM PRIORITY'
        : 'NORMAL PRIORITY'
    );

    switch (priority) {
      case 'HIGH PRIORITY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200">
            ⚡ HIGH PRIORITY
          </span>
        );
      case 'MEDIUM PRIORITY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-orange-100 text-orange-700 border border-orange-200">
            MEDIUM PRIORITY
          </span>
        );
      case 'NORMAL PRIORITY':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-yellow-100 text-yellow-800 border border-yellow-300">
            NORMAL PRIORITY
          </span>
        );
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-7 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0">
              SOS
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Incident Details</span>
                <span className="font-mono text-xs sm:text-sm text-slate-500 font-bold">
                  {emergency.incident_code}
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Official Campus Emergency Incident Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Breakdown */}
        <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
          {/* Key Indicators */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-slate-50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                Emergency Type
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
                {emergency.emergency_type}
              </span>
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                Severity
              </span>
              <div>{getSeverityBadge()}</div>
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                Priority
              </span>
              <div>{getPriorityBadge()}</div>
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                Current Status
              </span>
              <div>{getStatusBadge()}</div>
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                Assigned Team
              </span>
              <span className="text-xs sm:text-sm font-bold text-blue-700 block truncate">
                👥 {emergency.assignedTeam || 'Medical Response Team'}
              </span>
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                Reported Time
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700 truncate block">
                {emergency.reported_at}
              </span>
            </div>
          </div>

          {/* Assistance Required */}
          {emergency.assistance && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <span className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
                🆘 Assistance Required
              </span>
              <div className="text-xs sm:text-sm font-bold text-amber-950">
                {emergency.assistance}
              </div>
            </div>
          )}

          {/* 📍 Exact Location */}
          <div className="bg-red-50/50 border border-red-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <span className="text-[10px] sm:text-xs font-bold text-red-800 uppercase tracking-wider block mb-1">
              📍 Exact Location
            </span>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>📍</span>
              <span className="break-words">{emergency.location}</span>
            </div>
            {emergency.coordinates && (
              <div className="text-[11px] sm:text-xs text-slate-600 font-mono mt-1 flex items-center gap-1 flex-wrap break-all">
                <span className="font-semibold text-slate-500">GPS:</span>
                <span>{emergency.coordinates}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Incident Description
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium break-words">
              "{emergency.description}"
            </p>
          </div>

          {/* Timeline */}
          {(emergency.accepted_at || emergency.resolved_at) && (
            <div className="text-[11px] sm:text-xs text-slate-500 space-y-1 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
              {emergency.accepted_at && (
                <div>• Accepted by responder: <span className="font-semibold text-slate-700">{emergency.accepted_at}</span></div>
              )}
              {emergency.resolved_at && (
                <div>• Marked as resolved: <span className="font-semibold text-slate-700">{emergency.resolved_at}</span></div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2.5 sm:pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto justify-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
          >
            Close
          </button>

          {isResponder && onAccept && emergency.status === 'PENDING' && (
            <button
              onClick={() => {
                onAccept(emergency.id);
                onClose();
              }}
              className="w-full sm:w-auto justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              ACCEPT ALERT
            </button>
          )}

          {isResponder && onResolve && emergency.status === 'ACCEPTED' && (
            <button
              onClick={() => {
                onResolve(emergency.id);
                onClose();
              }}
              className="w-full sm:w-auto justify-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>MARK AS RESOLVED</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
