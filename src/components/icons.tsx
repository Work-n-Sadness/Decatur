
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
  History, // Missed Dose Tracker (or CalendarX2) / Facility Repair History
  Flame, // Fire Drills / Fire Dept Visits
  FlameKindling, // Extinguisher Checks
  Lightbulb, // Emergency Lighting
  Siren, // CNFA Posting
  Map, // Evacuation Plans
  Briefcase, // Bag Checklist
  PhoneCall, // 911 Log
  Thermometer, // Food Temp Logs / Weekly Shower & Sink Temp Logs
  WashingMachine, // Dishwasher Logs / Dishwasher Cycle Temp Record
  Utensils, // Weekly Menu / Weekly Meal Schedule
  // Scroll, // Grocery Inventory - using Archive
  ChefHat, // Food Safety Audit
  Bug, // Pest Control
  // Wind, // Oxygen Handling - already there
  Shirt, // PPE Audit (fallback)
  Wrench, // Maintenance Requests / Maintenance Request Log
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
  ClipboardPen, // Onboarding (HR) - Replaced ClipboardUser
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
  UserCog, // User Management (Admin)
  DatabaseZap, // SystemLogs (Admin)
  Network, // API Integrations (Admin)
  Users, // Staff Matrix / Visitor Restrictions (Security) / Vendor Directory
  LayoutGrid, // Facility Operations
  SprayCan, // Cleaning Supplies Orders
  Boxes, // Cleaning Supplies Inventory
  CalendarCheck, // Preventive Maintenance Schedule
  BookUser, // Vendor Contact Directory (Alternative if Users is too generic)
  Salad, // Therapeutic Diet Tracker
  Tag, // Leftovers & Labeling Log
  ShieldAlert, // Scald Risk Audit
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
  // OPERATIONS
  Dashboard: GanttChartSquare,
  AuditTool: FileSearch, 
  ComplianceSummary: ClipboardCheck,
  SurveyReadiness: ClipboardList,

  // RESIDENTS
  ProfilesFaceSheets: Contact,
  CarePlans: FileText,
  ProgressNotes: TrendingUp,
  CheckInOutLogs: UserCheck,
  CaseManagement: Users2,
  CouncilMeetings: Presentation,

  // MEDICATION & ECP
  MedOrders: Pill,
  MARLogs: Activity,
  PRNMonitoring: Eye,
  PharmacyOrders: ShoppingCart,
  DiscontinuedMeds: Archive,
  TreatmentHistory: Stethoscope,
  DoctorOrders: NotebookPen,
  FlaggedECPActions: Flag,
  MARCorrections: FileEdit,
  MissedDoses: History,

  // EMERGENCY READINESS
  FireDrills: Flame,
  ExtinguisherChecks: FlameKindling,
  EmergencyLighting: Lightbulb,
  CNFAPosting: Siren,
  EvacuationPlans: Map,
  GoBagChecklist: Briefcase,
  NineOneOneLog: PhoneCall,

  // ENVIRONMENTAL SAFETY
  PestControl: Bug,
  OxygenHandling: Wind,
  PPEAudits: Shirt,
  MaintenanceRequests: Wrench,
  HazardChecks: SearchCheck,

  // FOOD & NUTRITION
  TempLogs: Thermometer,
  DishwasherLogs: WashingMachine,
  WeeklyMenu: Utensils,
  GroceryInventory: Archive, 
  FoodSafetyAudits: ChefHat,

  // SECURITY & BEHAVIOR
  EntryExitLogs: DoorOpen,
  SmokingCompliance: Cigarette,
  BehaviorReports: SmilePlus,
  VisitorRestrictions: Ban, 

  // REGULATORY OVERSIGHT
  FireDeptVisits: Building,
  StateSurveyVisits: BadgeCheck,
  RegulatoryVisitLogs: BookCopy,
  OmbudsmanReports: Gavel,
  IncidentGrievanceLogs: AlertOctagon,
  
  // FINANCE
  PurchaseRequests: ShoppingBag,
  FacilityExpenses: CreditCard,
  RentPayments: Landmark,
  MedicaidClaims: DollarSign,
  InsuranceClaims: FileDigit,
  InflowOutflowReports: LineChart,

  // HUMAN RESOURCES
  Recruitment: UserPlus,
  Onboarding: ClipboardPen, 
  StaffMatrix: Users, 
  TrainingCerts: UsersRound, 
  PerformanceReviews: Award,
  ExitLogs: UserMinus,
  ContractorsConsultants: HardHat,

  // POLICY & COMPLIANCE
  PoliciesProcedures: ScrollText,
  HouseRules: ClipboardSignature,

  // FACILITY OPERATIONS & SERVICES
  FacilityOperations: LayoutGrid, // Main group icon (if needed for header, not used in items)
  GroceryFoodPurchases: ShoppingCart,
  CleaningSuppliesOrders: SprayCan,
  FoodDryGoodsInventory: Archive,
  CleaningSuppliesInventory: Boxes,
  MaintenanceRequestLog: Wrench,
  FacilityRepairHistory: History,
  PreventiveMaintenanceSchedule: CalendarCheck,
  VendorContactDirectory: BookUser, // Using BookUser over Users to be more specific
  WeeklyMealSchedule: Utensils,
  MealPrepChecklist: ClipboardCheck,
  TherapeuticDietTracker: Salad,
  LeftoversLabelingLog: Tag,
  WeeklyShowerSinkTempLogs: Thermometer,
  DishwasherCycleTempRecord: WashingMachine,
  ScaldRiskAudit: ShieldAlert,


  // INSIGHTS & SYSTEMS
  Reports: FilePieChart,
  SystemLogs: DatabaseZap,
  ApiIntegrations: Network,
  UserManagement: UserCog,
  Settings: Settings,
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

    
