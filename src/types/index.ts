export type UserRole = 'Citizen' | 'Officer' | 'Admin';

export interface Owner {
  name: string;
  fatherName: string;
  khataNo: string;
  sharePercentage: number;
  jointOwners: string[];
  address: string;
  aadhaarMasked: string;
  panMasked: string;
}

export interface Registration {
  deedNo: string;
  deedType: string;
  registrationDate: string;
  subRegistrarOffice: string;
  declaredValueINR: number;
  stampDutyPaidINR: number;
  status: string;
}

export interface Encumbrance {
  status: string;
  mortgageActive: boolean;
  bankName: string;
  mortgageAmountINR: number;
  pendingLitigation: boolean;
  courtCaseNo: string | null;
  nocIssued: boolean;
}

export interface PropertyTax {
  assessmentNo: string;
  annualTaxINR: number;
  duesRemainingINR: number;
  status: string;
  lastPaymentDate: string;
  receiptNo: string;
}

export interface LandUse {
  zone: string;
  masterPlan: string;
  permissibleFSI: number;
  category: string;
}

export interface BuildingPermission {
  permissionNo: string;
  status: string;
  approvedFSI: number;
  sanctionedFloors: string;
  completionCertificateIssued: boolean;
}

export interface Restrictions {
  crzZone: string;
  highwayBufferMeters: number;
  heritageBuffer: boolean;
  forestLand: boolean;
  status: string;
}

export interface Utilities {
  waterConnectionId: string;
  powerConsumerNo: string;
  sewageAccess: string;
  roadWidthMeters: number;
}

export interface Parcel {
  ulpin: string;
  surveyNo: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  areaSqM: number;
  areaAcres: number;
  pincode: string;
  status: 'Verified' | 'Pending Clearance' | 'Issue Found';
  coordinates: [number, number][];
  center: [number, number];
  owner: Owner;
  registration: Registration;
  encumbrance: Encumbrance;
  tax: PropertyTax;
  landUse: LandUse;
  buildingPermission: BuildingPermission;
  restrictions: Restrictions;
  utilities: Utilities;
}

export interface VerificationCheck {
  id: string;
  name: string;
  status: 'Verified' | 'Pending' | 'Issue Found';
  details: string;
}

export interface VerificationReport {
  reportId: string;
  generatedAt: string;
  ulpin: string;
  surveyNo: string;
  village: string;
  district: string;
  ownerName: string;
  overallStatus: 'Verified' | 'Pending Clearance' | 'Issue Found';
  riskScore: string;
  checks: VerificationCheck[];
  legalDisclaimer: string;
}

export interface ServiceRequest {
  id: string;
  ulpin: string;
  applicantName: string;
  applicantPhone: string;
  requestType: string;
  description: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  submittedDate: string;
  updatedDate: string;
  officerRemarks: string;
  department: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: UserRole;
  action: string;
  resource: string;
  result: string;
}

export interface DepartmentIntegration {
  name: string;
  status: string;
  latency: string;
  syncSuccessRate: string;
  lastSync: string;
  protocol: string;
}
