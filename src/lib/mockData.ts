// High-quality mock data for Demo Mode

export const mockReports = [
  {
    id: "demo-1",
    report_id: "RPT-A3X7K9",
    title: "Library Accessibility Issues - Wheelchair Ramps Missing",
    zone: "Central Library",
    status: "resolved" as const,
    severity: "high" as const,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ghost_identity_id: null,
  },
  {
    id: "demo-2",
    report_id: "RPT-B5M2P8",
    title: "Late Night Shuttle Service Concerns",
    zone: "Transport Hub",
    status: "investigating" as const,
    severity: "medium" as const,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ghost_identity_id: null,
  },
  {
    id: "demo-3",
    report_id: "RPT-C8N4Q1",
    title: "Cafeteria Food Quality and Hygiene Standards",
    zone: "Student Center",
    status: "under_review" as const,
    severity: "critical" as const,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    ghost_identity_id: null,
  },
  {
    id: "demo-4",
    report_id: "RPT-D2L6R3",
    title: "Inadequate Mental Health Support Resources",
    zone: "Health Center",
    status: "submitted" as const,
    severity: "high" as const,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ghost_identity_id: null,
  },
  {
    id: "demo-5",
    report_id: "RPT-E9K1S7",
    title: "Dormitory Heating System Malfunction",
    zone: "Residential Hall A",
    status: "resolved" as const,
    severity: "high" as const,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    ghost_identity_id: null,
  },
];

export const mockSentimentLogs = [
  { id: "demo-s1", zone_id: "zone-1", zone_name: "Central Library", concern_level: "safe", reports_count: 12, last_report_at: new Date().toISOString() },
  { id: "demo-s2", zone_id: "zone-2", zone_name: "Transport Hub", concern_level: "warning", reports_count: 28, last_report_at: new Date().toISOString() },
  { id: "demo-s3", zone_id: "zone-3", zone_name: "Student Center", concern_level: "critical", reports_count: 45, last_report_at: new Date().toISOString() },
  { id: "demo-s4", zone_id: "zone-4", zone_name: "Health Center", concern_level: "warning", reports_count: 19, last_report_at: new Date().toISOString() },
  { id: "demo-s5", zone_id: "zone-5", zone_name: "Residential Hall A", concern_level: "safe", reports_count: 8, last_report_at: new Date().toISOString() },
  { id: "demo-s6", zone_id: "zone-6", zone_name: "Science Building", concern_level: "safe", reports_count: 5, last_report_at: new Date().toISOString() },
  { id: "demo-s7", zone_id: "zone-7", zone_name: "Sports Complex", concern_level: "warning", reports_count: 15, last_report_at: new Date().toISOString() },
  { id: "demo-s8", zone_id: "zone-8", zone_name: "Admin Block", concern_level: "critical", reports_count: 32, last_report_at: new Date().toISOString() },
  { id: "demo-s9", zone_id: "zone-9", zone_name: "Parking Zone", concern_level: "safe", reports_count: 3, last_report_at: new Date().toISOString() },
];

export const mockNegotiations = [
  {
    id: "demo-n1",
    grievance_text: "Students report inadequate lighting in the parking lot, leading to safety concerns during evening hours.",
    negotiation_log: [
      { round: 1, agent: "Advocate", message: "The lack of proper lighting creates dangerous conditions for students returning late. This is a clear violation of campus safety protocols.", sentimentShift: 8, timestamp: new Date().toISOString() },
      { round: 1, agent: "Administration", message: "We acknowledge the concern. However, the budget for infrastructure upgrades is limited this quarter.", sentimentShift: -3, timestamp: new Date().toISOString() },
      { round: 2, agent: "Advocate", message: "Student safety cannot be compromised due to budget constraints. Temporary solar lights are a cost-effective solution.", sentimentShift: 10, timestamp: new Date().toISOString() },
      { round: 2, agent: "Administration", message: "Solar lights are feasible. We can allocate emergency funds for this interim measure while planning permanent upgrades.", sentimentShift: 5, timestamp: new Date().toISOString() },
    ],
    final_consensus: "Immediate installation of solar-powered temporary lights within 2 weeks. Permanent LED infrastructure upgrade scheduled for next fiscal year.",
    sentinel_score: 68,
    governor_score: 52,
    status: "completed",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-n2",
    grievance_text: "The cafeteria closes at 7 PM, leaving night-shift library users without food options.",
    negotiation_log: [
      { round: 1, agent: "Advocate", message: "Extended library hours without food access creates an unhealthy study environment. Students are forced to skip meals.", sentimentShift: 7, timestamp: new Date().toISOString() },
      { round: 1, agent: "Administration", message: "Operating costs for late-night cafeteria service are significant. We need to assess demand first.", sentimentShift: -2, timestamp: new Date().toISOString() },
      { round: 2, agent: "Advocate", message: "A survey of 500+ students shows 78% support extended hours. Vending machines with healthy options could be a middle ground.", sentimentShift: 12, timestamp: new Date().toISOString() },
      { round: 2, agent: "Administration", message: "The data is compelling. We can pilot a vending solution and evaluate extending cafeteria hours next semester.", sentimentShift: 8, timestamp: new Date().toISOString() },
    ],
    final_consensus: "Install healthy-option vending machines in library lobby within 30 days. Pilot extended cafeteria hours (until 9 PM) next semester based on usage metrics.",
    sentinel_score: 72,
    governor_score: 58,
    status: "completed",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockGhostIdentities = [
  { id: "demo-g1", ghost_name: "VerifiedScholar", avatar: "🎓", reputation: 85, reports_submitted: 12, roll_number_hash: "abc123", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-g2", ghost_name: "TrustedDelegate", avatar: "📋", reputation: 72, reports_submitted: 8, roll_number_hash: "def456", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "demo-g3", ghost_name: "CertifiedAdvocate", avatar: "✓", reputation: 65, reports_submitted: 5, roll_number_hash: "ghi789", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const mockVaultFiles = [
  { id: "demo-v1", file_name: "cafeteria_conditions.jpg", file_path: "demo/cafeteria.jpg", file_type: "image", file_size: "2.3 MB", secret_metadata: "Food safety concerns observed during evening hours", expires_at: null, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), ghost_identity_id: null },
  { id: "demo-v2", file_name: "parking_lot_report.pdf", file_path: "demo/parking.pdf", file_type: "document", file_size: "1.1 MB", secret_metadata: "Detailed lighting audit of campus parking zones", expires_at: null, created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), ghost_identity_id: null },
  { id: "demo-v3", file_name: "shuttle_schedule_issues.docx", file_path: "demo/shuttle.docx", file_type: "document", file_size: "450 KB", secret_metadata: "Analysis of late-night shuttle gaps", expires_at: null, created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), ghost_identity_id: null },
];

export const mockRecentActivity = [
  { id: "demo-a1", type: "report", title: "New report submitted", description: "Library accessibility issue flagged", time: "2m ago" },
  { id: "demo-a2", type: "negotiation", title: "Resolution completed", description: "Parking lights consensus reached", time: "1h ago" },
  { id: "demo-a3", type: "identity", title: "Credential created", description: "New anonymous participant registered", time: "3h ago" },
  { id: "demo-a4", type: "vault", title: "Evidence archived", description: "Document added to Encrypted Repository", time: "5h ago" },
  { id: "demo-a5", type: "resolution", title: "Issue resolved", description: "Dormitory heating fixed", time: "1d ago" },
];
