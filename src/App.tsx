import React, { useState, useEffect, useCallback } from 'react';
import { 
  Emergency, 
  EmergencyType, 
  Severity, 
  CampusLocation 
} from './types';
import { 
  getEmergencies, 
  createEmergency, 
  updateEmergencyStatus, 
  resetToDemoData 
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/StudentHome';
import { ReportEmergency } from './components/ReportEmergency';
import { AlertSent } from './components/AlertSent';
import { ResponderDashboard } from './components/ResponderDashboard';
import { MyReports } from './components/MyReports';
import { ResponderLoginModal } from './components/ResponderLoginModal';

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<'student' | 'responder'>('student');
  const [studentView, setStudentView] = useState<'home' | 'report' | 'alert-sent' | 'my-reports'>('home');
  const [responderTab, setResponderTab] = useState<'dashboard' | 'active' | 'history'>('dashboard');

  // Selected Emergency Data
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [activeEmergency, setActiveEmergency] = useState<Emergency | null>(null);
  const [preselectedCategory, setPreselectedCategory] = useState<EmergencyType>('Medical');

  // Modals & Toast
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from LocalStorage
  const loadData = useCallback(() => {
    const list = getEmergencies();
    setEmergencies(list);

    // Keep active emergency in sync if updated
    setActiveEmergency(prev => {
      if (!prev) return list[0] || null;
      const fresh = list.find(item => item.id === prev.id);
      return fresh || prev;
    });
  }, []);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('campussos_update', handleUpdate);
    return () => window.removeEventListener('campussos_update', handleUpdate);
  }, [loadData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Student Actions
  const handleSelectCategory = (cat: EmergencyType) => {
    setPreselectedCategory(cat);
    setStudentView('report');
  };

  const handleCreateAlert = (data: {
    emergency_type: EmergencyType;
    severity: Severity;
    location: CampusLocation | string;
    coordinates?: string;
    description: string;
  }) => {
    const newRecord = createEmergency(data);
    loadData();
    setActiveEmergency(newRecord);
    setStudentView('alert-sent');
    showToast(`🚨 Emergency Alert ${newRecord.incident_code} Sent`);
  };

  // Responder Actions
  const handleAccept = (id: string) => {
    const updated = updateEmergencyStatus(id, 'ACCEPTED');
    loadData();
    showToast(`Incident #${updated?.incident_code || id} Accepted`);
  };

  const handleResolve = (id: string) => {
    const updated = updateEmergencyStatus(id, 'RESOLVED');
    loadData();
    showToast(`Incident #${updated?.incident_code || id} Marked as Resolved`);
  };

  const handleResetDemo = () => {
    const resetList = resetToDemoData();
    setEmergencies(resetList);
    setActiveEmergency(resetList[0]);
    showToast('Sample incident records reset');
  };

  // Switch between Roles
  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    setCurrentRole('responder');
    setResponderTab('dashboard');
    showToast('Logged in as Campus Responder');
  };

  const handleLogout = () => {
    setCurrentRole('student');
    setStudentView('home');
    showToast('Logged out of Responder Portal');
  };

  const activeCount = emergencies.filter(e => e.status === 'PENDING' || e.status === 'ACCEPTED').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        studentView={studentView}
        responderTab={responderTab}
        onSelectStudentView={view => setStudentView(view)}
        onSelectResponderTab={tab => setResponderTab(tab)}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        onQuickSwitchToStudent={() => {
          setCurrentRole('student');
          setStudentView('home');
        }}
        activeCount={activeCount}
      />

      {/* Main Screen Content */}
      <main className="flex-1 pb-12">
        {currentRole === 'responder' ? (
          /* SCREEN 4: RESPONDER DASHBOARD */
          <ResponderDashboard
            emergencies={emergencies}
            activeTab={responderTab}
            onSelectTab={tab => setResponderTab(tab)}
            onAccept={handleAccept}
            onResolve={handleResolve}
            onResetDemo={handleResetDemo}
          />
        ) : (
          /* STUDENT SCREENS */
          <>
            {/* SCREEN 1: STUDENT HOME */}
            {studentView === 'home' && (
              <StudentHome
                onSelectCategory={handleSelectCategory}
                onGoToReport={() => setStudentView('report')}
              />
            )}

            {/* SCREEN 2: REPORT EMERGENCY */}
            {studentView === 'report' && (
              <ReportEmergency
                initialType={preselectedCategory}
                onSubmit={handleCreateAlert}
                onCancel={() => setStudentView('home')}
              />
            )}

            {/* SCREEN 3: ALERT SENT */}
            {studentView === 'alert-sent' && (
              (activeEmergency || emergencies[0]) ? (
                <AlertSent
                  emergency={activeEmergency || emergencies[0]}
                  onGoHome={() => setStudentView('home')}
                  onGoToReports={() => setStudentView('my-reports')}
                  onSwitchToResponder={() => {
                    setCurrentRole('responder');
                    setResponderTab('dashboard');
                  }}
                />
              ) : (
                <div className="max-w-md mx-auto px-4 py-16 text-center">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
                    <p className="text-slate-600 mb-4 font-semibold">No active emergency alert selected.</p>
                    <button
                      onClick={() => setStudentView('home')}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl cursor-pointer transition-colors"
                    >
                      Return to Home
                    </button>
                  </div>
                </div>
              )
            )}

            {/* SCREEN 5: MY REPORTS */}
            {studentView === 'my-reports' && (
              <MyReports
                emergencies={emergencies}
                onSelectEmergency={emergency => {
                  setActiveEmergency(emergency);
                  setStudentView('alert-sent');
                }}
                onGoToReport={() => setStudentView('report')}
              />
            )}
          </>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-semibold text-slate-700">
            CampusSOS – Smart Campus Emergency Response System
          </div>
          <div className="text-slate-400">
            Campus Safety & Emergency Response
          </div>
        </div>
      </footer>

      {/* Responder Login Modal */}
      <ResponderLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
