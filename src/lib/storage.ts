import { 
  Emergency, 
  EmergencyStatus, 
  EmergencyType, 
  Severity, 
  CampusLocation, 
  Priority, 
  ResponseTeam 
} from '../types';

const STORAGE_KEY = 'campussos_emergencies';

export function determinePriority(severity: Severity): Priority {
  switch (severity) {
    case 'Critical':
      return 'HIGH PRIORITY';
    case 'High':
      return 'MEDIUM PRIORITY';
    case 'Medium':
      return 'NORMAL PRIORITY';
    default:
      return 'NORMAL PRIORITY';
  }
}

export function determineResponseTeam(type: EmergencyType): ResponseTeam {
  switch (type) {
    case 'Medical':
      return 'Medical Response Team';
    case 'Fire':
      return 'Fire & Safety Team';
    case 'Security':
      return 'Security Response Team';
    case 'Accident':
      return 'Medical + Security Team';
    default:
      return 'Medical Response Team';
  }
}

export function determineAssistance(type: EmergencyType, severity: Severity): string {
  switch (type) {
    case 'Medical':
      return severity === 'Critical' ? 'Ambulance + First Aid' : 'First Aid & Medical Kit';
    case 'Fire':
      return 'Fire Extinguishers + Evacuation';
    case 'Security':
      return 'Security Guard + Rapid Intervention';
    case 'Accident':
      return 'Ambulance + Campus Patrol';
    default:
      return 'Emergency Response Protocol';
  }
}

export const INITIAL_DEMO_DATA: Emergency[] = [
  {
    id: 'cs-1001',
    incident_code: 'CS-1001',
    emergency_type: 'Medical',
    severity: 'Critical',
    priority: 'HIGH PRIORITY',
    assignedTeam: 'Medical Response Team',
    assistance: 'Ambulance + First Aid',
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
    priority: 'MEDIUM PRIORITY',
    assignedTeam: 'Security Response Team',
    assistance: 'Security Guard + Rapid Intervention',
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
    priority: 'NORMAL PRIORITY',
    assignedTeam: 'Medical + Security Team',
    assistance: 'Ambulance + Campus Patrol',
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

const SEVERITY_WEIGHT: Record<Severity, number> = {
  Critical: 3,
  High: 2,
  Medium: 1,
};

export function sortEmergenciesByPriority(list: Emergency[]): Emergency[] {
  return [...list].sort((a, b) => {
    const weightA = SEVERITY_WEIGHT[a.severity] || 0;
    const weightB = SEVERITY_WEIGHT[b.severity] || 0;
    if (weightA !== weightB) {
      return weightB - weightA; // 1. Critical (3), 2. High (2), 3. Medium (1)
    }
    // If same severity, newest incident code / timestamp first
    return b.id.localeCompare(a.id);
  });
}

export function getEmergencies(): Emergency[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const sorted = sortEmergenciesByPriority(INITIAL_DEMO_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const sorted = sortEmergenciesByPriority(INITIAL_DEMO_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      return sorted;
    }

    // Ensure all items have priority, assignedTeam, assistance, and valid location
    let needsUpdate = false;
    const cleaned = parsed.map((item: Emergency) => {
      let modified = false;
      const sanitized = sanitizeLocation(item.location);
      if (sanitized !== item.location) {
        modified = true;
      }
      const priority = item.priority || determinePriority(item.severity);
      if (item.priority !== priority) {
        modified = true;
      }
      const assignedTeam = item.assignedTeam || determineResponseTeam(item.emergency_type);
      if (item.assignedTeam !== assignedTeam) {
        modified = true;
      }
      const assistance = item.assistance || determineAssistance(item.emergency_type, item.severity);
      if (item.assistance !== assistance) {
        modified = true;
      }

      if (modified) {
        needsUpdate = true;
        return {
          ...item,
          location: sanitized,
          priority,
          assignedTeam,
          assistance,
        };
      }
      return item;
    });

    const sortedCleaned = sortEmergenciesByPriority(cleaned);

    if (needsUpdate || JSON.stringify(sortedCleaned) !== raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedCleaned));
    }

    return sortedCleaned;
  } catch {
    return sortEmergenciesByPriority(INITIAL_DEMO_DATA);
  }
}

export function saveEmergencies(data: Emergency[]): void {
  try {
    const sorted = sortEmergenciesByPriority(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
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
  assistance?: string;
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

  // 1. AUTOMATIC RESPONSE TEAM ASSIGNMENT based on Emergency Type
  const assignedTeam = determineResponseTeam(params.emergency_type);

  // 2. PRIORITY based on Severity
  const priority = determinePriority(params.severity);

  // Assistance Required default
  const assistance = params.assistance || determineAssistance(params.emergency_type, params.severity);

  const newEmergency: Emergency = {
    id: `cs-${Date.now()}`,
    incident_code: `CS-${nextNum}`,
    emergency_type: params.emergency_type,
    severity: params.severity,
    priority,
    assignedTeam,
    assistance,
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
    const sorted = sortEmergenciesByPriority(INITIAL_DEMO_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new CustomEvent('campussos_update'));
    return sorted;
  } catch (e) {
    console.error('Failed to reset localStorage:', e);
    return sortEmergenciesByPriority(INITIAL_DEMO_DATA);
  }
}
