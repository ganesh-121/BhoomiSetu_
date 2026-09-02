import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load Mock Parcels Dataset
const parcelsPath = path.join(__dirname, 'data', 'parcels.json');
let parcelsData = [];

try {
  const rawData = fs.readFileSync(parcelsPath, 'utf8');
  parcelsData = JSON.parse(rawData);
} catch (err) {
  console.error("Error loading parcels dataset:", err);
}

// In-Memory Storage for Service Requests & Audit Logs
let serviceRequests = [
  {
    id: "REQ-2024-8801",
    ulpin: "IN-MH-411001-P1001",
    applicantName: "Rajesh Vasantrao Patil",
    applicantPhone: "+91 98230 49102",
    requestType: "Ownership Mutation Record Request",
    description: "Requesting certified copy of updated 7/12 RoR record post-sale deed execution.",
    status: "Completed",
    submittedDate: "2024-08-15",
    updatedDate: "2024-08-18",
    officerRemarks: "Approved by Haveli Circle Officer. Digital copy issued.",
    department: "Land Records Department"
  },
  {
    id: "REQ-2024-9104",
    ulpin: "IN-MH-411001-P1002",
    applicantName: "Sunita Suresh Deshmukh",
    applicantPhone: "+91 94220 11920",
    requestType: "Property Tax Dues Re-assessment",
    description: "Requesting correction of uncredited tax payment receipt dated March 2022.",
    status: "Under Review",
    submittedDate: "2024-08-28",
    updatedDate: "2024-08-30",
    officerRemarks: "Bank scroll reconciliation pending with Municipal Treasury.",
    department: "Property Tax Department"
  },
  {
    id: "REQ-2024-9420",
    ulpin: "IN-MH-411001-P1007",
    applicantName: "Pandharinath Tukaram Gaikwad",
    applicantPhone: "+91 98901 00291",
    requestType: "Zoning & Metro Corridor Buffer Inquiry",
    description: "Clarification required regarding exact metro alignment buffer zone on Survey No 77/1.",
    status: "Submitted",
    submittedDate: "2024-09-01",
    updatedDate: "2024-09-01",
    officerRemarks: "Assigned to Town Planning Officer.",
    department: "Municipality / Urban Planning"
  }
];

let auditLogs = [
  { id: "LOG-1001", timestamp: "2026-09-02 05:30:12", userRole: "Citizen", action: "Property Verification Query", resource: "ULPIN: IN-MH-411001-P1001", result: "Success" },
  { id: "LOG-1002", timestamp: "2026-09-02 05:15:44", userRole: "Government Officer", action: "Service Request Status Update", resource: "REQ-2024-9104", result: "Success" },
  { id: "LOG-1003", timestamp: "2026-09-02 04:45:00", userRole: "Administrator", action: "Department API Sync Ping", resource: "Sub-Registrar Gateway", result: "200 OK (42ms)" },
  { id: "LOG-1004", timestamp: "2026-09-02 03:20:19", userRole: "Citizen", action: "GIS Layer Toggle: Utilities", resource: "GIS Map View", result: "Success" },
  { id: "LOG-1005", timestamp: "2026-09-02 02:10:05", userRole: "Government Officer", action: "Data Conflict Inspection", resource: "ULPIN: IN-MH-411001-P1002", result: "Conflict Flagged" }
];

let departmentIntegrations = [
  { name: "Land Records (RoR / 7-12)", status: "Active", latency: "38ms", syncSuccessRate: "99.8%", lastSync: "Just now", protocol: "REST / PostGIS" },
  { name: "Sub-Registrar (Registration & Deeds)", status: "Active", latency: "52ms", syncSuccessRate: "99.4%", lastSync: "2 mins ago", protocol: "SOAP / REST API" },
  { name: "Municipal Property Tax Engine", status: "Active", latency: "45ms", syncSuccessRate: "98.9%", lastSync: "5 mins ago", protocol: "REST / JSON" },
  { name: "Urban Development & Zoning Gateway", status: "Active", latency: "60ms", syncSuccessRate: "99.1%", lastSync: "1 min ago", protocol: "OGC WFS Layer" },
  { name: "State Utility Grid & Infrastructure", status: "Active", latency: "41ms", syncSuccessRate: "97.5%", lastSync: "8 mins ago", protocol: "REST / Microservice" },
  { name: "State Pollution & Forest Board", status: "Active", latency: "74ms", syncSuccessRate: "99.0%", lastSync: "12 mins ago", protocol: "Spatial REST API" }
];

// Helper: Add Audit Log Entry
const logAction = (userRole, action, resource, result = "Success") => {
  const newLog = {
    id: `LOG-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    userRole,
    action,
    resource,
    result
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 50) auditLogs.pop();
};

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// GET /api/parcels - List all parcels + GeoJSON FeatureCollection
app.get('/api/parcels', (req, res) => {
  const geojsonFeatures = parcelsData.map(parcel => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      // Leaflet lat/lng to GeoJSON lng/lat conversion for standards compliance
      coordinates: [parcel.coordinates.map(c => [c[1], c[0]])]
    },
    properties: {
      ulpin: parcel.ulpin,
      surveyNo: parcel.surveyNo,
      village: parcel.village,
      areaSqM: parcel.areaSqM,
      ownerName: parcel.owner.name,
      status: parcel.status,
      landUseZone: parcel.landUse.zone,
      center: parcel.center
    }
  }));

  res.json({
    type: "FeatureCollection",
    totalParcels: parcelsData.length,
    parcels: parcelsData,
    geojson: {
      type: "FeatureCollection",
      features: geojsonFeatures
    }
  });
});

// GET /api/parcels/search - Search parcels
app.get('/api/parcels/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) return res.json(parcelsData);

  const filtered = parcelsData.filter(p => 
    p.ulpin.toLowerCase().includes(query) ||
    p.surveyNo.toLowerCase().includes(query) ||
    p.village.toLowerCase().includes(query) ||
    p.owner.name.toLowerCase().includes(query) ||
    p.pincode.includes(query)
  );

  logAction("Citizen", "Search Parcels", `Query: "${query}"`, `Found ${filtered.length}`);
  res.json(filtered);
});

// GET /api/parcels/:ulpin - Fetch complete parcel record
app.get('/api/parcels/:ulpin', (req, res) => {
  const { ulpin } = req.params;
  const parcel = parcelsData.find(p => p.ulpin.toUpperCase() === ulpin.toUpperCase());

  if (!parcel) {
    return res.status(404).json({ error: "Parcel not found with ULPIN: " + ulpin });
  }

  logAction("Citizen", "View Parcel Details", `ULPIN: ${ulpin}`, "Success");
  res.json(parcel);
});

// GET /api/parcels/:ulpin/:domain - Sub-resource domain APIs
app.get('/api/parcels/:ulpin/:domain', (req, res) => {
  const { ulpin, domain } = req.params;
  const parcel = parcelsData.find(p => p.ulpin.toUpperCase() === ulpin.toUpperCase());

  if (!parcel) {
    return res.status(404).json({ error: "Parcel not found" });
  }

  const validDomains = {
    'owner': parcel.owner,
    'registration': parcel.registration,
    'encumbrance': parcel.encumbrance,
    'tax': parcel.tax,
    'land-use': parcel.landUse,
    'building': parcel.buildingPermission,
    'restrictions': parcel.restrictions,
    'utilities': parcel.utilities
  };

  if (!validDomains[domain]) {
    return res.status(400).json({ error: `Invalid domain requested: ${domain}` });
  }

  res.json({
    ulpin: parcel.ulpin,
    domain: domain,
    data: validDomains[domain]
  });
});

// POST /api/verification/check - "Verify Before You Buy" Engine
app.post('/api/verification/check', (req, res) => {
  const { ulpin } = req.body;
  const parcel = parcelsData.find(p => p.ulpin.toUpperCase() === (ulpin || '').toUpperCase());

  if (!parcel) {
    return res.status(404).json({ error: "Cannot perform verification. ULPIN not found." });
  }

  // 7-Point Audit Engine Rules
  const checks = [
    {
      id: "CHK_ROR",
      name: "Record of Rights (RoR 7/12) Ownership",
      status: parcel.owner.name ? "Verified" : "Issue Found",
      details: `Registered Owner: ${parcel.owner.name}. Khata No: ${parcel.owner.khataNo}. Share: ${parcel.owner.sharePercentage}%.`
    },
    {
      id: "CHK_REG",
      name: "Sub-Registrar Title Registration & Deed",
      status: parcel.registration.status.includes("Verified") ? "Verified" : "Pending",
      details: `Deed No: ${parcel.registration.deedNo} (${parcel.registration.deedType}). Stamp Duty Paid: ₹${parcel.registration.stampDutyPaidINR.toLocaleString('en-IN')}.`
    },
    {
      id: "CHK_ENC",
      name: "Encumbrance & Mortgage Status",
      status: parcel.encumbrance.status === "Clear" ? "Verified" : "Issue Found",
      details: parcel.encumbrance.status === "Clear" 
        ? "No active bank liens or court litigation registered." 
        : `Flagged: ${parcel.encumbrance.status}. Bank: ${parcel.encumbrance.bankName}. Litigation: ${parcel.encumbrance.courtCaseNo || 'Under dispute'}.`
    },
    {
      id: "CHK_TAX",
      name: "Municipal Property Tax Dues",
      status: parcel.tax.status === "Paid" ? "Verified" : "Issue Found",
      details: parcel.tax.status === "Paid" 
        ? `Up to date for Assessment Year 2024-25. Annual Tax: ₹${parcel.tax.annualTaxINR.toLocaleString('en-IN')}.` 
        : `Dues Outstanding: ₹${parcel.tax.duesRemainingINR.toLocaleString('en-IN')}.`
    },
    {
      id: "CHK_ZON",
      name: "Master Plan Land Use & Zoning",
      status: parcel.landUse.zone.includes("Residential") || parcel.landUse.zone.includes("Commercial") || parcel.landUse.zone.includes("Industrial") ? "Verified" : "Pending",
      details: `Zoning Zone: ${parcel.landUse.zone}. Max Permissible FSI: ${parcel.landUse.permissibleFSI}.`
    },
    {
      id: "CHK_BLD",
      name: "Building Permission & Sanction Plan",
      status: parcel.buildingPermission.status === "Approved" ? "Verified" : (parcel.buildingPermission.status === "Not Applied" ? "Pending" : "Issue Found"),
      details: `Sanction Plan Status: ${parcel.buildingPermission.status}. Approved Floors: ${parcel.buildingPermission.sanctionedFloors}.`
    },
    {
      id: "CHK_RST",
      name: "Environmental & Legal Restrictions",
      status: parcel.restrictions.status.includes("No Active") || parcel.restrictions.status === "Clear" ? "Verified" : "Issue Found",
      details: parcel.restrictions.status
    }
  ];

  const issueCount = checks.filter(c => c.status === "Issue Found").length;
  const pendingCount = checks.filter(c => c.status === "Pending").length;

  let overallStatus = "Verified";
  let riskScore = "A+ (Clear Title)";

  if (issueCount > 0) {
    overallStatus = "Issue Found";
    riskScore = "C / F (High Risk - Legal Due Diligence Advised)";
  } else if (pendingCount > 0) {
    overallStatus = "Pending Clearance";
    riskScore = "B (Conditional Clearance)";
  }

  const report = {
    reportId: `RPT-VER-${Math.floor(100000 + Math.random() * 900000)}`,
    generatedAt: new Date().toISOString(),
    ulpin: parcel.ulpin,
    surveyNo: parcel.surveyNo,
    village: parcel.village,
    district: parcel.district,
    ownerName: parcel.owner.name,
    overallStatus,
    riskScore,
    checks,
    legalDisclaimer: "This property verification report is compiled automatically from available mock integrated departmental APIs via ULPIN. It is intended for preliminary verification and does not replace official legal due diligence or physical title deeds inspection at the Sub-Registrar Office."
  };

  logAction("Citizen", "Generate Property Verification Report", `ULPIN: ${parcel.ulpin}`, `Result: ${overallStatus}`);
  res.json(report);
});

// GET & POST /api/service-requests
app.get('/api/service-requests', (req, res) => {
  res.json(serviceRequests);
});

app.post('/api/service-requests', (req, res) => {
  const { ulpin, applicantName, applicantPhone, requestType, description, department } = req.body;

  if (!ulpin || !applicantName || !requestType) {
    return res.status(400).json({ error: "ULPIN, Applicant Name, and Request Type are required." });
  }

  const newRequest = {
    id: `REQ-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    ulpin,
    applicantName,
    applicantPhone: applicantPhone || "+91 98000 00000",
    requestType,
    description: description || "No detailed description provided.",
    status: "Submitted",
    submittedDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    officerRemarks: "Application received and queued for review.",
    department: department || "Land Records Department"
  };

  serviceRequests.unshift(newRequest);
  logAction("Citizen", "Submit Service Request", `ID: ${newRequest.id} (${requestType})`, "Queued");
  res.status(201).json(newRequest);
});

// PATCH /api/service-requests/:id - Officer Updates Request Status
app.patch('/api/service-requests/:id', (req, res) => {
  const { id } = req.params;
  const { status, officerRemarks } = req.body;

  const reqIndex = serviceRequests.findIndex(r => r.id === id);
  if (reqIndex === -1) {
    return res.status(404).json({ error: "Service request not found" });
  }

  if (status) serviceRequests[reqIndex].status = status;
  if (officerRemarks) serviceRequests[reqIndex].officerRemarks = officerRemarks;
  serviceRequests[reqIndex].updatedDate = new Date().toISOString().split('T')[0];

  logAction("Government Officer", "Update Service Request", `ID: ${id} -> ${status}`, "Updated");
  res.json(serviceRequests[reqIndex]);
});

// GET /api/admin/integrations
app.get('/api/admin/integrations', (req, res) => {
  res.json({
    gatewayStatus: "Online",
    totalSyncedParcels: parcelsData.length,
    activeIntegrations: departmentIntegrations
  });
});

// GET /api/admin/audit-logs
app.get('/api/admin/audit-logs', (req, res) => {
  res.json(auditLogs);
});

// POST /api/admin/datasets/sync - Trigger dataset re-sync
app.post('/api/admin/datasets/sync', (req, res) => {
  departmentIntegrations.forEach(dept => {
    dept.lastSync = "Just now";
  });
  logAction("Administrator", "Force Department Sync", "All 6 Department APIs", "Synced");
  res.json({ message: "Inter-departmental ULPIN database synchronization completed successfully." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`BhoomiSetu API Server running on port ${PORT}`);
});
