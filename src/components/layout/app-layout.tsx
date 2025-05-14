
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, LogOut, UserCircle, Moon, Sun } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { SidebarIcons } from '@/components/icons';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  icon?: LucideIcon;
}

const navGroups: NavGroup[] = [
  {
    label: 'OPERATIONS',
    icon: SidebarIcons.Dashboard,
    items: [
      { href: '/', label: 'Dashboard', icon: SidebarIcons.Dashboard },
      { href: '/core-operations/audit-tool', label: 'Audit Tool', icon: SidebarIcons.AuditTool },
      { href: '/compliance-summary', label: 'Compliance Summary', icon: SidebarIcons.ComplianceSummary },
      { href: '/reports', label: 'Reports', icon: SidebarIcons.Reports },
      { href: '/core-operations/survey-readiness', label: 'Survey Readiness', icon: SidebarIcons.SurveyReadiness },
      { href: '/checklists', label: 'Checklists', icon: SidebarIcons.Checklists },
    ],
  },
  {
    label: 'RESIDENTS',
    icon: SidebarIcons.ProfilesFaceSheets,
    items: [
      { href: '/resident-records/face-sheets', label: 'Face Sheets', icon: SidebarIcons.ProfilesFaceSheets },
      { href: '/resident-records/care-plans', label: 'Care Plans', icon: SidebarIcons.CarePlans },
      { href: '/resident-records/progress-notes', label: 'Progress Notes', icon: SidebarIcons.ProgressNotes },
      { href: '/resident-records/moving-in-out', label: 'Residents Moving-in & Moving-out', icon: SidebarIcons.ResidentsMovingInOut },
      { href: '/resident-records/case-management', label: 'Case Management', icon: SidebarIcons.CaseManagement },
      { href: '/resident-records/resident-management-forum', label: 'Resident-Management Forum', icon: SidebarIcons.ResidentManagementForum },
    ],
  },
  {
    label: 'MEDICAL NEEDS & CARE TAGS',
    icon: SidebarIcons.MedicalNeedsCareTagsGroup,
    items: [
        { href: '/medical-needs/special-care-tags', label: 'Special Care Tags', icon: SidebarIcons.SpecialCareTags },
    ],
  },
  {
    label: 'MEDICATION & ECP',
    icon: SidebarIcons.MedOrders,
    items: [
      { href: '/medication-clinical/medication-orders', label: 'Medication Orders', icon: SidebarIcons.MedOrders },
      { href: '/medication-clinical/mar-logs', label: 'MAR Logs', icon: SidebarIcons.MARLogs },
      { href: '/medication-clinical/prn-monitoring', label: 'PRN Monitoring', icon: SidebarIcons.PRNMonitoring },
      { href: '/medication-clinical/pharmacy-orders', label: 'Pharmacy Orders', icon: SidebarIcons.PharmacyOrders },
      { href: '/medication-clinical/discontinued-meds', label: 'Discontinued Meds', icon: SidebarIcons.DiscontinuedMeds },
      { href: '/medication-clinical/treatment-history', label: 'Treatment History', icon: SidebarIcons.TreatmentHistory },
      { href: '/medication-clinical/doctor-orders', label: 'Doctor Orders', icon: SidebarIcons.DoctorOrders },
    ],
  },
  {
    label: 'ECP CHARTING',
    icon: SidebarIcons.FlaggedECPActions,
    items: [
        { href: '/ecp-charting/flagged-actions', label: 'Flagged ECP Actions', icon: SidebarIcons.FlaggedECPActions },
        { href: '/ecp-charting/mar-corrections', label: 'MAR Corrections Log', icon: SidebarIcons.MARCorrections },
        { href: '/ecp-charting/missed-doses', label: 'Missed Dose Tracker', icon: SidebarIcons.MissedDoses },
    ]
  },
  {
    label: 'EMERGENCY READINESS',
    icon: SidebarIcons.FireDrills,
    items: [
      { href: '/fire-emergency/fire-drills', label: 'Fire Drills', icon: SidebarIcons.FireDrills },
      { href: '/fire-emergency/extinguisher-checks', label: 'Extinguisher Checks', icon: SidebarIcons.ExtinguisherChecks },
      { href: '/fire-emergency/emergency-lighting', label: 'Emergency Lighting', icon: SidebarIcons.EmergencyLighting },
      { href: '/fire-emergency/cnfa-posting', label: 'CNFA Posting', icon: SidebarIcons.CNFAPosting },
      { href: '/fire-emergency/evacuation-plans', label: 'Evacuation Plans', icon: SidebarIcons.EvacuationPlans },
      { href: '/fire-emergency/go-bag-checklist', label: 'Go-Bag Checklist', icon: SidebarIcons.GoBagChecklist },
      { href: '/fire-emergency/911-log', label: '911 Log', icon: SidebarIcons.NineOneOneLog },
    ],
  },
  {
    label: 'FACILITY OPERATIONS & SERVICES',
    icon: SidebarIcons.FacilityOpsServicesGroup,
    items: [
      { href: '/facility-operations/procurement/grocery-food-purchases', label: 'Grocery & Food Purchases', icon: SidebarIcons.GroceryFoodPurchases },
      { href: '/facility-operations/procurement/cleaning-supplies-orders', label: 'Cleaning Supplies Orders', icon: SidebarIcons.CleaningSuppliesOrders },
      { href: '/facility-operations/procurement/food-dry-goods-inventory', label: 'Food & Dry Goods Inventory', icon: SidebarIcons.FoodDryGoodsInventory },
      { href: '/facility-operations/procurement/cleaning-supplies-inventory', label: 'Cleaning Supplies Inventory', icon: SidebarIcons.CleaningSuppliesInventory },
      { href: '/facility-operations/maintenance/request-log', label: 'Maintenance Request Log', icon: SidebarIcons.MaintenanceRequestLog },
      { href: '/facility-operations/maintenance/repair-history', label: 'Facility Repair History', icon: SidebarIcons.FacilityRepairHistory },
      { href: '/facility-operations/maintenance/preventive-schedule', label: 'Preventive Maintenance', icon: SidebarIcons.PreventiveMaintenanceSchedule },
      { href: '/facility-operations/maintenance/vendor-directory', label: 'Vendor Directory', icon: SidebarIcons.VendorContactDirectory },
      { href: '/facility-operations/meal-ops/weekly-schedule', label: 'Weekly Meal Schedule', icon: SidebarIcons.WeeklyMealSchedule },
      { href: '/facility-operations/meal-ops/meal-prep-checklist', label: 'Meal Prep Checklist', icon: SidebarIcons.MealPrepChecklist },
      { href: '/facility-operations/meal-ops/therapeutic-diet-tracker', label: 'Therapeutic Diet Tracker', icon: SidebarIcons.TherapeuticDietTracker },
      { href: '/facility-operations/meal-ops/leftovers-log', label: 'Leftovers & Labeling Log', icon: SidebarIcons.LeftoversLabelingLog },
      { href: '/facility-operations/water-safety/shower-sink-temp-logs', label: 'Shower & Sink Temp Logs', icon: SidebarIcons.WeeklyShowerSinkTempLogs },
      { href: '/facility-operations/water-safety/dishwasher-temp-record', label: 'Dishwasher Temp Record', icon: SidebarIcons.DishwasherCycleTempRecord },
      { href: '/facility-operations/water-safety/scald-risk-audit', label: 'Scald Risk Audit', icon: SidebarIcons.ScaldRiskAudit },
    ],
  },
  {
    label: 'ENVIRONMENTAL SAFETY',
    icon: SidebarIcons.EnvironmentalSafetyGroup,
    items: [
      { href: '/environmental/pest-control', label: 'Pest Control', icon: SidebarIcons.PestControl },
      { href: '/environmental/oxygen-handling', label: 'Oxygen Handling', icon: SidebarIcons.OxygenHandling },
      { href: '/environmental/ppe-audit', label: 'PPE Audits', icon: SidebarIcons.PPEAudits },
      { href: '/environmental/maintenance-requests', label: 'Maintenance Requests', icon: SidebarIcons.MaintenanceRequests },
      { href: '/environmental/hazard-checks', label: 'Hazard Checks', icon: SidebarIcons.HazardChecks },
    ],
  },
  {
    label: 'FOOD & NUTRITION',
    icon: SidebarIcons.FoodNutritionGroup,
    items: [
      { href: '/food-nutrition/food-temp-logs', label: 'Temperature Logs', icon: SidebarIcons.TempLogs },
      { href: '/food-nutrition/dishwasher-logs', label: 'Dishwasher Logs', icon: SidebarIcons.DishwasherLogs },
      { href: '/food-nutrition/weekly-menu', label: 'Weekly Menu', icon: SidebarIcons.WeeklyMenu },
      { href: '/food-nutrition/grocery-inventory', label: 'Grocery Inventory', icon: SidebarIcons.ShoppingCart },
      { href: '/food-nutrition/food-safety-audit', label: 'Food Safety Audits', icon: SidebarIcons.FoodSafetyAudits },
    ],
  },
  {
    label: 'SECURITY & BEHAVIOR',
    icon: SidebarIcons.SecurityBehaviorGroup,
    items: [
      { href: '/security-behavior/entry-exit-logs', label: 'Entry/Exit Logs', icon: SidebarIcons.EntryExitLogs },
      { href: '/security-behavior/smoking-compliance', label: 'Smoking Compliance', icon: SidebarIcons.SmokingCompliance },
      { href: '/security-behavior/behavior-reports', label: 'Behavior Reports', icon: SidebarIcons.BehaviorReports },
      { href: '/security-behavior/visitor-log-notifications', label: 'Visitor Log & Notifications', icon: SidebarIcons.VisitorLogNotifications },
    ],
  },
  {
    label: 'REGULATORY OVERSIGHT',
    icon: SidebarIcons.RegulatoryOversightGroup,
    items: [
      { href: '/governance-regulatory/fire-dept-visits', label: 'Fire Dept Visits', icon: SidebarIcons.FireDeptVisits },
      { href: '/governance-regulatory/state-survey-visits', label: 'State Survey Visits', icon: SidebarIcons.StateSurveyVisits },
      { href: '/governance-regulatory/regulatory-visit-logs', label: 'Regulatory Visit Logs', icon: SidebarIcons.RegulatoryVisitLogs },
      { href: '/governance-regulatory/ombudsman-reports', label: 'Ombudsman Reports', icon: SidebarIcons.OmbudsmanReports },
      { href: '/governance-regulatory/incident-grievance-logs', label: 'Incident & Grievance Logs', icon: SidebarIcons.IncidentGrievanceLogs },
    ],
  },
  {
    label: 'FACILITY CERTIFICATIONS & INSTALLATIONS',
    icon: SidebarIcons.FacilityCertsInstallationsGroup,
    items: [
      { href: '/facility-certs-installations/certifications', label: 'Certifications', icon: SidebarIcons.Certifications },
      { href: '/facility-certs-installations/installations', label: 'Installations & Infrastructure', icon: SidebarIcons.InstallationsInfrastructure },
    ],
  },
  {
    label: 'FINANCE',
    icon: SidebarIcons.FinanceGroup,
    items: [
      { href: '/finance/purchase-requests', label: 'Purchase Requests', icon: SidebarIcons.PurchaseRequests },
      { href: '/finance/facility-expenses', label: 'Facility Expenses', icon: SidebarIcons.FacilityExpenses },
      { href: '/finance/rent-payments', label: 'Rent Payments', icon: SidebarIcons.RentPayments },
      { href: '/finance/medicaid-claims', label: 'Medicaid Claims', icon: SidebarIcons.MedicaidClaims },
      { href: '/finance/insurance-claims', label: 'Insurance Claims', icon: SidebarIcons.InsuranceClaims },
      { href: '/finance/inflow-outflow-reports', label: 'Inflow/Outflow Reports', icon: SidebarIcons.InflowOutflowReports },
    ],
  },
  {
    label: 'HUMAN RESOURCES',
    icon: SidebarIcons.HumanResourcesGroup,
    items: [
      { href: '/human-resources/recruitment', label: 'Recruitment', icon: SidebarIcons.Recruitment },
      { href: '/human-resources/onboarding', label: 'Onboarding', icon: SidebarIcons.Onboarding },
      { href: '/human-resources/staff-matrix', label: 'Staff Matrix', icon: SidebarIcons.StaffMatrix },
      { href: '/human-resources/training-certs', label: 'Training & Certs', icon: SidebarIcons.TrainingCerts },
      { href: '/human-resources/performance-reviews', label: 'Performance Reviews', icon: SidebarIcons.PerformanceReviews },
      { href: '/human-resources/exit-logs', label: 'Exit Logs', icon: SidebarIcons.ExitLogs },
      { href: '/human-resources/contractors-consultants', label: 'Contractors & Consultants', icon: SidebarIcons.ContractorsConsultants },
    ],
  },
  {
    label: 'POLICY & COMPLIANCE',
    icon: SidebarIcons.PolicyComplianceGroup,
    items: [
      { href: '/governance-regulatory/policies', label: 'Policies & Procedures', icon: SidebarIcons.PoliciesProcedures },
      { href: '/governance-regulatory/house-rules', label: 'House Rules', icon: SidebarIcons.HouseRules },
    ],
  },
  {
    label: 'INSIGHTS & SYSTEMS',
    icon: SidebarIcons.InsightsSystemsGroup,
    items: [
      { href: '/admin/system-logs', label: 'System Logs', icon: SidebarIcons.SystemLogs },
      { href: '/admin/api-integrations', label: 'API Integrations', icon: SidebarIcons.ApiIntegrations },
      { href: '/admin/user-management', label: 'User Management', icon: SidebarIcons.UserManagement },
      { href: '/admin/settings', label: 'Settings', icon: SidebarIcons.Settings },
    ],
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const currentTopLevelLabel = React.useMemo(() => {
    if (!mounted) {
      // Default value before client-side hydration
      const defaultItem = navGroups.flatMap(g => g.items).find(item => item.href === '/');
      return defaultItem ? defaultItem.label : 'Dashboard';
    }
    for (const group of navGroups) {
      for (const item of group.items) {
        if (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && (pathname.charAt(item.href.length) === '/' || pathname.length === item.href.length ))) {
          return item.label;
        }
      }
    }
    const rootItem = navGroups.flatMap(g => g.items).find(item => item.href === '/');
    return rootItem ? rootItem.label : 'Dashboard';
  }, [pathname, mounted]);


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Prevent rendering until mounted to avoid hydration mismatch related to currentTopLevelLabel or theme
  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-accent" />
            <h1 className="text-xl font-semibold text-foreground">Decatur West</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {navGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>
                {group.icon && <group.icon className="mr-2 h-4 w-4 inline-block" />}
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                          tooltip={item.label}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start gap-2">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>Toggle Theme</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-lg font-semibold">
              {currentTopLevelLabel}
            </h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="facility sign" />
                  <AvatarFallback>
                    <UserCircle className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
