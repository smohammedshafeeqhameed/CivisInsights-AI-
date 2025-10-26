export type Issue = {
  id: string;
  category: string;
  report: string;
  summary: string;
  status: 'New' | 'In Progress' | 'Resolved';
  image?: string | null;
};

export const issues: Issue[] = [
  {
    id: 'CIV-001',
    category: 'Road Maintenance',
    report:
      'Large pothole on the corner of Main St and 2nd Ave, causing traffic issues.',
    summary: 'Pothole at Main & 2nd causing traffic disruption.',
    status: 'New',
  },
  {
    id: 'CIV-002',
    category: 'Public Safety',
    report: 'Streetlight is out on Elm Street between 3rd and 4th.',
    summary: 'Streetlight outage on Elm St.',
    status: 'In Progress',
  },
  {
    id: 'CIV-003',
    category: 'Sanitation',
    report:
      'Public trash can on Oak Ave is overflowing and has not been collected for days.',
    summary: 'Overflowing public trash can on Oak Ave.',
    status: 'New',
  },
  {
    id: 'CIV-004',
    category: 'Parks & Rec',
    report: 'Broken swing at Central Park playground.',
    summary: 'Broken equipment at Central Park playground.',
    status: 'Resolved',
  },
  {
    id: 'CIV-005',
    category: 'Noise Complaint',
    report: 'Loud construction noise before 7 AM near Pine St.',
    summary: 'Early morning construction noise on Pine St.',
    status: 'Resolved',
  },
  {
    id: 'CIV-006',
    category: 'Sanitation',
    report: 'Missed garbage collection on Maple Avenue for the third time this month.',
    summary: 'Repeated missed garbage collection on Maple Ave.',
    status: 'New',
    image: 'https://picsum.photos/seed/6/600/400'
  },
  {
    id: 'CIV-007',
    category: 'Road Maintenance',
    report: 'The traffic light at the intersection of Washington and Lincoln is not working correctly. It is stuck on red.',
    summary: 'Malfunctioning traffic light at Washington/Lincoln.',
    status: 'In Progress',
  },
  {
    id: 'CIV-008',
    category: 'Public Safety',
    report: 'A large group of people are gathering in the park after hours, causing a disturbance.',
    summary: 'After-hours disturbance in park.',
    status: 'New',
  },
  {
    id: 'CIV-009',
    category: 'Other',
    report: 'Abandoned vehicle has been parked on Birch Street for over a week. License plate XYZ 123.',
    summary: 'Abandoned vehicle on Birch Street.',
    status: 'New',
  },
  {
    id: 'CIV-010',
    category: 'Parks & Rec',
    report: 'The water fountain at City Hall Plaza is leaking, creating a large puddle.',
    summary: 'Leaking water fountain at City Hall Plaza.',
    status: 'Resolved',
    image: 'https://picsum.photos/seed/10/600/400'
  },
];

export type DemandPredictionData = {
  service: string;
  predicted_demand: number;
  current_demand: number;
};

export const demandPrediction: DemandPredictionData[] = [
  {
    service: 'Sanitation',
    predicted_demand: 150,
    current_demand: 110,
  },
  {
    service: 'Roads',
    predicted_demand: 120,
    current_demand: 130,
  },
  {
    service: 'Safety',
    predicted_demand: 90,
    current_demand: 85,
  },
  {
    service: 'Parks',
    predicted_demand: 75,
    current_demand: 60,
  },
  {
    service: 'Admin',
    predicted_demand: 50,
    current_demand: 45,
  },
];

export const resourceRecommendations =
  'Increase sanitation patrols in the downtown area by 20% and allocate two additional maintenance crews for road repairs in the northern district for the next month.';

export const governanceInsight =
  'A recurring pattern of noise complaints and illegal parking has been identified in the vicinity of the new commercial complex. Proactive measures such as increased police presence during peak hours and a review of parking regulations are recommended to mitigate potential escalation.';

export const stats = {
  newIssues: 12,
  resolvedToday: 5,
  pendingReview: 8,
  avgResolutionTime: '2.1 days',
};
