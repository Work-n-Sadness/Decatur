
import {
  HeartPulse, // Used for Hypertension
  ClipboardList,
  Sparkles,
  ListChecks,
  CircleDot,
  Loader2,
  CheckCircle2,
  AlertTriangle, // Used for High Fall Risk
  ShieldX,
  type LucideIcon,
  GanttChartSquare,
  FilePieChart,
  Settings2,
  Repeat,
  CalendarClock,
  Pill, // Used for Controlled Meds
  FileHeart,
  ShieldCheck,
  Wind,
  ClipboardCheck,
  UsersRound,
  Clock,
  FileSearch,
  Activity,
  Eye,
  ShoppingCart,
  Archive,
  Stethoscope,
  NotebookPen,
  Flag,
  FileEdit,
  History,
  Flame,
  FlameKindling,
  Lightbulb,
  Siren,
  Map,
  Briefcase,
  PhoneCall,
  Thermometer,
  WashingMachine,
  Utensils, // Standard Lucide icon
  ChefHat,
  Bug,
  Shirt,
  Wrench,
  SearchCheck,
  DoorOpen,
  Cigarette,
  SmilePlus,
  Ban,
  Contact,
  FileText,
  TrendingUp,
  UserCheck, // Used for Residents Moving-in
  UserMinus, // Used for Residents Moving-out
  Users2,
  Presentation,
  UserPlus,
  ClipboardPen,
  Award,
  GraduationCap,
  HardHat,
  ShoppingBag,
  CreditCard,
  Landmark,
  DollarSign,
  FileDigit,
  LineChart,
  Building,
  Building2, // Added for FacilityCertsInstallationsGroup
  BadgeCheck,
  BookCopy,
  Gavel,
  AlertOctagon,
  ScrollText,
  ClipboardSignature,
  Settings,
  UserCog,
  DatabaseZap,
  Network,
  Users,
  LayoutGrid,
  SprayCan,
  Boxes,
  CalendarCheck,
  BookUser,
  Salad,
  Tag,
  ShieldAlert,
  ListTodo,
  Shield as ShieldIcon,
  Cpu as CpuIcon,
  HeartHandshake, // For Medical Needs & Care Tags group
  Tags, // For Special Care Tags
  Brain, // For Dementia care flag
  Droplets, // For Diabetes care flag
  FileLock, // For HIPAA Note Available care flag
  Accessibility,
  Package,
  FilePlus,
  BarChart,
} from 'lucide-react';
import type { TaskCategory, ResolutionStatus, TaskFrequency, FacilityInstallation, ResidentCareFlag, AuditToolCategory } from '@/types';

export const TaskCategoryIcons: Record<TaskCategory, LucideIcon> = {
  'Medication Management & ECP Audits': Pill,
  'Resident Documentation & Clinical Care': FileHeart,
  'Compliance & Survey Prep Tasks': ShieldCheck,
  'Smoking, Behavior, and Environment': Wind,
  'Facility Operations & Services': LayoutGrid,
};

export const AuditToolCategoryIcons: Record<AuditToolCategory, LucideIcon> = {
  'Health Protocols / Medications': Pill,
  'Food Safety': ChefHat,
  'Fire Safety': Flame,
  'Office Admin': Briefcase,
  'Documentation & Compliance': FileText,
  'Personnel File & Staff Training': UsersRound,
  'Postings & Required Notices': ScrollText,
  'Environmental & Sanitation Safety': Wind,
  'General ALR Compliance': ShieldCheck,
  'Resident Records Management': Users,
  'Resident Care Plans': FileText,
  'Resident Progress Notes': TrendingUp,
  'Resident Admissions & Discharges': UserCheck,
  'Case Management Coordination': Users2,
  'Medication Administration Record': Activity,
};


export const ResolutionStatusIcons: Record<ResolutionStatus, LucideIcon> = {
  Pending: CircleDot,
  Resolved: CheckCircle2,
  Escalated: AlertTriangle,
  Complete: CheckCircle2,
  Flagged: AlertTriangle,
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
  // NEW STRUCTURE
  Dashboard: LayoutGrid,
  ChecklistManager: ListTodo,
  ResidentRecords: Users,
  MedicationTracking: Pill,
  FacilityManagement: Building,
  ComplianceCenter: ShieldCheck,

  // Page-specific icons within the new structure
  Home: LayoutGrid, // For the main dashboard page
  Checklists: ListChecks, // For the checklist page
  FaceSheets: Contact,
  CarePlans: FileText,
  ProgressNotes: TrendingUp,
  MovingInOut: UserCheck,
  MAR: Activity,
  PRN: Eye,
  ControlledMeds: FileLock,
  MedRoomLog: DoorOpen,
  FacilityLogs: History,
  RoomInspections: SearchCheck,
  Maintenance: Wrench,
  SupplyInventory: Boxes,
  Certificates: Award,
  SurveyPacket: Package,
  AuditLogs: FileSearch,


  // OLD ICONS (some may be reused or can be cleaned up later)
  AuditTool: FileSearch,
  ComplianceSummary: ClipboardCheck,
  Reports: FilePieChart,
  SurveyReadiness: ClipboardList, 
  
  ResidentsGroup: Users,
  ProfilesFaceSheets: Contact,
  ResidentsMovingInOut: UserCheck, 
  CaseManagement: Users2,
  ResidentManagementForum: Presentation,
  
  MedicalNeedsCareTagsGroup: HeartHandshake,
  SpecialCareTags: Tags,

  MedicationECPGroup: Pill,
  MedOrders: Pill,
  MARLogs: Activity,
  PRNMonitoring: Eye,
  PharmacyOrders: ShoppingCart,
  DiscontinuedMeds: Archive,
  TreatmentHistory: Stethoscope,
  DoctorOrders: NotebookPen,

  ECPChartingGroup: FileEdit,
  FlaggedECPActions: Flag,
  MARCorrections: FileEdit,
  MissedDoses: History,

  EmergencyReadinessGroup: Flame,
  FireDrills: Flame,
  ExtinguisherChecks: FlameKindling,
  EmergencyLighting: Lightbulb,
  CNFAPosting: Siren,
  EvacuationPlans: Map,
  GoBagChecklist: Briefcase,
  NineOneOneLog: PhoneCall,

  FacilityOpsServicesGroup: LayoutGrid,
  GroceryFoodPurchases: ShoppingCart,
  CleaningSuppliesOrders: SprayCan,
  FoodDryGoodsInventory: Boxes,
  CleaningSuppliesInventory: Archive,
  MaintenanceRequestLog: Wrench,
  FacilityRepairHistory: History,
  PreventiveMaintenanceSchedule: CalendarCheck,
  VendorContactDirectory: BookUser,
  WeeklyMealSchedule: Utensils,
  MealPrepChecklist: ClipboardCheck,
  TherapeuticDietTracker: Salad,
  LeftoversLabelingLog: Tag,
  WeeklyShowerSinkTempLogs: Thermometer,
  DishwasherCycleTempRecord: WashingMachine,
  ScaldRiskAudit: ShieldAlert,

  EnvironmentalSafetyGroup: Wind,
  PestControl: Bug,
  OxygenHandling: Wind,
  PPEAudits: Shirt,
  MaintenanceRequests: Wrench,
  HazardChecks: SearchCheck,

  FoodNutritionGroup: ChefHat,
  TempLogs: Thermometer,
  DishwasherLogs: WashingMachine,
  WeeklyMenu: Utensils,
  GroceryInventory: ShoppingCart,
  FoodSafetyAudits: ChefHat,

  SecurityBehaviorGroup: ShieldCheck,
  EntryExitLogs: DoorOpen,
  SmokingCompliance: Cigarette,
  BehaviorReports: SmilePlus,
  VisitorLogNotifications: Users,

  RegulatoryOversightGroup: Gavel,
  FireDeptVisits: Building,
  StateSurveyVisits: BadgeCheck,
  RegulatoryVisitLogs: BookCopy,
  OmbudsmanReports: Gavel,
  IncidentGrievanceLogs: AlertOctagon,

  FacilityCertsInstallationsGroup: Building2,
  Certifications: ShieldIcon,
  InstallationsInfrastructure: CpuIcon,

  FinanceGroup: DollarSign,
  PurchaseRequests: ShoppingBag,
  FacilityExpenses: CreditCard,
  RentPayments: Landmark,
  MedicaidClaims: DollarSign,
  InsuranceClaims: FileDigit,
  InflowOutflowReports: LineChart,

  HumanResourcesGroup: Users,
  Recruitment: UserPlus,
  Onboarding: ClipboardPen,
  StaffMatrix: Users,
  TrainingCerts: UsersRound,
  PerformanceReviews: Award,
  ExitLogs: UserMinus,
  ContractorsConsultants: HardHat,

  PolicyComplianceGroup: ScrollText,
  PoliciesProcedures: ScrollText,
  HouseRules: ClipboardSignature,

  InsightsSystemsGroup: Settings,
  SystemLogs: DatabaseZap,
  ApiIntegrations: Network,
  UserManagement: UserCog,
  Settings: Settings,
};

export const getTaskCategoryIcon = (category: TaskCategory): LucideIcon => {
  return TaskCategoryIcons[category] || ListChecks;
};

export const getResolutionStatusIcon = (status: ResolutionStatus): JSX.Element => {
  const Icon = ResolutionStatusIcons[status] || CircleDot;
  let className = '';
  switch (status) {
    case 'Pending': className = 'text-yellow-500'; break;
    case 'Resolved': case 'Complete': className = 'text-green-500'; break;
    case 'Escalated': case 'Flagged': className = 'text-red-500'; break;
    default: className = 'text-gray-500'; break;
  }
  return <Icon className={`h-4 w-4 ${className}`} />;
};

export const getTaskFrequencyIcon = (frequency: TaskFrequency): LucideIcon => {
  return TaskFrequencyIcons[frequency] || Repeat;
};

export const getInstallationCategoryIcon = (category: FacilityInstallation['category']): LucideIcon => {
  const map: Record<FacilityInstallation['category'], LucideIcon> = {
    'Fire Safety': Flame,
    'HVAC': Wind,
    'Water Systems': WashingMachine,
    'Electrical': Lightbulb,
    'Accessibility': Accessibility,
    'Sanitation': SprayCan,
    'Gas Systems': FlameKindling,
    'Air Quality': Wind,
    'General Safety': ShieldCheck,
  };
  return map[category] || HardHat;
};

export const getCareFlagIcon = (flag: ResidentCareFlag): LucideIcon | null => {
  switch (flag) {
    case 'wheelchair': return Accessibility; // Using Accessibility as Wheelchair icon might not be available or correctly mapped
    case 'walker': return Accessibility; // Using Accessibility as a generic for walker too
    case 'dementia': return Brain;
    case 'controlled_meds': return Pill;
    case 'hypertension': return HeartPulse;
    case 'diabetes': return Droplets;
    case 'fall_risk_high': return AlertTriangle;
    case 'elopement_risk_yes': return AlertTriangle; // Using AlertTriangle for elopement risk
    default: return null; // Or a generic icon like Tag
  }
};
