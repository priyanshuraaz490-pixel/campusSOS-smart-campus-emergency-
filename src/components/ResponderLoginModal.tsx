import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

interface ResponderLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const ResponderLoginModal: React.FC<ResponderLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState<string | null>(null);

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setError(null);
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Default responder credentials: admin / 1234');
    }
  };

  const handleDemoFill = () => {
    setUsername('admin');
    setPassword('1234');
    setError(null);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full p-4 sm:p-7 shadow-2xl border border-slate-200 my-auto"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Responder Login</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Campus Emergency Response Team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Credentials tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 sm:p-3 mb-4 text-xs text-blue-900 flex items-center justify-between gap-2">
          <div>
            <div className="font-bold text-[11px] sm:text-xs">Responder Access</div>
            <div className="text-blue-700 text-[11px] sm:text-xs">
              User: <span className="font-mono font-bold">admin</span> | Pass: <span className="font-mono font-bold">1234</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer shrink-0"
          >
            Auto-fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs mt-2"
          >
            <span>Sign In as Responder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
