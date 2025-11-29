export interface Procedure {
  id: string;
  text: string;
}

export interface Phase {
  title: string; // "Start (Online)", "Ground (Offline)", "Follow-up"
  type: 'online' | 'ground' | 'followup';
  procedures: Procedure[];
}

export interface Step {
  id: number;
  title: string;
  description: string;
  phases: Phase[];
}

export interface Merchant {
  id: string;
  name: string;
  address: string;
  status: 'New' | 'Onboarded' | 'Follow-Up Needed';
  notes: string;
  dateAdded: string;
}

export interface TeamMember {
  id: string;
  name: string;
  status: 'Applicant' | 'Training' | 'Active';
  phone: string;
}

export interface ProgressState {
  [stepId: number]: {
    [procedureId: string]: boolean;
  };
}

export type View = 'dashboard' | 'step-detail' | 'merchant-list' | 'team-list' | 'ai-coach';
