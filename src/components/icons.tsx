import {
  HeartPulse,
  UtensilsCrossed,
  // Flame, // Replaced by Flame icon from lucide for fire drills
  // Briefcase, // Replaced by Briefcase icon from lucide for bag checklist
  // FileText, // Replaced by FileText icon from lucide
  // Users, // Replaced by Users icon from lucide
  ClipboardList,
  Sparkles,
  ListChecks,
  CircleDot, // Pending
  Loader2, 
  CheckCircle2, // Resolved
  AlertTriangle, // Escalated or Flagged ECP Actions
  ShieldX, 
  type LucideIcon,
  GanttChartSquare, // Dashboard
  FilePieChart, // Reports
  Settings2, 
  Repeat, // Frequency
  CalendarClock, // Frequency
  Pill, // Medication Management / Medication Orders
  FileHeart, // Resident Documentation & Clinical Care
  ShieldCheck, // Compliance & Survey Prep Tasks / Food Safety Audit
  Wind, // Environment / Smoking / Oxygen Handling
  ClipboardCheck, // Compliance Summary
  UsersRound, // Staff Training
  Clock, // Used for ClockWarning replacement
  FileSearch, // Audit Tool
  Activity, // MAR Logs
  Eye, // PRN Monitoring
  ShoppingCart, // Pharmacy Orders / Grocery Inventory
  Archive, // Discontinued Meds / Grocery Inventory
  Stethoscope, // Treatment History
  NotebookPen, // Doctor Orders (fallback for UserMd)
  Flag, // Flagged ECP Actions
  FileEdit, // MAR Corrections Log
  History, // Missed Dose Tracker (or CalendarX2)
  Flame, // Fire Drills / Fire Dept Visits
  FlameKindling, // Extinguisher Checks
  Lightbulb, // Emergency Lighting
  Siren, // CNFA Posting
  Map, // Evacuation Plans
  Briefcase, // Bag Checklist
  PhoneCall, // 911 Log
  Thermometer, // Food Temp Logs
  WashingMachine, // Dishwasher Logs
  Utensils, // Weekly Menu
  // Scroll, // Grocery Inventory - using Archive
  ChefHat, // Food Safety Audit
  Bug, // Pest Control
  // Wind, // Oxygen Handling - already there
  Shirt, // PPE Audit (fallback)
  Wrench, // Maintenance Requests
  SearchCheck, // Environmental Hazard Checks (fallback for TriangleAlert)
  DoorOpen, // Entry/Exit Logs
  Cigarette, // Smoking Compliance
  SmilePlus, // Behavior Reports
  // Users, // Visitor Restrictions - already there
  Ban, // Could be for restrictions too
  Contact, // Face Sheets
  FileText, // Care Plans / Doctor Orders
  TrendingUp, // Resident Progress Notes
  UserCheck, // Resident Check-in
  UserMinus, // Resident Exit / Exit Logs (HR)
  Users2, // Case Management Agencies
  Presentation, // Council Meetings
  UserPlus, // Recruitment (HR)
  ClipboardUser, // Onboarding (HR)
  // UserMinus, // Exit Logs (HR) - already there
  Award, // Performance Reviews (HR)
  GraduationCap, // Training & Certs (HR)
  HardHat, // Contractors & Consultants (HR)
  ShoppingBag, // Purchase Requests (Finance)
  CreditCard, // Facility Expenses (Finance)
  Landmark, // Rent Payments / House Rules
  DollarSign, // Medicaid Claims (Finance)
  FileDigit, // Insurance Claims (Finance)
  LineChart, // Inflow/Outflow Reports (Finance)
  Building, // Fire Dept Visits (Governance)
  BadgeCheck, // State Survey Visits (Governance)
  BookCopy, // Regulatory Visit Logs (Governance)
  Gavel, // Ombudsman Reports (Governance)
  AlertOctagon, // Incident & Grievance Logs (Governance)
  ScrollText, // Policies (Governance)
  ClipboardSignature, // House Rules (Governance)
  Settings, // Admin Settings (different from Settings2)
  UsersCog, // User Management (Admin)
  DatabaseZap, // System Logs (Admin)
  Network, // API Integrations (Admin)
  Users, // Staff Matrix / Visitor Restrictions (Security)
} from 'lucide-react';
import type { TaskCategory, ResolutionStatus, TaskFrequency } from '@/types';

export const TaskCategoryIcons: Record<TaskCategory, LucideIcon> = {
  'Medication Management & ECP Audits': Pill,
  'Resident Documentation & Clinical Care': FileHeart,
  'Compliance & Survey Prep Tasks': ShieldCheck,
  'Smoking, Behavior, and Environment': Wind,
};

export const ResolutionStatusIcons: Record<ResolutionStatus, LucideIcon> = {
  Pending: CircleDot,
  Resolved: CheckCircle2,
  Escalated: AlertTriangle,
};

export const TaskFrequencyIcons: Record<TaskFrequency, LucideIcon> = {
  Daily: Repeat,
  Weekly: CalendarClock, 
  Monthly: CalendarClock,
  Quarterly: CalendarClock,
  'Mid Yearly': CalendarClock,
  Annually: CalendarClock,
  'Bi-annually': CalendarClock,
  'As Needed': Sparkles,
};


export const SidebarIcons = {
  // Core Operations
  Dashboard: GanttChartSquare,
  AuditTool: FileSearch, 
  ComplianceSummary: ClipboardCheck,
  Reports: FilePieChart,
  SurveyReadiness: ClipboardList,

  // Medication & Clinical
  MedicationOrders: Pill,
  MARLogs: Activity,
  PRNMonitoring: Eye,
  PharmacyOrders: ShoppingCart,
  DiscontinuedMeds: Archive,
  TreatmentHistory: Stethoscope,
  DoctorOrders: NotebookPen,

  // ECP Charting
  FlaggedECPActions: Flag,
  MARCorrectionsLog: FileEdit,
  MissedDoseTracker: History,

  // Fire & Emergency Safety
  FireDrills: Flame,
  ExtinguisherChecks: FlameKindling,
  EmergencyLighting: Lightbulb,
  CNFAPosting: Siren,
  EvacuationPlans: Map,
  BagChecklist: Briefcase,
  NineOneOneLog: PhoneCall,

  // Food & Nutrition
  FoodTempLogs: Thermometer,
  DishwasherLogs: WashingMachine,
  WeeklyMenu: Utensils,
  GroceryInventory: Archive, // Reusing Archive
  FoodSafetyAudit: ChefHat,

  // Environmental
  PestControl: Bug,
  OxygenHandling: Wind,
  PPEAudit: Shirt,
  MaintenanceRequests: Wrench,
  EnvironmentalHazardChecks: SearchCheck,

  // Security & Behavior
  EntryExitLogs: DoorOpen,
  SmokingCompliance: Cigarette,
  BehaviorReports: SmilePlus,
  VisitorRestrictions: Ban, // Using Ban for restrictions

  // Resident Records
  FaceSheets: Contact,
  CarePlans: FileText,
  ResidentProgressNotes: TrendingUp,
  ResidentCheckInOut: UserCheck, // Combine, or could have two if distinct pages later
  CaseManagementAgencies: Users2,
  CouncilMeetings: Presentation,

  // Human Resources
  Recruitment: UserPlus,
  Onboarding: ClipboardUser,
  ExitLogs: UserMinus,
  PerformanceReviews: Award,
  StaffMatrix: Users, 
  TrainingCerts: UsersRound, // Was StaffTraining
  ContractorsConsultants: HardHat,

  // Finance
  PurchaseRequests: ShoppingBag,
  FacilityExpenses: CreditCard,
  RentPayments: Landmark,
  MedicaidClaims: DollarSign,
  InsuranceClaims: FileDigit,
  InflowOutflowReports: LineChart,

  // Governance & Regulatory
  FireDeptVisits: Building,
  StateSurveyVisits: BadgeCheck,
  RegulatoryVisitLogs: BookCopy,
  OmbudsmanReports: Gavel,
  IncidentGrievanceLogs: AlertOctagon,
  Policies: ScrollText,
  HouseRules: ClipboardSignature,

  // Admin
  Settings: Settings,
  UserManagement: UsersCog,
  SystemLogs: DatabaseZap,
  ApiIntegrations: Network,
};

export const getTaskCategoryIcon = (category: TaskCategory): LucideIcon => {
  return TaskCategoryIcons[category] || ListChecks; // Fallback icon
};

export const getResolutionStatusIcon = (status: ResolutionStatus): JSX.Element => {
  const Icon = ResolutionStatusIcons[status] || CircleDot; // Fallback icon
  return <Icon />;
};

export const getTaskFrequencyIcon = (frequency: TaskFrequency): LucideIcon => {
  return TaskFrequencyIcons[frequency] || Repeat;
};
