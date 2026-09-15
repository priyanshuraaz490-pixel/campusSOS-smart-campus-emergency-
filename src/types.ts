export type EmergencyType = 'Medical' | 'Fire' | 'Security' | 'Accident';

export type Severity = 'Critical' | 'High' | 'Medium';

export type Priority = 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'NORMAL PRIORITY';

export type ResponseTeam =
  | 'Medical Response Team'
  | 'Fire & Safety Team'
  | 'Security Response Team'
  | 'Medical + Security Team';

export type CampusLocation =
  | 'Hostel 1'
  | 'Hostel 2'
  | 'Hostel 3'
  | 'Hostel 4'
  | 'Hostel 5'
  | 'Hostel 6'
  | 'Library'
  | 'CR C1'
  | 'CR C2'
  | 'Main Gate';

export type EmergencyStatus = 'PENDING' | 'ACCEPTED' | 'RESOLVED';

export interface Emergency {
  id: string;
  incident_code: string;
  emergency_type: EmergencyType;
  severity: Severity;
  priority?: Priority;
  assignedTeam?: ResponseTeam | string;
  assistance?: string;
  location: CampusLocation | string;
  coordinates?: string;
  description: string;
  status: EmergencyStatus;
  reported_at: string;
  accepted_at?: string;
  resolved_at?: string;
}
