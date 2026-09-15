import React, { useState } from 'react';
import { Emergency, EmergencyStatus, ResponseTeam } from '../types';
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
  Info,
  Users,
  Filter
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

type DashboardFilter = 'all' | 'critical' | 'my-team';

export const ResponderDashboard: React.FC<ResponderDashboardProps> = ({
  emergencies,
  activeTab,
  onSelectTab,
  onAccept,
  onResolve,
  onResetDemo,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Emergency | null>(null);
  
  // Dashboard instant filters: All | Critical | My Assigned Team
  const [dashboardFilter, setDashboardFilter] = useState<DashboardFilter>('all');
  // Responder's assigned department team for "My Assigned Team" filter
  const [myTeam, setMyTeam] = useState<ResponseTeam>('Medical Response Team');

  // Simple statistics
  const activeEmergencies = emergencies.filter(e => e.status === 'PENDING' || e.status === 'ACCEPTED');
  const criticalCount = activeEmergencies.filter(e => e.severity === 'Critical').length;
  const resolvedCount = emergencies.filter(e => e.status === 'RESOLVED').length;

  // Step 1: Filter based on active tab
  let tabEmergencies = emergencies;
  if (activeTab === 'active') {
    tabEmergencies = activeEmergencies;
  } else if (activeTab === 'history') {
    tabEmergencies = emergencies.filter(e => e.status === 'RESOLVED');
  }

  // Step 2: Instant filter for All | Critical | My Assigned Team (works without page reload)
  const displayedEmergencies = tabEmergencies.filter(e => {
    if (dashboardFilter === 'critical') {
      return e.severity === 'Critical';
    }
    if (dashboardFilter === 'my-team') {
      const assigned = e.assignedTeam || '';
      return assigned.includes(myTeam) || (myTeam === 'Medical Response Team' && assigned.includes('Medical'));
    }
    return true;
  });

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
            🔴 Critical
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

  const getPriorityBadge = (emergency: Emergency) => {
    // 4. PRIORITY VISUALS:
    // Critical → red "HIGH PRIORITY"
    // High → orange "MEDIUM PRIORITY"
    // Medium → yellow "NORMAL PRIORITY"
    // Resolved → green
    if (emergency.status === 'RESOLVED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>RESOLVED</span>
        </span>
      );
    }

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
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-100 text-red-700 border border-red-300 animate-pulse flex items-center gap-1 shadow-2xs">
            <span>⚡</span>
            <span>HIGH PRIORITY</span>
          </span>
        );
      case 'MEDIUM PRIORITY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-100 text-orange-800 border border-orange-300">
            MEDIUM PRIORITY
          </span>
        );
      case 'NORMAL PRIORITY':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-yellow-100 text-yellow-800 border border-yellow-300">
            NORMAL PRIORITY
          </span>
        );
    }
  };

  const getStatusBadge = (status: EmergencyStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
            Status: PENDING
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
            Status: ACCEPTED
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-green-100 text-green-800 border border-green-300">
            Status: RESOLVED
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
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Responder Dashboard</span>
            <span className="text-xs bg-slate-900 text-white font-mono px-2 py-0.5 rounded-md">
              Priority Queue
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Smart response team assignment & priority-ordered campus dispatch
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
            Critical (High Priority)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">
            {criticalCount}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Ranked first in dispatch queue
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
      <div className="border-b border-slate-200 pb-3 mb-4 overflow-x-auto">
        <div className="flex items-center justify-between gap-2 min-w-max">
          <div className="flex items-center gap-1.5 sm:gap-2">
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
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Active</span>
              {activeEmergencies.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                  {activeEmergencies.length}
                </span>
              )}
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
      </div>

      {/* 5. DASHBOARD FILTERS: All | Critical | My Assigned Team */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-3.5 mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-xs font-extrabold uppercase tracking-wide text-slate-600 shrink-0">
            Priority Filter:
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setDashboardFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                dashboardFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All ({tabEmergencies.length})
            </button>

            <button
              type="button"
              onClick={() => setDashboardFilter('critical')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                dashboardFilter === 'critical'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-red-700 hover:bg-red-50'
              }`}
            >
              <span>🔴 Critical</span>
              <span className="text-[11px] opacity-90">
                ({tabEmergencies.filter(e => e.severity === 'Critical').length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDashboardFilter('my-team')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                dashboardFilter === 'my-team'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>My Assigned Team</span>
            </button>
          </div>
        </div>

        {/* Team switcher dropdown for testing My Assigned Team */}
        {dashboardFilter === 'my-team' && (
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="text-[11px] font-semibold text-slate-500">Active Responder Unit:</span>
            <select
              value={myTeam}
              onChange={e => setMyTeam(e.target.value as ResponseTeam)}
              className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="Medical Response Team">Medical Response Team</option>
              <option value="Fire & Safety Team">Fire & Safety Team</option>
              <option value="Security Response Team">Security Response Team</option>
              <option value="Medical + Security Team">Medical + Security Team</option>
            </select>
          </div>
        )}
      </div>

      {/* Emergency Cards */}
      {displayedEmergencies.length === 0 ? (
        <div className="text-center py-10 sm:py-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {dashboardFilter === 'critical'
              ? 'No critical priority emergencies'
              : dashboardFilter === 'my-team'
              ? `No incidents assigned to ${myTeam}`
              : activeTab === 'active'
              ? 'No active emergencies'
              : activeTab === 'history'
              ? 'No resolved incident history'
              : 'No emergencies recorded'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {dashboardFilter === 'critical'
              ? 'No urgent life-threatening alerts in this queue.'
              : dashboardFilter === 'my-team'
              ? 'Try switching your responder unit or resetting sample incidents.'
              : 'All reported emergencies have been attended to or resolved.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {displayedEmergencies.map((emergency, index) => {
            const isPending = emergency.status === 'PENDING';
            const isAccepted = emergency.status === 'ACCEPTED';
            const isResolved = emergency.status === 'RESOLVED';
            const isCritical = emergency.severity === 'Critical';

            return (
              <div
                key={emergency.id}
                className={`bg-white border-2 rounded-2xl p-4 sm:p-6 shadow-xs transition-all ${
                  isCritical && isPending
                    ? 'border-red-400 ring-2 ring-red-100 bg-red-50/10'
                    : isPending
                    ? 'border-amber-300 ring-1 ring-amber-100'
                    : isAccepted
                    ? 'border-blue-300 bg-blue-50/10'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                {/* Header Row: Incident ID + Badges + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
                      {getTypeIcon(emergency.emergency_type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Incident ID */}
                        <span className="font-mono font-black text-slate-900 text-base sm:text-lg tracking-tight">
                          {emergency.incident_code}
                        </span>
                        
                        {/* Emergency Type */}
                        <span className="text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                          {emergency.emergency_type}
                        </span>

                        {/* Severity */}
                        {getSeverityBadge(emergency.severity)}

                        {/* Priority */}
                        {getPriorityBadge(emergency)}
                      </div>

                      {/* Time and Queue Position */}
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 mt-1">
                        <span>Reported {emergency.reported_at}</span>
                        {isCritical && (
                          <span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                            Queue Rank #1 (Top Priority)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="self-start sm:self-center">
                    {getStatusBadge(emergency.status)}
                  </div>
                </div>

                {/* Details Breakdown Block (Exact Location, Assistance, Assigned Team) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-3 bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200">
                  {/* Exact Location */}
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                      📍 Exact Location
                    </span>
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1">
                      <span>📍</span>
                      <span className="truncate">{emergency.location}</span>
                    </div>
                    {emergency.coordinates && (
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        GPS: {emergency.coordinates}
                      </span>
                    )}
                  </div>

                  {/* Assistance Required */}
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                      🆘 Assistance
                    </span>
                    <div className="font-extrabold text-amber-900 text-xs sm:text-sm truncate">
                      {emergency.assistance || 'Ambulance + First Aid'}
                    </div>
                  </div>

                  {/* Assigned Response Team */}
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                      👥 Assigned Team
                    </span>
                    <div className="font-extrabold text-blue-700 text-xs sm:text-sm truncate">
                      {emergency.assignedTeam || 'Medical Response Team'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs sm:text-sm text-slate-700 mb-3 sm:mb-4">
                  <span className="font-bold text-slate-900 mr-1.5">Description:</span>
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
                        className="flex-1 sm:flex-initial justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-black rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <span>[ ACCEPT ]</span>
                      </button>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => onResolve(emergency.id)}
                        className="flex-1 sm:flex-initial justify-center px-6 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs sm:text-sm font-black rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>[ MARK AS RESOLVED ]</span>
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

