
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react'; // Added useState, useEffect
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
}

const navGroups: NavGroup[] = [
  {
    label: 'OPERATIONS',
    items: [
      { href: '/', label: 'Dashboard', icon: SidebarIcons.Dashboard },
      { href: '/core-operations/audit-tool', label: 'Audit Tool', icon: SidebarIcons.AuditTool },
      { href: '/compliance-summary', label: 'Compliance Summary', icon: SidebarIcons.ComplianceSummary },
      { href: '/reports', label: 'Reports', icon: SidebarIcons.Reports },
      { href: '/core-operations/survey-readiness', label: 'Survey Readiness', icon: SidebarIcons.SurveyReadiness },
    ],
  },
  {
    label: 'RESIDENTS',
    items: [
      { href: '/resident-records/face-sheets', label: 'Face Sheets', icon: SidebarIcons.ProfilesFaceSheets },
      { href: '/resident-records/care-plans', label: 'Care Plans', icon: SidebarIcons.CarePlans },
      { href: '/resident-records/progress-notes', label: 'Progress Notes', icon: SidebarIcons.ProgressNotes },
      { href: '/resident-records/check-in-out', label: 'Check-in/Exit', icon: SidebarIcons.CheckInOutLogs },
      { href: '/resident-records/case-management', label: 'Case Management', icon: SidebarIcons.CaseManagement },
      { href: '/resident-records/council-meetings', label: 'Council Meetings', icon: SidebarIcons.CouncilMeetings },
    ],
  },
  {
    label: 'MEDICATION & ECP',
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
    items: [
        { href: '/ecp-charting/flagged-actions', label: 'Flagged ECP Actions', icon: SidebarIcons.FlaggedECPActions },
        { href: '/ecp-charting/mar-corrections', label: 'MAR Corrections Log', icon: SidebarIcons.MARCorrections },
        { href: '/ecp-charting/missed-doses', label: 'Missed Dose Tracker', icon: SidebarIcons.MissedDoses },
    ]
  },
  {
    label: 'EMERGENCY READINESS',
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
    label: 'ENVIRONMENTAL SAFETY',
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
    items: [
      { href: '/food-nutrition/food-temp-logs', label: 'Temperature Logs', icon: SidebarIcons.TempLogs },
      { href: '/food-nutrition/dishwasher-logs', label: 'Dishwasher Logs', icon: SidebarIcons.DishwasherLogs },
      { href: '/food-nutrition/weekly-menu', label: 'Weekly Menu', icon: SidebarIcons.WeeklyMenu },
      { href: '/food-nutrition/grocery-inventory', label: 'Grocery Inventory', icon: SidebarIcons.GroceryInventory },
      { href: '/food-nutrition/food-safety-audit', label: 'Food Safety Audits', icon: SidebarIcons.FoodSafetyAudits },
    ],
  },
  {
    label: 'SECURITY & BEHAVIOR',
    items: [
      { href: '/security-behavior/entry-exit-logs', label: 'Entry/Exit Logs', icon: SidebarIcons.EntryExitLogs },
      { href: '/security-behavior/smoking-compliance', label: 'Smoking Compliance', icon: SidebarIcons.SmokingCompliance },
      { href: '/security-behavior/behavior-reports', label: 'Behavior Reports', icon: SidebarIcons.BehaviorReports },
      { href: '/security-behavior/visitor-restrictions', label: 'Visitor Restrictions', icon: SidebarIcons.VisitorRestrictions },
    ],
  },
  {
    label: 'REGULATORY OVERSIGHT',
    items: [
      { href: '/governance-regulatory/fire-dept-visits', label: 'Fire Dept Visits', icon: SidebarIcons.FireDeptVisits },
      { href: '/governance-regulatory/state-survey-visits', label: 'State Survey Visits', icon: SidebarIcons.StateSurveyVisits },
      { href: '/governance-regulatory/regulatory-visit-logs', label: 'Regulatory Visit Logs', icon: SidebarIcons.RegulatoryVisitLogs },
      { href: '/governance-regulatory/ombudsman-reports', label: 'Ombudsman Reports', icon: SidebarIcons.OmbudsmanReports },
      { href: '/governance-regulatory/incident-grievance-logs', label: 'Incident & Grievance Logs', icon: SidebarIcons.IncidentGrievanceLogs },
    ],
  },
  {
    label: 'FINANCE',
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
    items: [
      { href: '/governance-regulatory/policies', label: 'Policies & Procedures', icon: SidebarIcons.PoliciesProcedures },
      { href: '/governance-regulatory/house-rules', label: 'House Rules', icon: SidebarIcons.HouseRules },
    ],
  },
  {
    label: 'INSIGHTS & SYSTEMS',
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
    setMounted(true); // Indicates component has mounted on the client

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
      // Return a default label for SSR or initial client render before hydration
      // This should match what the server would render or be a safe default.
      // For instance, the label of the item matching the default route '/'
      const defaultItem = navGroups.flatMap(g => g.items).find(item => item.href === '/');
      return defaultItem ? defaultItem.label : 'Dashboard';
    }

    // Client-side logic using the actual pathname
    for (const group of navGroups) {
      for (const item of group.items) {
        if (pathname === item.href) {
          return item.label;
        }
      }
    }
    // Fallback for grouped paths if not an exact match
     for (const group of navGroups) {
        const groupPathPrefix = `/${group.label.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '')}`;
        if (pathname.startsWith(groupPathPrefix) || group.items.some(item => pathname.startsWith(item.href.substring(0, item.href.lastIndexOf('/'))) && item.href !== '/')) {
             const item = group.items.find(i => pathname.startsWith(i.href) && i.href !== '/');
             if(item) return item.label;
             
             const segments = pathname.split('/').filter(Boolean);
             if (segments.length > 0) {
                const currentSubPathSegment = segments[segments.length - 1];
                const matchedItem = group.items.find(i => {
                    const itemPathSegments = i.href.split('/').filter(Boolean);
                    const itemLastSegment = itemPathSegments[itemPathSegments.length -1];
                    return itemLastSegment === currentSubPathSegment || i.label.toLowerCase().replace(/\s+/g, '-') === currentSubPathSegment;
                });
                if (matchedItem) return matchedItem.label;
             }
             // If still no match, return the group label if the path starts with a prefix derived from it
             // This part might need refinement if group labels are not desired as page titles
             // For now, if a deeper match isn't found, but it's within a group prefix, use a specific page title or a more generic one
             // return group.label; // Potentially problematic if group.label is "OPERATIONS" and path is /core-operations/some-page
             // Let's try to find the specific page or default to a sensible title
             const fallbackItem = group.items.find(i => pathname.startsWith(i.href.substring(0, i.href.lastIndexOf('/'))));
             if(fallbackItem) return fallbackItem.label
        }
    }
    return 'Dashboard'; // Default
  }, [pathname, mounted]);


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
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
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={pathname === item.href}
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
              {mounted ? currentTopLevelLabel : 'Dashboard'} {/* Display placeholder or default until mounted */}
            </h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
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

    