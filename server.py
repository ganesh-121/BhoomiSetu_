import http.server
import socketserver
import json
import urllib.parse
import os
import random
from datetime import datetime

PORT = 8000

# Sample Parcels Data Store
PARCELS = [
  {
    "ulpin": "IN-MH-411001-P1001",
    "surveyNo": "142/A/1",
    "village": "Baner",
    "taluka": "Haveli",
    "district": "Pune",
    "state": "Maharashtra",
    "areaSqM": 1250.50,
    "areaAcres": 0.309,
    "pincode": "411045",
    "status": "Verified",
    "coordinates": [
      [18.5585, 73.7890],
      [18.5592, 73.7895],
      [18.5588, 73.7905],
      [18.5581, 73.7900],
      [18.5585, 73.7890]
    ],
    "center": [18.55865, 73.78975],
    "owner": {
      "name": "Rajesh Vasantrao Patil",
      "fatherName": "Vasantrao Patil",
      "khataNo": "KHT-8842",
      "sharePercentage": 100,
      "jointOwners": [],
      "address": "Flat 402, Green Acres, Baner, Pune",
      "aadhaarMasked": "XXXX-XXXX-9482",
      "panMasked": "ABPPP****K"
    },
    "registration": {
      "deedNo": "PN-HAV-2021-49201",
      "deedType": "Sale Deed",
      "registrationDate": "2021-11-14",
      "subRegistrarOffice": "Haveli No. 3, Pune",
      "declaredValueINR": 18500000,
      "stampDutyPaidINR": 1110000,
      "status": "Registered & Verified"
    },
    "encumbrance": {
      "status": "Clear",
      "mortgageActive": False,
      "bankName": "None",
      "mortgageAmountINR": 0,
      "pendingLitigation": False,
      "courtCaseNo": None,
      "nocIssued": True
    },
    "tax": {
      "assessmentNo": "PMC-TAX-2024-99120",
      "annualTaxINR": 42500,
      "duesRemainingINR": 0,
      "status": "Paid",
      "lastPaymentDate": "2024-04-10",
      "receiptNo": "REC-8849120"
    },
    "landUse": {
      "zone": "Residential (R-1)",
      "masterPlan": "PMC Master Plan 2038",
      "permissibleFSI": 2.1,
      "category": "Urban Residential"
    },
    "buildingPermission": {
      "permissionNo": "PMC-BP-2022-04812",
      "status": "Approved",
      "approvedFSI": 1.95,
      "sanctionedFloors": "G + 4",
      "completionCertificateIssued": True
    },
    "restrictions": {
      "crzZone": "Non-CRZ",
      "highwayBufferMeters": 15,
      "heritageBuffer": False,
      "forestLand": False,
      "status": "No Active Restrictions"
    },
    "utilities": {
      "waterConnectionId": "PMC-WTR-49102",
      "powerConsumerNo": "MSEDCL-849201",
      "sewageAccess": "Connected",
      "roadWidthMeters": 18
    }
  },
  {
    "ulpin": "IN-MH-411001-P1002",
    "surveyNo": "88/2/B",
    "village": "Aundh",
    "taluka": "Haveli",
    "district": "Pune",
    "state": "Maharashtra",
    "areaSqM": 3400.00,
    "areaAcres": 0.840,
    "pincode": "411007",
    "status": "Issue Found",
    "coordinates": [
      [18.5610, 73.8050],
      [18.5622, 73.8062],
      [18.5615, 73.8075],
      [18.5602, 73.8060],
      [18.5610, 73.8050]
    ],
    "center": [18.5612, 73.8061],
    "owner": {
      "name": "Sunita Suresh Deshmukh",
      "fatherName": "Rameshchandra Kulkarni",
      "khataNo": "KHT-4912",
      "sharePercentage": 60,
      "jointOwners": ["Milind Suresh Deshmukh (40%)"],
      "address": "Lane 5, Aundh, Pune",
      "aadhaarMasked": "XXXX-XXXX-1294",
      "panMasked": "BCDPD****M"
    },
    "registration": {
      "deedNo": "PN-HAV-2018-12049",
      "deedType": "Gift Deed",
      "registrationDate": "2018-06-22",
      "subRegistrarOffice": "Haveli No. 1, Pune",
      "declaredValueINR": 32000000,
      "stampDutyPaidINR": 1920000,
      "status": "Registered"
    },
    "encumbrance": {
      "status": "Active Mortgage & Dispute Flag",
      "mortgageActive": True,
      "bankName": "State Bank of India (Aundh Br)",
      "mortgageAmountINR": 15000000,
      "pendingLitigation": True,
      "courtCaseNo": "CIV-SUIT-2023-8841",
      "nocIssued": False
    },
    "tax": {
      "assessmentNo": "PMC-TAX-2024-10492",
      "annualTaxINR": 115000,
      "duesRemainingINR": 230000,
      "status": "Unpaid Dues",
      "lastPaymentDate": "2022-03-15",
      "receiptNo": "REC-4819201"
    },
    "landUse": {
      "zone": "Commercial (C-2)",
      "masterPlan": "PMC Master Plan 2038",
      "permissibleFSI": 2.5,
      "category": "Commercial Mixed Use"
    },
    "buildingPermission": {
      "permissionNo": "PMC-BP-2023-99120",
      "status": "Violation Found",
      "approvedFSI": 2.5,
      "sanctionedFloors": "G + 6",
      "completionCertificateIssued": False
    },
    "restrictions": {
      "crzZone": "Non-CRZ",
      "highwayBufferMeters": 0,
      "heritageBuffer": False,
      "forestLand": False,
      "status": "Litigation Encroachment Flag"
    },
    "utilities": {
      "waterConnectionId": "PMC-WTR-11920",
      "powerConsumerNo": "MSEDCL-481029",
      "sewageAccess": "Pending Clearance",
      "roadWidthMeters": 24
    }
  },
  {
    "ulpin": "IN-MH-411001-P1003",
    "surveyNo": "204/1",
    "village": "Wakad",
    "taluka": "Mulshi",
    "district": "Pune",
    "state": "Maharashtra",
    "areaSqM": 850.00,
    "areaAcres": 0.210,
    "pincode": "411057",
    "status": "Verified",
    "coordinates": [
      [18.5980, 73.7620],
      [18.5986, 73.7625],
      [18.5983, 73.7634],
      [18.5976, 73.7629],
      [18.5980, 73.7620]
    ],
    "center": [18.5981, 73.7627],
    "owner": {
      "name": "Anil Prakash Kulkarni",
      "fatherName": "Prakash Kulkarni",
      "khataNo": "KHT-7712",
      "sharePercentage": 100,
      "jointOwners": [],
      "address": "Datta Mandir Road, Wakad, Pune",
      "aadhaarMasked": "XXXX-XXXX-4410",
      "panMasked": "CJKPK****L"
    },
    "registration": {
      "deedNo": "PN-MUL-2022-88192",
      "deedType": "Sale Deed",
      "registrationDate": "2022-09-05",
      "subRegistrarOffice": "Mulshi No. 2",
      "declaredValueINR": 9500000,
      "stampDutyPaidINR": 570000,
      "status": "Registered & Verified"
    },
    "encumbrance": {
      "status": "Clear",
      "mortgageActive": False,
      "bankName": "None",
      "mortgageAmountINR": 0,
      "pendingLitigation": False,
      "courtCaseNo": None,
      "nocIssued": True
    },
    "tax": {
      "assessmentNo": "PCMC-TAX-2024-33102",
      "annualTaxINR": 28000,
      "duesRemainingINR": 0,
      "status": "Paid",
      "lastPaymentDate": "2024-05-18",
      "receiptNo": "REC-773102"
    },
    "landUse": {
      "zone": "Residential (R-1)",
      "masterPlan": "PCMC Development Plan",
      "permissibleFSI": 1.8,
      "category": "High Density Residential"
    },
    "buildingPermission": {
      "permissionNo": "PCMC-BP-2023-11029",
      "status": "Approved",
      "approvedFSI": 1.75,
      "sanctionedFloors": "G + 3",
      "completionCertificateIssued": True
    },
    "restrictions": {
      "crzZone": "Non-CRZ",
      "highwayBufferMeters": 30,
      "heritageBuffer": False,
      "forestLand": False,
      "status": "Clear"
    },
    "utilities": {
      "waterConnectionId": "PCMC-WTR-88129",
      "powerConsumerNo": "MSEDCL-993012",
      "sewageAccess": "Connected",
      "roadWidthMeters": 15
    }
  },
  {
    "ulpin": "IN-MH-411001-P1004",
    "surveyNo": "52/A",
    "village": "Hinjawadi",
    "taluka": "Mulshi",
    "district": "Pune",
    "state": "Maharashtra",
    "areaSqM": 6200.00,
    "areaAcres": 1.532,
    "pincode": "411057",
    "status": "Pending Clearance",
    "coordinates": [
      [18.5910, 73.7380],
      [18.5925, 73.7395],
      [18.5918, 73.7410],
      [18.5902, 73.7396],
      [18.5910, 73.7380]
    ],
    "center": [18.5913, 73.7395],
    "owner": {
      "name": "Apex Tech Infra Solutions Pvt Ltd",
      "fatherName": "N/A (Corporate Entity)",
      "khataNo": "KHT-9901",
      "sharePercentage": 100,
      "jointOwners": [],
      "address": "Phase 1, Hinjawadi Rajiv Gandhi IT Park, Pune",
      "aadhaarMasked": "N/A (CIN: U72200PN2015PTC159012)",
      "panMasked": "AAACA****G"
    },
    "registration": {
      "deedNo": "PN-MUL-2020-00412",
      "deedType": "Lease Deed",
      "registrationDate": "2020-02-11",
      "subRegistrarOffice": "Mulshi No. 1",
      "declaredValueINR": 145000000,
      "stampDutyPaidINR": 8700000,
      "status": "Under MIDC Verification"
    },
    "encumbrance": {
      "status": "Bank Charge Registered",
      "mortgageActive": True,
      "bankName": "HDFC Bank Ltd",
      "mortgageAmountINR": 85000000,
      "pendingLitigation": False,
      "courtCaseNo": None,
      "nocIssued": True
    },
    "tax": {
      "assessmentNo": "MIDC-TAX-2024-88410",
      "annualTaxINR": 480000,
      "duesRemainingINR": 0,
      "status": "Paid",
      "lastPaymentDate": "2024-06-01",
      "receiptNo": "REC-990124"
    },
    "landUse": {
      "zone": "Industrial / IT Park (I-2)",
      "masterPlan": "MIDC Master Plan",
      "permissibleFSI": 3.5,
      "category": "Information Technology Zone"
    },
    "buildingPermission": {
      "permissionNo": "MIDC-BP-2021-00812",
      "status": "Approved",
      "approvedFSI": 3.2,
      "sanctionedFloors": "2B + G + 11",
      "completionCertificateIssued": False
    },
    "restrictions": {
      "crzZone": "Non-CRZ",
      "highwayBufferMeters": 20,
      "heritageBuffer": False,
      "forestLand": False,
      "status": "High Tension Corridor Buffer (10m)"
    },
    "utilities": {
      "waterConnectionId": "MIDC-WTR-00491",
      "powerConsumerNo": "MSEDCL-HT-44812",
      "sewageAccess": "Connected (STP Required)",
      "roadWidthMeters": 30
    }
  }
]

SERVICE_REQUESTS = [
  {
    "id": "REQ-2024-8801",
    "ulpin": "IN-MH-411001-P1001",
    "applicantName": "Rajesh Vasantrao Patil",
    "applicantPhone": "+91 98230 49102",
    "requestType": "Ownership Mutation Record Request",
    "description": "Requesting certified copy of updated 7/12 RoR record post-sale deed execution.",
    "status": "Completed",
    "submittedDate": "2024-08-15",
    "updatedDate": "2024-08-18",
    "officerRemarks": "Approved by Haveli Circle Officer. Digital copy issued.",
    "department": "Land Records Department"
  },
  {
    "id": "REQ-2024-9104",
    "ulpin": "IN-MH-411001-P1002",
    "applicantName": "Sunita Suresh Deshmukh",
    "applicantPhone": "+91 94220 11920",
    "requestType": "Property Tax Dues Re-assessment",
    "description": "Requesting correction of uncredited tax payment receipt dated March 2022.",
    "status": "Under Review",
    "submittedDate": "2024-08-28",
    "updatedDate": "2024-08-30",
    "officerRemarks": "Bank scroll reconciliation pending with Municipal Treasury.",
    "department": "Property Tax Department"
  }
]

AUDIT_LOGS = [
  { "id": "LOG-1001", "timestamp": "2026-09-02 05:30:12", "userRole": "Citizen", "action": "Property Verification Query", "resource": "ULPIN: IN-MH-411001-P1001", "result": "Success" },
  { "id": "LOG-1002", "timestamp": "2026-09-02 05:15:44", "userRole": "Government Officer", "action": "Service Request Status Update", "resource": "REQ-2024-9104", "result": "Success" },
  { "id": "LOG-1003", "timestamp": "2026-09-02 04:45:00", "userRole": "Administrator", "action": "Department API Sync Ping", "resource": "Sub-Registrar Gateway", "result": "200 OK (42ms)" }
]

INTEGRATIONS = [
  { "name": "Land Records (RoR / 7-12)", "status": "Active", "latency": "38ms", "syncSuccessRate": "99.8%", "lastSync": "Just now", "protocol": "REST / PostGIS" },
  { "name": "Sub-Registrar (Registration & Deeds)", "status": "Active", "latency": "52ms", "syncSuccessRate": "99.4%", "lastSync": "2 mins ago", "protocol": "SOAP / REST API" },
  { "name": "Municipal Property Tax Engine", "status": "Active", "latency": "45ms", "syncSuccessRate": "98.9%", "lastSync": "5 mins ago", "protocol": "REST / JSON" },
  { "name": "Urban Development & Zoning Gateway", "status": "Active", "latency": "60ms", "syncSuccessRate": "99.1%", "lastSync": "1 min ago", "protocol": "OGC WFS Layer" },
  { "name": "State Utility Grid & Infrastructure", "status": "Active", "latency": "41ms", "syncSuccessRate": "97.5%", "lastSync": "8 mins ago", "protocol": "REST / Microservice" },
  { "name": "State Pollution & Forest Board", "status": "Active", "latency": "74ms", "syncSuccessRate": "99.0%", "lastSync": "12 mins ago", "protocol": "Spatial REST API" }
]

class BhoomiSetuHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path.startswith('/api/'):
            self.handle_api_get(path, parsed_url.query)
        else:
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        try:
            body = json.loads(post_data) if post_data else {}
        except:
            body = {}

        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == '/api/verification/check':
            ulpin = body.get('ulpin', '').upper()
            parcel = next((p for p in PARCELS if p['ulpin'].upper() == ulpin), None)
            if not parcel:
                self.send_json({"error": "Parcel not found"}, 404)
                return

            checks = [
                { "id": "CHK_ROR", "name": "Record of Rights (RoR 7/12) Ownership", "status": "Verified" if parcel['owner']['name'] else "Issue Found", "details": f"Owner: {parcel['owner']['name']} (Khata: {parcel['owner']['khataNo']})" },
                { "id": "CHK_REG", "name": "Sub-Registrar Title Registration & Deed", "status": "Verified" if "Verified" in parcel['registration']['status'] else "Pending", "details": f"Deed: {parcel['registration']['deedNo']} ({parcel['registration']['deedType']})" },
                { "id": "CHK_ENC", "name": "Encumbrance & Mortgage Status", "status": "Verified" if parcel['encumbrance']['status'] == "Clear" else "Issue Found", "details": parcel['encumbrance']['status'] },
                { "id": "CHK_TAX", "name": "Municipal Property Tax Dues", "status": "Verified" if parcel['tax']['status'] == "Paid" else "Issue Found", "details": f"Tax Status: {parcel['tax']['status']} (Dues: ₹{parcel['tax']['duesRemainingINR']})" },
                { "id": "CHK_ZON", "name": "Master Plan Land Use & Zoning", "status": "Verified", "details": f"Zone: {parcel['landUse']['zone']} (FSI: {parcel['landUse']['permissibleFSI']})" },
                { "id": "CHK_BLD", "name": "Building Permission & Sanction Plan", "status": "Verified" if parcel['buildingPermission']['status'] == "Approved" else "Issue Found", "details": f"Status: {parcel['buildingPermission']['status']}" },
                { "id": "CHK_RST", "name": "Environmental & Legal Restrictions", "status": "Verified" if "No Active" in parcel['restrictions']['status'] or parcel['restrictions']['status'] == "Clear" else "Issue Found", "details": parcel['restrictions']['status'] }
            ]

            issues = [c for c in checks if c['status'] == 'Issue Found']
            overall = "Verified" if len(issues) == 0 else "Issue Found"
            risk = "A+ (Clear Title)" if overall == "Verified" else "C / F (High Risk - Due Diligence Advised)"

            report = {
                "reportId": f"RPT-VER-{random.randint(100000, 999999)}",
                "generatedAt": datetime.now().isoformat(),
                "ulpin": parcel['ulpin'],
                "surveyNo": parcel['surveyNo'],
                "village": parcel['village'],
                "district": parcel['district'],
                "ownerName": parcel['owner']['name'],
                "overallStatus": overall,
                "riskScore": risk,
                "checks": checks,
                "legalDisclaimer": "This property verification report is compiled automatically from available mock integrated departmental APIs via ULPIN for SIH PS 26014."
            }
            self.send_json(report)

        elif path == '/api/service-requests':
            new_req = {
                "id": f"REQ-2024-{random.randint(1000, 9999)}",
                "ulpin": body.get("ulpin", "IN-MH-411001-P1001"),
                "applicantName": body.get("applicantName", "Citizen"),
                "applicantPhone": body.get("applicantPhone", "+91 98000 00000"),
                "requestType": body.get("requestType", "Ownership Mutation Record Request"),
                "description": body.get("description", "Standard inquiry"),
                "status": "Submitted",
                "submittedDate": datetime.now().strftime("%Y-%m-%d"),
                "updatedDate": datetime.now().strftime("%Y-%m-%d"),
                "officerRemarks": "Application received and queued.",
                "department": body.get("department", "Land Records Department")
            }
            SERVICE_REQUESTS.insert(0, new_req)
            self.send_json(new_req, 201)

        elif path == '/api/admin/datasets/sync':
            self.send_json({"message": "Inter-departmental ULPIN synchronization complete."})

    def handle_api_get(self, path, query_string):
        if path == '/api/parcels':
            self.send_json({"parcels": PARCELS, "total": len(PARCELS)})
        elif path.startswith('/api/parcels/'):
            ulpin = path.split('/')[3].upper()
            parcel = next((p for p in PARCELS if p['ulpin'].upper() == ulpin), None)
            if parcel:
                self.send_json(parcel)
            else:
                self.send_json({"error": "Parcel not found"}, 404)
        elif path == '/api/service-requests':
            self.send_json(SERVICE_REQUESTS)
        elif path == '/api/admin/integrations':
            self.send_json({"activeIntegrations": INTEGRATIONS})
        elif path == '/api/admin/audit-logs':
            self.send_json(AUDIT_LOGS)
        else:
            self.send_json({"error": "Unknown API endpoint"}, 404)

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        response_bytes = json.dumps(data).encode('utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), BhoomiSetuHandler) as httpd:
        print(f"BhoomiSetu Python REST API & Web Server running at http://localhost:{PORT}")
        httpd.serve_forever()
