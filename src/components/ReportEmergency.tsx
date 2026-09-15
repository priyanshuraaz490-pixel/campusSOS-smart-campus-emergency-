import React, { useState } from 'react';
import { EmergencyType, Severity, CampusLocation } from '../types';
import { ArrowLeft, MapPin, Navigation, Check, AlertCircle, Loader2 } from 'lucide-react';

interface ReportEmergencyProps {
  initialType?: EmergencyType;
  onSubmit: (data: {
    emergency_type: EmergencyType;
    severity: Severity;
    location: CampusLocation | string;
    coordinates?: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  'Hostel 1',
  'Hostel 2',
  'Hostel 3',
  'Hostel 4',
  'Hostel 5',
  'Hostel 6',
  'Library',
  'CR C1',
  'CR C2',
  'Main Gate',
];

export const ReportEmergency: React.FC<ReportEmergencyProps> = ({
  initialType = 'Medical',
  onSubmit,
  onCancel,
}) => {
  const [emergencyType, setEmergencyType] = useState<EmergencyType>(initialType);
  const [severity, setSeverity] = useState<Severity>('Critical');
  const [location, setLocation] = useState<CampusLocation>('Hostel 4');
  const [coordinates, setCoordinates] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const getDefaultDesc = (type?: EmergencyType | string): string => {
    switch (type) {
      case 'Medical':
        return 'Student needs immediate medical assistance.';
      case 'Fire':
        return 'Smoke/fire reported, urgent evacuation needed.';
      case 'Security':
        return 'Immediate security intervention requested.';
      case 'Accident':
        return 'Emergency collision or injury incident on campus.';
      default:
        return 'Emergency assistance required on campus.';
    }
  };

  const [description, setDescription] = useState(getDefaultDesc(initialType));

  // Sync state if initialType prop changes from outside
  React.useEffect(() => {
    setEmergencyType(initialType);
    setDescription(prev => {
      const isAnyDefault = [
        'Student needs immediate medical assistance.',
        'Smoke/fire reported, urgent evacuation needed.',
        'Immediate security intervention requested.',
        'Emergency collision or injury incident on campus.',
        'Emergency assistance required on campus.',
      ].includes(prev);
      return isAnyDefault ? getDefaultDesc(initialType) : prev;
    });
  }, [initialType]);

  const typeOptions: { type: EmergencyType; label: string; emoji: string }[] = [
    { type: 'Medical', label: 'Medical', emoji: '🚑' },
    { type: 'Fire', label: 'Fire', emoji: '🔥' },
    { type: 'Security', label: 'Security', emoji: '🛡' },
    { type: 'Accident', label: 'Accident', emoji: '⚠' },
  ];

  const severityOptions: {
    value: Severity;
    label: string;
    description: string;
    activeBorder: string;
    activeBg: string;
    badgeBg: string;
    textColor: string;
  }[] = [
    {
      value: 'Critical',
      label: 'Critical',
      description: 'Life threatening or immediate danger',
      activeBorder: 'border-red-500',
      activeBg: 'bg-red-50/70',
      badgeBg: 'bg-red-600',
      textColor: 'text-red-700',
    },
    {
      value: 'High',
      label: 'High',
      description: 'Urgent situation requiring rapid response',
      activeBorder: 'border-orange-500',
      activeBg: 'bg-orange-50/70',
      badgeBg: 'bg-orange-500',
      textColor: 'text-orange-700',
    },
    {
      value: 'Medium',
      label: 'Medium',
      description: 'Non-life threatening safety issue',
      activeBorder: 'border-amber-400',
      activeBg: 'bg-amber-50/70',
      badgeBg: 'bg-amber-400',
      textColor: 'text-amber-800',
    },
  ];

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        const latDir = position.coords.latitude >= 0 ? 'N' : 'S';
        const lngDir = position.coords.longitude >= 0 ? 'E' : 'W';
        const coordsStr = `${Math.abs(Number(lat))}° ${latDir}, ${Math.abs(Number(lng))}° ${lngDir}`;
        setCoordinates(coordsStr);
        setGeoLoading(false);
      },
      error => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission was denied. Please select your exact location from the dropdown.');
        } else {
          setGeoError('Unable to retrieve current coordinates. Please select from the dropdown.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      return;
    }
    onSubmit({
      emergency_type: emergencyType,
      severity,
      location,
      coordinates: coordinates || undefined,
      description,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 sm:py-8">
      {/* Back button */}
      <button
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-xs">
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 sm:mb-2">
          Report Emergency
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6">
          Provide key information so campus response teams can act immediately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Field 1: Emergency Type */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Emergency Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {typeOptions.map(t => {
                const isSelected = emergencyType === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setEmergencyType(t.type)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 w-full ${
                      isSelected
                        ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-xs sm:text-sm">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 2: Severity */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Severity Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {severityOptions.map(s => {
                const isSelected = severity === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSeverity(s.value)}
                    className={`p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer w-full ${
                      isSelected
                        ? `${s.activeBorder} ${s.activeBg} shadow-xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3 h-3 rounded-full ${s.badgeBg} shrink-0`} />
                      <span className={`text-sm font-bold ${isSelected ? s.textColor : 'text-slate-800'}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {s.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 3: Exact Location (Required Dropdown) & Geolocation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="exact-location-select" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>📍 Exact Location</span>
                <span className="text-red-600">*</span>
              </label>
              <span className="text-xs text-slate-400">Required</span>
            </div>

            <div className="space-y-3">
              {/* Dropdown options */}
              <div className="relative">
                <select
                  id="exact-location-select"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value as CampusLocation)}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent cursor-pointer shadow-xs"
                >
                  <option value="" disabled>Select exact campus location...</option>
                  {CAMPUS_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              {/* 📍 Use My Current Location Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-slate-600 min-w-0">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="truncate">
                    {coordinates ? (
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1.5 flex-wrap">
                        <Check className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                        <span className="font-mono text-[11px] sm:text-xs">GPS: {coordinates}</span>
                        <button
                          type="button"
                          onClick={() => setCoordinates(null)}
                          className="ml-1 text-[11px] text-slate-400 hover:text-red-600 underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </span>
                    ) : (
                      'Attach GPS coordinates for faster dispatch'
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={geoLoading}
                  className="w-full sm:w-auto justify-center px-3 py-2 sm:py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs disabled:opacity-50"
                >
                  {geoLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5 text-red-600" />
                      <span>📍 Use My Current Location</span>
                    </>
                  )}
                </button>
              </div>

              {geoError && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="break-words">{geoError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Field 4: Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-800">
                Description
              </label>
              <div className="text-xs text-slate-400">
                Briefly describe what happened
              </div>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Student needs immediate medical assistance."
              required
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Large Red Button */}
          <button
            type="submit"
            className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-base sm:text-lg font-extrabold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🚨 Send Emergency Alert</span>
          </button>
        </form>
      </div>
    </div>
  );
};
