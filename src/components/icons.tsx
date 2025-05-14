
import {
  HeartPulse,
  UtensilsCrossed,
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
  ListTodo, // Added for Checklists
} from 'lucide-react';
import type { TaskCategory, ResolutionStatus, TaskFrequency } from '@/types';

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
  Complete: CheckCircle2, // Added
  Flagged: AlertTriangle, // Added
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
  Reports: FilePieChart, // Moved from Insights & Systems
  SurveyReadiness: ClipboardList,
  Checklists: ListTodo, // Added for Checklists

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
  // ECP CHARTING (Now part of MEDICATION & ECP items based on user's detailed list for sidebar groups)
  FlaggedECPActions: Flag,
  MARCorrections: FileEdit,
  MissedDoses: History,


  // EMERGENCY READINESS (Was FIRE & EMERGENCY SAFETY)
  FireDrills: Flame,
  ExtinguisherChecks: FlameKindling,
  EmergencyLighting: Lightbulb,
  CNFAPosting: Siren,
  EvacuationPlans: Map,
  GoBagChecklist: Briefcase, // Renamed from Bag Checklist
  NineOneOneLog: PhoneCall,

  // FACILITY OPERATIONS & SERVICES (New Top Level Group)
  FacilityOperations: LayoutGrid, // Icon for the group itself if needed, or can be one of the items
  GroceryFoodPurchases: ShoppingCart,
  CleaningSuppliesOrders: SprayCan,
  FoodDryGoodsInventory: Archive, // Re-using Archive, Boxes could also be an option
  CleaningSuppliesInventory: Boxes,
  MaintenanceRequestLog: Wrench, // Also used in Environmental Safety
  FacilityRepairHistory: History,
  PreventiveMaintenanceSchedule: CalendarCheck,
  VendorContactDirectory: BookUser,
  WeeklyMealSchedule: Utensils, // Also used in Food & Nutrition
  MealPrepChecklist: ClipboardCheck, // Also used for Compliance Summary
  TherapeuticDietTracker: Salad,
  LeftoversLabelingLog: Tag,
  WeeklyShowerSinkTempLogs: Thermometer, // Also used in Food & Nutrition
  DishwasherCycleTempRecord: WashingMachine, // Also used in Food & Nutrition
  ScaldRiskAudit: ShieldAlert,


  // ENVIRONMENTAL SAFETY
  PestControl: Bug,
  OxygenHandling: Wind,
  PPEAudits: Shirt,
  MaintenanceRequests: Wrench, // Note: Duplicate, consider if this should be its own page or link to the one in Facility Ops
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

  // INSIGHTS & SYSTEMS
  // Reports: FilePieChart, // Moved to OPERATIONS
  SystemLogs: DatabaseZap,
  ApiIntegrations: Network,
  UserManagement: UserCog,
  Settings: Settings, // Admin Settings is just Settings
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
