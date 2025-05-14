
import {
  HeartPulse, // Used for Hypertension
  ClipboardList,
  Sparkles,
  ListChecks,
  CircleDot,
  Loader2,
  CheckCircle2,
  AlertTriangle, // Used for High Fall Risk
  type LucideIcon,
  GanttChartSquare,
  FilePieChart,
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
  Utensils,
  ChefHat,
  Bug,
  Shirt,
  Wrench,
  SearchCheck,
  DoorOpen,
  Cigarette,
  SmilePlus,
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
  Tags, // For Special Care Tags item
  Brain, // For Dementia care flag
  Droplets, // For Diabetes care flag
  FileLock, // For HIPAA Note Available care flag
  Accessibility
} from 'lucide-react';
import type { TaskCategory, ResolutionStatus, TaskFrequency, FacilityInstallation, ResidentCareFlag } from '@/types';

export const TaskCategoryIcons: Record<TaskCategory, LucideIcon> = {
  'Medication Management & ECP Audits': Pill,
  'Resident Documentation & Clinical Care': FileHeart,
  'Compliance & Survey Prep Tasks': ShieldCheck,
  'Smoking, Behavior, and Environment': Wind,
  'Facility Operations & Services': LayoutGrid,
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
  // OPERATIONS
  Dashboard: GanttChartSquare,
  AuditTool: FileSearch,
  ComplianceSummary: ClipboardCheck,
  Reports: FilePieChart,
  SurveyReadiness: ClipboardList,
  Checklists: ListTodo,

  // RESIDENTS
  ProfilesFaceSheets: Contact,
  CarePlans: FileText,
  ProgressNotes: TrendingUp,
  ResidentsMovingInOut: UserCheck,
  CaseManagement: Users2,
  ResidentManagementForum: Presentation,

  // MEDICAL NEEDS & CARE TAGS
  MedicalNeedsCareTagsGroup: HeartHandshake,
  SpecialCareTags: Tags,

  // MEDICATION & ECP
  MedOrders: Pill,
  MARLogs: Activity,
  PRNMonitoring: Eye,
  PharmacyOrders: ShoppingCart,
  DiscontinuedMeds: Archive,
  TreatmentHistory: Stethoscope,
  DoctorOrders: NotebookPen,

  // ECP CHARTING
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

  // FACILITY OPERATIONS & SERVICES
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

  // ENVIRONMENTAL SAFETY
  EnvironmentalSafetyGroup: Wind,
  PestControl: Bug,
  OxygenHandling: Wind,
  PPEAudits: Shirt,
  MaintenanceRequests: Wrench,
  HazardChecks: SearchCheck,

  // FOOD & NUTRITION
  FoodNutritionGroup: ChefHat,
  TempLogs: Thermometer,
  DishwasherLogs: WashingMachine,
  WeeklyMenu: Utensils,
  // GroceryInventory icon is ShoppingCart, covered under Facility Ops
  FoodSafetyAudits: ChefHat,

  // SECURITY & BEHAVIOR
  SecurityBehaviorGroup: ShieldCheck,
  EntryExitLogs: DoorOpen,
  SmokingCompliance: Cigarette,
  BehaviorReports: SmilePlus,
  VisitorLogNotifications: Users, // Replaced UsersThree

  // REGULATORY OVERSIGHT
  RegulatoryOversightGroup: Gavel,
  FireDeptVisits: Building,
  StateSurveyVisits: BadgeCheck,
  RegulatoryVisitLogs: BookCopy,
  OmbudsmanReports: Gavel,
  IncidentGrievanceLogs: AlertOctagon,

  // FACILITY CERTIFICATIONS & INSTALLATIONS
  FacilityCertsInstallationsGroup: Building2,
  Certifications: ShieldIcon, // Alias for Shield
  InstallationsInfrastructure: CpuIcon, // Alias for Cpu

  // FINANCE
  FinanceGroup: DollarSign,
  PurchaseRequests: ShoppingBag,
  FacilityExpenses: CreditCard,
  RentPayments: Landmark,
  MedicaidClaims: DollarSign,
  InsuranceClaims: FileDigit,
  InflowOutflowReports: LineChart,

  // HUMAN RESOURCES
  HumanResourcesGroup: Users,
  Recruitment: UserPlus,
  Onboarding: ClipboardPen, // Replaced ClipboardUser
  StaffMatrix: Users,
  TrainingCerts: UsersRound,
  PerformanceReviews: Award,
  ExitLogs: UserMinus,
  ContractorsConsultants: HardHat,

  // POLICY & COMPLIANCE
  PolicyComplianceGroup: ScrollText,
  PoliciesProcedures: ScrollText,
  HouseRules: ClipboardSignature,

  // INSIGHTS & SYSTEMS
  InsightsSystemsGroup: Settings,
  SystemLogs: DatabaseZap,
  ApiIntegrations: Network,
  UserManagement: UserCog, // Replaced UsersCog
  Settings: Settings, // For the actual settings item
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
  return <Icon className={className} />;
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
    'Accessibility': Users,
    'Sanitation': SprayCan,
    'Gas Systems': FlameKindling,
    'Air Quality': Wind,
    'General Safety': ShieldCheck,
  };
  return map[category] || HardHat;
};

export const getCareFlagIcon = (flag: ResidentCareFlag): LucideIcon | null => {
  switch (flag) {
    case 'wheelchair': return Accessibility; // Using Accessibility as fallback
    case 'dementia': return Brain;
    case 'controlled_meds': return Pill;
    case 'hypertension': return HeartPulse;
    case 'diabetes': return Droplets;
    case 'fall_risk_high': return AlertTriangle;
    default: return Accessibility; // Fallback icon for other care flags
  }
};
