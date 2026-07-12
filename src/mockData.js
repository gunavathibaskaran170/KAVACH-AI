// Mock Data for ACPIA Hackathon Prototype
// Clearly labeled as fictional, synthetic placeholder data for demonstration purposes only.

export const mockCases = [
  {
    id: "CASE-101",
    name: "Project Aurora",
    description: "Investigation into suspected network distribution patterns on regional servers.",
    status: "Active",
    leadInvestigator: "Inspector R. Nair (Cyberdome)",
    targetEntities: ["Entity A", "Entity B"],
  },
  {
    id: "CASE-102",
    name: "Operation Ironclad",
    description: "Analysis of cross-modal files flagged during routine network checks.",
    status: "Active",
    leadInvestigator: "S.I. Meera K. (Cyberdome)",
    targetEntities: ["Entity C"],
  },
  {
    id: "CASE-103",
    name: "Phantom Link",
    description: "Investigation of metadata inconsistencies on encrypted cloud storage.",
    status: "Pending Archive",
    leadInvestigator: "Inspector R. Nair (Cyberdome)",
    targetEntities: ["Entity D"],
  }
];

export const mockDevices = [
  { id: "DEV-001", name: "Suspect Device A (Mobile)", owner: "Entity A", type: "Mobile Phone" },
  { id: "DEV-002", name: "Encrypted Cloud Storage Node", owner: "Entity B", type: "Cloud Storage" },
  { id: "DEV-003", name: "Fictional Storage Server #9", owner: "Entity C", type: "Server" },
  { id: "DEV-004", name: "Suspect Device B (Laptop)", owner: "Entity A", type: "Computer" },
  { id: "DEV-005", name: "Burner SIM #2 (Cell Tower Logs)", owner: "Entity D", type: "Network Node" }
];

export const initialEvidenceItems = [
  {
    id: "EVD-001",
    caseId: "CASE-101",
    type: "text",
    title: "Chat Log Extract #12",
    timestamp: "2026-06-10T14:32:00Z",
    deviceId: "DEV-001",
    riskScore: 78,
    confidence: 85,
    riskFactors: [
      { name: "Keyword cluster match", value: 30, details: "Flagged keywords: 'file transfer', 'private key', 'archive'" },
      { name: "Behavioral pattern match", value: 25, details: "Suspicious peer-to-peer connection frequency at off-peak hours" },
      { name: "Cross-source corroboration", value: 15, details: "Corroborated with Device A metadata timestamp" },
      { name: "Metadata anomaly", value: 8, details: "Missing routing headers in chat logs" }
    ],
    snippet: "Entity A: 'Files are uploaded to the secure node. Let me know when you pull the archive.' Entity B: 'Link received. Proceeding with transfer.'",
    syntheticBadge: "Low",
    provenance: {
      compression: 10,
      metadataInconsistency: 5,
      fingerprint: 12,
      summary: "Standard chat export format. No structural tampering detected."
    },
    triageStatus: "High Confidence — Verify",
    reason: "Direct peer-to-peer transmission of unverified archive link"
  },
  {
    id: "EVD-002",
    caseId: "CASE-101",
    type: "image",
    title: "Image Metadata Log #01",
    timestamp: "2026-06-10T14:35:00Z",
    deviceId: "DEV-001",
    riskScore: 92,
    confidence: 90,
    riskFactors: [
      { name: "Metadata anomaly", value: 40, details: "EXIF software string altered. Camera model missing while resolution matches professional DSLR." },
      { name: "Keyword cluster match", value: 22, details: "Correlated directory name 'vault/private'" },
      { name: "Behavioral pattern match", value: 18, details: "Rapid sequential storage writing pattern" },
      { name: "Cross-source corroboration", value: 12, details: "Shared geolocation metadata with cell tower log EVD-006" }
    ],
    snippet: "File: IMG_4892.jpg. EXIF: [Tampered] Software: 'HexEditor Pro'. Geolocation: 8.5241 N, 76.9366 E (Trivandrum Sector). Camera: N/A.",
    syntheticBadge: "High",
    provenance: {
      compression: 85,
      metadataInconsistency: 90,
      fingerprint: 75,
      summary: "High probability of AI-generated content or heavy manipulation. Software signature indicates manual hex-editing of JPEG headers."
    },
    triageStatus: "High Confidence — Verify",
    reason: "Highly suspicious EXIF modification showing hex-editor signature"
  },
  {
    id: "EVD-003",
    caseId: "CASE-101",
    type: "audio",
    title: "Audio Metadata Snippet #04",
    timestamp: "2026-06-11T09:12:00Z",
    deviceId: "DEV-004",
    riskScore: 54,
    confidence: 65,
    riskFactors: [
      { name: "Metadata anomaly", value: 20, details: "MPEG-4 audio container has incorrect chunk offset alignment." },
      { name: "Behavioral pattern match", value: 20, details: "Short burst audio transmission (3.2 seconds)" },
      { name: "Keyword cluster match", value: 14, details: "Folder path structure contains suspected tag patterns" }
    ],
    snippet: "Duration: 3.2s. Format: M4A. Audio stream contains high frequency background pilot tones typical of simulated voice synths.",
    syntheticBadge: "Medium",
    provenance: {
      compression: 45,
      metadataInconsistency: 30,
      fingerprint: 60,
      summary: "Voice pitch analysis indicates partial synthesized text-to-speech signatures."
    },
    triageStatus: "Ambiguous — Needs Judgment",
    reason: "Suspected AI-generated voice element detected in background track"
  },
  {
    id: "EVD-004",
    caseId: "CASE-102",
    type: "video",
    title: "Video Log Entry #08",
    timestamp: "2026-06-12T18:45:00Z",
    deviceId: "DEV-002",
    riskScore: 81,
    confidence: 88,
    riskFactors: [
      { name: "Cross-source corroboration", value: 35, details: "File hash matches flagged item found in Device B server directory" },
      { name: "Metadata anomaly", value: 25, details: "Frame rate manipulation detected (variable frame rate without speed flags)" },
      { name: "Keyword cluster match", value: 21, details: "Associated with transfer log 'Operation Ironclad'" }
    ],
    snippet: "Video Hash: a3f89e2c... VFR active. Metadata indicates encoding was completed using an automated script rather than camera hardware.",
    syntheticBadge: "Medium",
    provenance: {
      compression: 55,
      metadataInconsistency: 70,
      fingerprint: 40,
      summary: "Video stream shows minor artifacts consistent with deepfake face-swapping tool compressions."
    },
    triageStatus: "High Confidence — Verify",
    reason: "Hash cross-correlation matches a flagged node in active Case #102"
  },
  {
    id: "EVD-005",
    caseId: "CASE-102",
    type: "text",
    title: "Fictional E-Mail Header #02",
    timestamp: "2026-06-13T07:30:00Z",
    deviceId: "DEV-002",
    riskScore: 35,
    confidence: 45,
    riskFactors: [
      { name: "Metadata anomaly", value: 15, details: "Email client user-agent mismatches sending IP geolocation" },
      { name: "Keyword cluster match", value: 15, details: "Header routing includes mock domain 'relay-fake.net'" },
      { name: "Cross-source corroboration", value: 5, details: "Linked to DEV-002 IP address logs" }
    ],
    snippet: "From: anonymous-user@mockmail.org. To: entity-c@cloudnode.com. Subject: File details updated. IP: 192.168.10.45",
    syntheticBadge: "Low",
    provenance: {
      compression: 5,
      metadataInconsistency: 15,
      fingerprint: 5,
      summary: "Standard SMTP headers with standard client routing."
    },
    triageStatus: "Low Priority — Batch Review",
    reason: "Low priority metadata anomaly from unauthenticated local relays"
  },
  {
    id: "EVD-006",
    caseId: "CASE-101",
    type: "text",
    title: "Cell Tower Geo-Log #15",
    timestamp: "2026-06-10T14:36:00Z",
    deviceId: "DEV-005",
    riskScore: 68,
    confidence: 82,
    riskFactors: [
      { name: "Cross-source corroboration", value: 30, details: "Co-located with Device A within 3 minutes of image upload EVD-002" },
      { name: "Behavioral pattern match", value: 25, details: "Frequent ping sequences to isolated cell sectors" },
      { name: "Metadata anomaly", value: 13, details: "SIM IMSI mismatches registration record country code" }
    ],
    snippet: "Cell ID: Trivandrum-3342. Device IMSI: 40445xxxxxxxxxx. Co-location coordinates match EVD-002 coordinates.",
    syntheticBadge: "Low",
    provenance: {
      compression: 0,
      metadataInconsistency: 20,
      fingerprint: 0,
      summary: "Carrier signal log. No digital synthesis possible."
    },
    triageStatus: "High Confidence — Verify",
    reason: "Geographic co-location corroborates suspect mobile device upload"
  },
  {
    id: "EVD-007",
    caseId: "CASE-103",
    type: "image",
    title: "Server Storage Mock Screenshot",
    timestamp: "2026-06-14T22:15:00Z",
    deviceId: "DEV-003",
    riskScore: 48,
    confidence: 50,
    riskFactors: [
      { name: "Metadata anomaly", value: 20, details: "Missing screenshot software marker" },
      { name: "Keyword cluster match", value: 18, details: "Directory path screenshot contains simulated files list" },
      { name: "Behavioral pattern match", value: 10, details: "File created outside investigator access window" }
    ],
    snippet: "Screenshot showing directory contents of server storage block #9. Folder path: '/opt/synthetic/case_data_dump/'.",
    syntheticBadge: "Low",
    provenance: {
      compression: 20,
      metadataInconsistency: 10,
      fingerprint: 15,
      summary: "Standard screenshot image format. Low modifications."
    },
    triageStatus: "Low Priority — Batch Review",
    reason: "General snapshot file with basic directory references"
  },
  {
    id: "EVD-008",
    caseId: "CASE-103",
    type: "audio",
    title: "Encrypted Audio Packet #23",
    timestamp: "2026-06-15T02:40:00Z",
    deviceId: "DEV-003",
    riskScore: 72,
    confidence: 78,
    riskFactors: [
      { name: "Behavioral pattern match", value: 30, details: "Suspicious VoIP routing through multi-hop VPN servers" },
      { name: "Metadata anomaly", value: 25, details: "Audio duration header does not match payload length (length injection)" },
      { name: "Cross-source corroboration", value: 17, details: "Corroborated with Device #3 storage event sequence" }
    ],
    snippet: "Packets captured from SIP port. Header Duration: 05:00. Payload Data: 01:23. Stream terminates unexpectedly.",
    syntheticBadge: "High",
    provenance: {
      compression: 40,
      metadataInconsistency: 85,
      fingerprint: 80,
      summary: "Synthetic header modifications indicate deliberate spoofing of audio stream duration."
    },
    triageStatus: "Ambiguous — Needs Judgment",
    reason: "Packet length injection in SIP stream headers"
  },
  {
    id: "EVD-009",
    caseId: "CASE-101",
    type: "video",
    title: "Simulated CCTV Feed Analysis",
    timestamp: "2026-06-11T16:10:00Z",
    deviceId: "DEV-005",
    riskScore: 59,
    confidence: 60,
    riskFactors: [
      { name: "Behavioral pattern match", value: 25, details: "Entity A detected near transit sector lobby" },
      { name: "Metadata anomaly", value: 20, details: "Timestamp track overlay is offset by 4 seconds" },
      { name: "Cross-source corroboration", value: 14, details: "Matches cell ping timings for IMSI #40445" }
    ],
    snippet: "CCTV-004 Lobby Feed. 16:10:04. Resolution: 1080p. Simulated pedestrian matching filters label entity as Entity A (78% confidence).",
    syntheticBadge: "Low",
    provenance: {
      compression: 20,
      metadataInconsistency: 25,
      fingerprint: 10,
      summary: "Standard CCTV h.264 stream. Frame drops match server encoding log."
    },
    triageStatus: "Ambiguous — Needs Judgment",
    reason: "Fictional automated face-match candidate near transit station lobby"
  },
  {
    id: "EVD-010",
    caseId: "CASE-102",
    type: "text",
    title: "System Log Dump #90",
    timestamp: "2026-06-12T19:00:00Z",
    deviceId: "DEV-004",
    riskScore: 89,
    confidence: 92,
    riskFactors: [
      { name: "Behavioral pattern match", value: 35, details: "Sequential deletion of evidence logs detected within seconds" },
      { name: "Metadata anomaly", value: 30, details: "System clock was rolled back by 2 hours manually" },
      { name: "Cross-source corroboration", value: 24, details: "Tied to video file hash modification timestamp" }
    ],
    snippet: "System Event: 'Time adjusted manually' [19:00:00 -> 17:00:00]. RM -RF command executed in directories with metadata logs.",
    syntheticBadge: "Low",
    provenance: {
      compression: 0,
      metadataInconsistency: 40,
      fingerprint: 0,
      summary: "Raw system event log dump. Clear manual override indicators."
    },
    triageStatus: "High Confidence — Verify",
    reason: "Intentional rollback of system clock and command-line deletion log"
  }
];

// Generate synthetic relations (edges for node graph)
// Correlation types: Device, Case, Location, Timestamp overlap, Keyword
export const mockRelations = [
  { source: "EVD-001", target: "DEV-001", type: "device" },
  { source: "EVD-002", target: "DEV-001", type: "device" },
  { source: "EVD-003", target: "DEV-004", type: "device" },
  { source: "EVD-004", target: "DEV-002", type: "device" },
  { source: "EVD-005", target: "DEV-002", type: "device" },
  { source: "EVD-006", target: "DEV-005", type: "device" },
  { source: "EVD-007", target: "DEV-003", type: "device" },
  { source: "EVD-008", target: "DEV-003", type: "device" },
  { source: "EVD-009", target: "DEV-005", type: "device" },
  { source: "EVD-010", target: "DEV-004", type: "device" },

  // Case groupings
  { source: "EVD-001", target: "CASE-101", type: "case" },
  { source: "EVD-002", target: "CASE-101", type: "case" },
  { source: "EVD-003", target: "CASE-101", type: "case" },
  { source: "EVD-006", target: "CASE-101", type: "case" },
  { source: "EVD-009", target: "CASE-101", type: "case" },
  
  { source: "EVD-004", target: "CASE-102", type: "case" },
  { source: "EVD-005", target: "CASE-102", type: "case" },
  { source: "EVD-010", target: "CASE-102", type: "case" },

  { source: "EVD-007", target: "CASE-103", type: "case" },
  { source: "EVD-008", target: "CASE-103", type: "case" },

  // Cross-modal links
  { source: "EVD-001", target: "EVD-002", type: "timestamp", reason: "Sent 3 mins apart" },
  { source: "EVD-002", target: "EVD-006", type: "location", reason: "Matched coordinates at Trivandrum Sector" },
  { source: "EVD-004", target: "EVD-010", type: "keyword", reason: "Matched Operation Ironclad path references" },
  { source: "EVD-003", target: "EVD-010", type: "device-owner", reason: "Both DEV-004 events" },
  { source: "EVD-006", target: "EVD-009", type: "timestamp", reason: "Both tracked near transit station" }
];

export const initialAuditLogs = [
  { id: "LOG-001", timestamp: "2026-07-11T09:00:15Z", actor: "System (Ingest)", action: "Auto-ingested files from suspect device DEV-001.", target: "EVD-001" },
  { id: "LOG-002", timestamp: "2026-07-11T09:02:40Z", actor: "System (AI-Triage)", action: "Generated explainable risk score (78%) for Chat Log #12.", target: "EVD-001" },
  { id: "LOG-003", timestamp: "2026-07-11T09:05:00Z", actor: "System (Ingest)", action: "Auto-ingested EXIF metadata from IMG_4892.jpg.", target: "EVD-002" },
  { id: "LOG-004", timestamp: "2026-07-11T09:06:12Z", actor: "System (AI-Triage)", action: "Flagged EXIF manipulation; generated high risk score (92%).", target: "EVD-002" },
  { id: "LOG-005", timestamp: "2026-07-11T10:15:30Z", actor: "Inspector R. Nair (ID: KP-8893)", action: "Viewed EXIF software details on EVD-002.", target: "EVD-002" }
];
