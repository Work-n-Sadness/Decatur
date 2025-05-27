
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
  Tags, // For Special Care Tags item
  Brain, // For Dementia care flag
  Droplets, // For Diabetes care flag
  FileLock, // For HIPAA Note Available care flag
  Accessibility
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
  SurveyReadiness: ClipboardList, // Ensured this is ClipboardList
  Checklists: ListTodo,

  // RESIDENTS
  ResidentsGroup: Users,
  ProfilesFaceSheets: Contact,
  CarePlans: FileText,
  ProgressNotes: TrendingUp,
  ResidentsMovingInOut: UserCheck, // UserCheck for "moving in", UserMinus for "moving out" might be part of a sub-page or modal
  CaseManagement: Users2,
  ResidentManagementForum: Presentation, // Changed from CouncilMeetings
  
  // MEDICAL NEEDS & CARE TAGS
  MedicalNeedsCareTagsGroup: HeartHandshake,
  SpecialCareTags: Tags,


  // MEDICATION & ECP
  MedicationECPGroup: Pill,
  MedOrders: Pill,
  MARLogs: Activity,
  PRNMonitoring: Eye,
  PharmacyOrders: ShoppingCart,
  DiscontinuedMeds: Archive,
  TreatmentHistory: Stethoscope,
  DoctorOrders: NotebookPen, // Was UserMd which doesn't exist, using NotebookPen

  // ECP CHARTING
  ECPChartingGroup: FileEdit, // Using FileEdit as a general icon for this group
  FlaggedECPActions: Flag,
  MARCorrections: FileEdit,
  MissedDoses: History, // Was CalendarX2, using History

  // EMERGENCY READINESS
  EmergencyReadinessGroup: Flame, // Using Flame as a general icon for this group
  FireDrills: Flame,
  ExtinguisherChecks: FlameKindling,
  EmergencyLighting: Lightbulb,
  CNFAPosting: Siren,
  EvacuationPlans: Map,
  GoBagChecklist: Briefcase, // "Bag Checklist" to "Go-Bag Checklist" - icon is Briefcase
  NineOneOneLog: PhoneCall,

  // FACILITY OPERATIONS & SERVICES
  FacilityOpsServicesGroup: LayoutGrid,
  GroceryFoodPurchases: ShoppingCart,
  CleaningSuppliesOrders: SprayCan,
  FoodDryGoodsInventory: Boxes,
  CleaningSuppliesInventory: Archive, // Re-using Archive
  MaintenanceRequestLog: Wrench,
  FacilityRepairHistory: History, // Re-using History
  PreventiveMaintenanceSchedule: CalendarCheck,
  VendorContactDirectory: BookUser,
  WeeklyMealSchedule: Utensils,
  MealPrepChecklist: ClipboardCheck, // Re-using ClipboardCheck
  TherapeuticDietTracker: Salad,
  LeftoversLabelingLog: Tag,
  WeeklyShowerSinkTempLogs: Thermometer,
  DishwasherCycleTempRecord: WashingMachine,
  ScaldRiskAudit: ShieldAlert,


  // ENVIRONMENTAL SAFETY
  EnvironmentalSafetyGroup: Wind,
  PestControl: Bug,
  OxygenHandling: Wind, // Re-using Wind
  PPEAudits: Shirt, // Using Shirt as fallback
  MaintenanceRequests: Wrench, // Re-using Wrench
  HazardChecks: SearchCheck, // Fallback for TriangleAlert if not suitable

  // FOOD & NUTRITION
  FoodNutritionGroup: ChefHat,
  TempLogs: Thermometer, // Re-using Thermometer
  DishwasherLogs: WashingMachine, // Re-using WashingMachine
  WeeklyMenu: Utensils, // Re-using Utensils
  GroceryInventory: ShoppingCart, // Re-using ShoppingCart from FacilityOps
  FoodSafetyAudits: ChefHat, // Re-using ChefHat

  // SECURITY & BEHAVIOR
  SecurityBehaviorGroup: ShieldCheck, // Re-using ShieldCheck
  EntryExitLogs: DoorOpen,
  SmokingCompliance: Cigarette,
  BehaviorReports: SmilePlus,
  VisitorLogNotifications: Users, // Changed from VisitorRestrictions, icon Users

  // REGULATORY OVERSIGHT
  RegulatoryOversightGroup: Gavel,
  FireDeptVisits: Building, // Building icon for Fire Dept
  StateSurveyVisits: BadgeCheck,
  RegulatoryVisitLogs: BookCopy,
  OmbudsmanReports: Gavel, // Re-using Gavel
  IncidentGrievanceLogs: AlertOctagon,

  // FACILITY CERTIFICATIONS & INSTALLATIONS
  FacilityCertsInstallationsGroup: Building2, // Using Building2 for the group
  Certifications: ShieldIcon, // Using Shield (aliased)
  InstallationsInfrastructure: CpuIcon, // Using CPU (aliased)


  // FINANCE
  FinanceGroup: DollarSign,
  PurchaseRequests: ShoppingBag,
  FacilityExpenses: CreditCard,
  RentPayments: Landmark,
  MedicaidClaims: DollarSign, // Re-using DollarSign
  InsuranceClaims: FileDigit,
  InflowOutflowReports: LineChart,

  // HUMAN RESOURCES
  HumanResourcesGroup: Users, // Re-using Users
  Recruitment: UserPlus,
  Onboarding: ClipboardPen, // Replaced ClipboardUser
  StaffMatrix: Users, // Re-using Users for Staff Matrix
  TrainingCerts: UsersRound, // Re-using UsersRound from original request
  PerformanceReviews: Award,
  ExitLogs: UserMinus, // Re-using UserMinus
  ContractorsConsultants: HardHat, // Re-using HardHat

  // POLICY & COMPLIANCE
  PolicyComplianceGroup: ScrollText,
  PoliciesProcedures: ScrollText, // Re-using ScrollText for Policies
  HouseRules: ClipboardSignature, // Re-using ClipboardSignature for House Rules


  // INSIGHTS & SYSTEMS
  InsightsSystemsGroup: Settings, // Using Settings for the group
  SystemLogs: DatabaseZap,
  ApiIntegrations: Network,
  UserManagement: UserCog, // Corrected from UsersCog
  Settings: Settings, // Re-using Settings
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
