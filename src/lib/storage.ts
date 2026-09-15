import { Emergency, EmergencyStatus, EmergencyType, Severity, CampusLocation } from '../types';

const STORAGE_KEY = 'campussos_emergencies';

export const INITIAL_DEMO_DATA: Emergency[] = [
  {
    id: 'cs-1001',
    incident_code: 'CS-1001',
    emergency_type: 'Medical',
    severity: 'Critical',
    location: 'Hostel 4',
    description: 'Student fell down stairs and requires immediate assistance.',
    status: 'PENDING',
    reported_at: '10 mins ago',
  },
  {
    id: 'cs-1002',
    incident_code: 'CS-1002',
    emergency_type: 'Security',
    severity: 'High',
    location: 'Main Gate',
    description: 'Unauthorized visitor refusing to identify at gate.',
    status: 'ACCEPTED',
    reported_at: '25 mins ago',
    accepted_at: '20 mins ago',
  },
  {
    id: 'cs-1003',
    incident_code: 'CS-1003',
    emergency_type: 'Accident',
    severity: 'Medium',
    location: 'CR C1',
    description: 'Minor bicycle collision near department stairs.',
    status: 'RESOLVED',
    reported_at: '1 hour ago',
    accepted_at: '50 mins ago',
    resolved_at: '30 mins ago',
  },
];

const VALID_LOCATIONS = [
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

export function sanitizeLocation(loc: string): string {
  if (!loc) return 'Hostel 4';
  if (VALID_LOCATIONS.includes(loc)) return loc;
  // If location has GPS coords attached but starts with a valid location
  const matching = VALID_LOCATIONS.find(v => loc.startsWith(v));
  if (matching) return loc;
  return 'Hostel 4';
}

export function getEmergencies(): Emergency[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
      return INITIAL_DEMO_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
      return INITIAL_DEMO_DATA;
    }

    // Sanitize any legacy locations
    let hasLegacy = false;
    const cleaned = parsed.map((item: Emergency) => {
      const sanitized = sanitizeLocation(item.location);
      if (sanitized !== item.location) {
        hasLegacy = true;
        return { ...item, location: sanitized };
      }
      return item;
    });

    if (hasLegacy) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }

    return cleaned;
  } catch {
    return INITIAL_DEMO_DATA;
  }
}

export function saveEmergencies(data: Emergency[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('campussos_update'));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function createEmergency(params: {
  emergency_type: EmergencyType;
  severity: Severity;
  location: CampusLocation | string;
  coordinates?: string;
  description: string;
}): Emergency {
  const current = getEmergencies();

  // Generate next Incident ID (e.g. CS-1024 or next after max)
  let nextNum = 1024;
  const existingNums = current
    .map(e => {
      const match = e.incident_code.match(/CS-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !isNaN(n) && n > 0);

  if (existingNums.length > 0) {
    const max = Math.max(...existingNums);
    if (max >= 1024) {
      nextNum = max + 1;
    }
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newEmergency: Emergency = {
    id: `cs-${Date.now()}`,
    incident_code: `CS-${nextNum}`,
    emergency_type: params.emergency_type,
    severity: params.severity,
    location: params.location,
    coordinates: params.coordinates,
    description: params.description.trim() || 'No additional details provided.',
    status: 'PENDING',
    reported_at: `Just now (${timeFormatted})`,
  };

  const updated = [newEmergency, ...current];
  saveEmergencies(updated);
  return newEmergency;
}

export function updateEmergencyStatus(id: string, status: EmergencyStatus): Emergency | null {
  const current = getEmergencies();
  let updatedRecord: Emergency | null = null;
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updated = current.map(item => {
    if (item.id === id || item.incident_code === id) {
      const copy: Emergency = { ...item, status };
      if (status === 'ACCEPTED') {
        copy.accepted_at = `Just now (${timeFormatted})`;
      } else if (status === 'RESOLVED') {
        copy.resolved_at = `Just now (${timeFormatted})`;
      }
      updatedRecord = copy;
      return copy;
    }
    return item;
  });

  saveEmergencies(updated);
  return updatedRecord;
}

export function resetToDemoData(): Emergency[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_DATA));
    window.dispatchEvent(new CustomEvent('campussos_update'));
  } catch (e) {
    console.error('Failed to reset localStorage:', e);
  }
  return INITIAL_DEMO_DATA;
}
