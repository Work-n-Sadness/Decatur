
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowDownUp, Download, Filter as FilterIcon, CalendarDays, BookOpen, FileText, Package, Users, Brain, Droplets, HeartPulse, AlertTriangle, Accessibility } from "lucide-react";
import type { TaskCategory, ResolutionStatus, Role, TaskFrequency, ResidentCareFlag } from "@/types";
import { allCareFlags } from "@/lib/mock-data"; // Import allCareFlags
import { ScrollArea } from "../ui/scroll-area";

interface DashboardFiltersProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
  onSortChange: (sortBy: string) => void;
  onExportReport: () => void;
  onExportAuditLog: () => void;
  onExportSurveyPrepPacket: () => void;
  categories: TaskCategory[];
  statuses: ResolutionStatus[];
  roles: Role[];
  frequencies: TaskFrequency[];
  complianceChapterTags: string[];
}

export default function DashboardFilters({ 
  onSearch, 
  onFilterChange, 
  onSortChange, 
  onExportReport,
  onExportAuditLog,
  onExportSurveyPrepPacket,
  categories,
  statuses,
  roles,
  frequencies,
  complianceChapterTags
}: DashboardFiltersProps) {

  const careFlagOptions = [
    { value: 'all', label: 'All Care Needs', icon: Accessibility },
    { value: 'wheelchair', label: 'Wheelchair Use', icon: Accessibility },
    { value: 'walker', label: 'Walker Use', icon: Accessibility },
    { value: 'controlled_meds', label: 'Controlled Meds', icon: FileText },
    { value: 'hypertension', label: 'Hypertension', icon: HeartPulse },
    { value: 'diabetes', label: 'Diabetes', icon: Droplets },
    { value: 'dementia', label: 'Dementia/Alzheimer’s', icon: Brain },
    { value: 'fall_risk_high', label: 'High Fall Risk', icon: AlertTriangle },
    { value: 'elopement_risk_yes', label: 'Elopement Risk', icon: AlertTriangle },
  ];
  
  const handleSingleFilterChange = (key: string, value: string) => {
    onFilterChange((prev: any) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };


  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks by name..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Select onValueChange={(value) => handleSingleFilterChange('category', value)}>
          <SelectTrigger>
            <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-48">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleSingleFilterChange('status', value)}>
          <SelectTrigger>
            <FilterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Statuses</SelectItem>
             {statuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleSingleFilterChange('responsibleRole', value)}>
          <SelectTrigger>
             <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by Responsible Role" />
          </SelectTrigger>
          <SelectContent>
             <ScrollArea className="h-48">
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleSingleFilterChange('frequency', value)}>
          <SelectTrigger>
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frequencies</SelectItem>
            {frequencies.map(freq => <SelectItem key={freq} value={freq}>{freq}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleSingleFilterChange('complianceChapterTag', value)}>
          <SelectTrigger>
            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by Compliance Chapter" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-48">
              <SelectItem value="all">All Compliance Chapters</SelectItem>
              {complianceChapterTags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
            </ScrollArea>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleSingleFilterChange('careFlag', value)}>
          <SelectTrigger>
            <Accessibility className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by Care Need/Tag" />
          </SelectTrigger>
          <SelectContent>
            {careFlagOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" /> {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <Select onValueChange={onSortChange}>
          <SelectTrigger>
              <ArrowDownUp className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="dueDate_asc">Due Date (Oldest)</SelectItem>
              <SelectItem value="dueDate_desc">Due Date (Newest)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="progress_desc">Progress (High-Low)</SelectItem>
              <SelectItem value="progress_asc">Progress (Low-High)</SelectItem>
              <SelectItem value="frequency">Frequency</SelectItem>
          </SelectContent>
        </Select>
            
        <Button onClick={onExportReport} variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export Task Report
        </Button>

        <Button onClick={onExportAuditLog} variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Export Audit Log
        </Button>

        <Button onClick={onExportSurveyPrepPacket} variant="outline" className="w-full">
          <Package className="mr-2 h-4 w-4" />
          Export Survey Packet
        </Button>
      </div>
    </div>
  );
}
