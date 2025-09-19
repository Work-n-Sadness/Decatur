import {
  HeartPulse,
  ClipboardList,
  Sparkles,
  ListChecks,
  CircleDot,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldX,
  type LucideIcon,
  GanttChartSquare,
  FilePieChart,
  Settings2,
  Repeat,
  CalendarClock,
  Pill,
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
  Utensils,
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
  UserCheck,
  UserMinus,
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
  Building2,
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
  HeartHandshake,
  Tags,
  Brain,
  Droplets,
  FileLock,
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
  Dashboard: GanttChartSquare,
  AuditTool: FileSearch,
  ComplianceSummary: ClipboardCheck,
  Checklists: ListChecks,
  Reports: FilePieChart,
  SurveyReadiness: ClipboardList, 
  History: History,
  
  Users: Users,
  ProfilesFaceSheets: Contact,
  ResidentsMovingInOut: UserCheck, 
  CaseManagement: Users2,
  ResidentManagementForum: Presentation,
  NotebookPen: NotebookPen,
  TrendingUp: TrendingUp,

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
  Building: Building,
  Wrench: Wrench,
  Archive: Archive,
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
    case 'wheelchair': return Accessibility;
    case 'walker': return Accessibility;
    case 'dementia': return Brain;
    case 'controlled_meds': return FileLock;
    case 'hypertension': return HeartPulse;
    case 'diabetes': return Droplets;
    case 'fall_risk_high': return AlertTriangle;
    case 'elopement_risk_yes': return AlertTriangle;
    default: return null;
  }
};
