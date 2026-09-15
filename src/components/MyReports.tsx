import React from 'react';
import { Emergency, EmergencyStatus } from '../types';
import { PlusCircle, FileText, ArrowRight } from 'lucide-react';

interface MyReportsProps {
  emergencies: Emergency[];
  onSelectEmergency: (emergency: Emergency) => void;
  onGoToReport: () => void;
}

export const MyReports: React.FC<MyReportsProps> = ({
  emergencies,
  onSelectEmergency,
  onGoToReport,
}) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
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
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Pending
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            Accepted
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track all submitted emergency alerts and current response status
          </p>
        </div>

        <button
          onClick={onGoToReport}
          className="w-full sm:w-auto justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Emergency</span>
        </button>
      </div>

      {emergencies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No reports filed yet</h3>
          <p className="text-xs text-slate-500 mb-4">
            If you encounter an emergency on campus, report it right away.
          </p>
          <button
            onClick={onGoToReport}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Create Report
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Desktop/Tablet Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Incident ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Priority / Team</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {emergencies.map(e => (
                  <tr
                    key={e.id}
                    onClick={() => onSelectEmergency(e)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {e.incident_code}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <div>{e.emergency_type}</div>
                      <div className="mt-0.5">{getSeverityBadge(e.severity)}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{e.location}</span>
                      </div>
                      {e.coordinates && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          {e.coordinates}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold text-slate-900">
                        {e.priority || (e.severity === 'Critical' ? 'HIGH PRIORITY' : e.severity === 'High' ? 'MEDIUM PRIORITY' : 'NORMAL PRIORITY')}
                      </div>
                      <div className="text-[11px] font-medium text-blue-700 mt-0.5">
                        👥 {e.assignedTeam || 'Medical Response Team'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(e.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                        View Status <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-slate-100">
            {emergencies.map(e => (
              <div
                key={e.id}
                onClick={() => onSelectEmergency(e)}
                className="p-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {e.incident_code}
                  </span>
                  <div>{getStatusBadge(e.status)}</div>
                </div>
                <div className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5 flex-wrap">
                  <span>{e.emergency_type}</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-900 font-bold">
                    <span>📍</span>
                    <span>{e.location}</span>
                  </span>
                </div>
                {e.coordinates && (
                  <div className="text-[10px] text-slate-400 font-mono mb-1.5 truncate">
                    GPS: {e.coordinates}
                  </div>
                )}
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-blue-700 font-semibold mb-2">
                  <span>👥 {e.assignedTeam || 'Medical Response Team'}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {getSeverityBadge(e.severity)}
                    <span className="text-[11px] font-bold text-slate-700">
                      {e.priority || (e.severity === 'Critical' ? 'HIGH PRIORITY' : e.severity === 'High' ? 'MEDIUM PRIORITY' : 'NORMAL PRIORITY')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-red-600 flex items-center gap-0.5">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
