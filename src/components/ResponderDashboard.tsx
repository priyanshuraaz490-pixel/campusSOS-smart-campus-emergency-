import React, { useState } from 'react';
import { Emergency, EmergencyStatus } from '../types';
import { 
  AlertCircle, 
  CheckCircle, 
  Flame, 
  Ambulance, 
  Shield, 
  AlertTriangle,
  RotateCcw,
  Check,
  CheckCircle2,
  Info
} from 'lucide-react';
import { IncidentDetailsModal } from './IncidentDetailsModal';

interface ResponderDashboardProps {
  emergencies: Emergency[];
  activeTab: 'dashboard' | 'active' | 'history';
  onSelectTab: (tab: 'dashboard' | 'active' | 'history') => void;
  onAccept: (id: string) => void;
  onResolve: (id: string) => void;
  onResetDemo: () => void;
}

export const ResponderDashboard: React.FC<ResponderDashboardProps> = ({
  emergencies,
  activeTab,
  onSelectTab,
  onAccept,
  onResolve,
  onResetDemo,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Emergency | null>(null);

  // Simple statistics
  const activeEmergencies = emergencies.filter(e => e.status === 'PENDING' || e.status === 'ACCEPTED');
  const criticalCount = activeEmergencies.filter(e => e.severity === 'Critical').length;
  const resolvedCount = emergencies.filter(e => e.status === 'RESOLVED').length;

  // Filter based on active tab
  let displayedEmergencies = emergencies;
  if (activeTab === 'active') {
    displayedEmergencies = activeEmergencies;
  } else if (activeTab === 'history') {
    displayedEmergencies = emergencies.filter(e => e.status === 'RESOLVED');
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Medical':
        return <span className="text-xl">🚑</span>;
      case 'Fire':
        return <span className="text-xl">🔥</span>;
      case 'Security':
        return <span className="text-xl">🛡</span>;
      case 'Accident':
        return <span className="text-xl">⚠</span>;
      default:
        return <span className="text-xl">🚨</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-orange-100 text-orange-700 border border-orange-200">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
            Medium
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: EmergencyStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            PENDING
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            ACCEPTED
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
            RESOLVED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-4 py-6 sm:py-8">
      {/* Page Title & Demo Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Responder Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Campus dispatch and incident response control
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="w-full sm:w-auto justify-center px-3.5 py-2.5 sm:py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          title="Reset to default sample incidents"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Incidents</span>
        </button>
      </div>

      {/* 3 Simple Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Emergencies
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {activeEmergencies.length}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Pending or in response
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-red-600">
            Critical
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">
            {criticalCount}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Life-threatening priority
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-green-600">
            Resolved
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-green-600 mt-1">
            {resolvedCount}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Completed incidents
          </div>
        </div>
      </div>

      {/* Section Header & Tabs */}
      <div className="border-b border-slate-200 pb-3 mb-5 sm:mb-6 overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Incidents ({emergencies.length})
          </button>
          <button
            onClick={() => onSelectTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'active'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Active ({activeEmergencies.length})
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            History ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Emergency Cards */}
      {displayedEmergencies.length === 0 ? (
        <div className="text-center py-10 sm:py-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {activeTab === 'active'
              ? 'No active emergencies'
              : activeTab === 'history'
              ? 'No resolved incident history'
              : 'No emergencies recorded'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'active'
              ? 'All reported emergencies have been attended to or resolved.'
              : 'Emergency records and status updates will be logged here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5 sm:space-y-4">
          {displayedEmergencies.map(emergency => {
            const isPending = emergency.status === 'PENDING';
            const isAccepted = emergency.status === 'ACCEPTED';
            const isResolved = emergency.status === 'RESOLVED';

            return (
              <div
                key={emergency.id}
                className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                  isPending
                    ? 'border-amber-300 ring-1 ring-amber-100'
                    : isAccepted
                    ? 'border-blue-200'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      {getTypeIcon(emergency.emergency_type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-mono font-extrabold text-slate-900 text-sm sm:text-base">
                          {emergency.incident_code}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-sm font-bold text-slate-800">
                          {emergency.emergency_type}
                        </span>
                        {getSeverityBadge(emergency.severity)}
                      </div>

                      {/* Exact Location with Pin */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs text-slate-600 mt-1">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1">
                          <span>📍</span>
                          <span>{emergency.location}</span>
                        </span>
                        {emergency.coordinates && (
                          <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono break-all">
                            (GPS: {emergency.coordinates})
                          </span>
                        )}
                        <span className="text-slate-300 hidden sm:inline">•</span>
                        <span className="text-slate-500 text-[11px] sm:text-xs">{emergency.reported_at}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-start sm:self-center">
                    {getStatusBadge(emergency.status)}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs sm:text-sm text-slate-700 mb-3 sm:mb-4">
                  "{emergency.description}"
                </div>

                {/* Action Buttons: Details, ACCEPT & MARK AS RESOLVED */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedIncident(emergency)}
                    className="w-full sm:w-auto justify-center text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Incident Details</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isPending && (
                      <button
                        onClick={() => onAccept(emergency.id)}
                        className="flex-1 sm:flex-initial justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <span>ACCEPT</span>
                      </button>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => onResolve(emergency.id)}
                        className="flex-1 sm:flex-initial justify-center px-5 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>MARK AS RESOLVED</span>
                      </button>
                    )}

                    {isResolved && (
                      <div className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Incident Resolved</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Incident Details Modal */}
      <IncidentDetailsModal
        emergency={
          selectedIncident
            ? emergencies.find(e => e.id === selectedIncident.id) || selectedIncident
            : null
        }
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onAccept={onAccept}
        onResolve={onResolve}
        isResponder={true}
      />
    </div>
  );
};

