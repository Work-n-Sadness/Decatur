
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
import { Shield as ShieldIcon, LogOut, UserCircle, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { SidebarIcons } from '@/components/icons';
import type { AppRole } from '@/types'; 

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  icon?: LucideIcon;
  defaultOpen?: boolean; 
}

// Updated navGroups focusing on compliance
const navGroups: NavGroup[] = [
  {
    label: 'OPERATIONS',
    icon: SidebarIcons.Dashboard, // Or a more compliance-focused group icon if available
    defaultOpen: true,
    items: [
      { href: '/', label: 'Dashboard', icon: SidebarIcons.Dashboard },
      { href: '/core-operations/audit-tool', label: 'Audit Tool', icon: SidebarIcons.AuditTool },
      { href: '/compliance-summary', label: 'Compliance Summary', icon: SidebarIcons.ComplianceSummary },
      { href: '/core-operations/survey-readiness', label: 'Survey Readiness', icon: SidebarIcons.SurveyReadiness },
      { href: '/checklists', label: 'Checklists', icon: SidebarIcons.Checklists },
    ],
  },
  {
    label: 'MEDICAL NEEDS & CARE TAGS',
    icon: SidebarIcons.MedicalNeedsCareTagsGroup,
    defaultOpen: true,
    items: [
        { href: '/medical-needs/special-care-tags', label: 'Special Care Tags', icon: SidebarIcons.SpecialCareTags },
    ],
  },
  {
    label: 'EMERGENCY READINESS',
    icon: SidebarIcons.EmergencyReadinessGroup,
    defaultOpen: true,
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
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    if (!mounted) return;
    let activeGroupLabel: string | null = null;
    for (const group of navGroups) {
      if (group.items.some(item => item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href) && (pathname.charAt(item.href.length) === '/' || pathname.length === item.href.length)))) {
        activeGroupLabel = group.label;
        break;
      }
    }

    const initialOpenGroups: Record<string, boolean> = {};
    navGroups.forEach(group => {
      initialOpenGroups[group.label] = group.defaultOpen || (activeGroupLabel === group.label);
    });
    setOpenGroups(initialOpenGroups);

  }, [pathname, mounted]);


  const currentTopLevelLabel = React.useMemo(() => {
    if (!mounted) { 
      const defaultItem = navGroups.flatMap(g => g.items).find(item => item.href === '/');
      return defaultItem ? defaultItem.label : 'Dashboard';
    }
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.href === '/' && pathname === '/') {
            return item.label;
        }
        if (item.href !== '/' && pathname.startsWith(item.href) && (pathname.charAt(item.href.length) === '/' || pathname.length === item.href.length)) {
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

  const toggleGroup = (groupLabel: string) => {
    setOpenGroups(prev => ({ ...prev, [groupLabel]: !prev[groupLabel] }));
  };

  if (!mounted) { 
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldIcon className="h-8 w-8 text-accent" />
            <h1 className="text-xl font-semibold text-foreground">DCS</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {navGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel
                onClick={() => toggleGroup(group.label)}
                className="cursor-pointer flex items-center justify-between hover:bg-sidebar-accent/50 rounded-md"
              >
                <div className="flex items-center">
                  {group.icon && <group.icon className="mr-2 h-4 w-4 inline-block" />}
                  {group.label}
                </div>
                {openGroups[group.label] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </SidebarGroupLabel>
              {openGroups[group.label] && (
                <SidebarGroupContent className="pl-2 border-l border-sidebar-border ml-2">
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref legacyBehavior>
                          <SidebarMenuButton
                            isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && (pathname.charAt(item.href.length) === '/' || pathname.length === item.href.length))}
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
              )}
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
                  <AvatarImage src="https://placehold.co/40x40.png?text=DCS&font=roboto" alt="DCS Logo - Shield with Cross" data-ai-hint="shield cross logo" />
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
