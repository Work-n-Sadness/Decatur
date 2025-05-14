
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart3, CalendarIcon, Download, Filter, FileText, Repeat, History } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subMonths, subWeeks, subQuarters, subYears, type Duration } from "date-fns";
import { allTaskCategories, allResolutionStatuses, allMockRoles, allTaskFrequencies, mockTasks } from '@/lib/mock-data'; 
import type { TaskCategory, ResolutionStatus, Role, TaskFrequency, Task } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";

type PredefinedDateRangeKey = 
  | 'today' | 'this_week' | 'last_week' | 'this_month' | 'last_month' 
  | 'this_quarter' | 'last_quarter' | 'q4_2024' | 'year_2024' | 'year_2025' | 'custom';

interface PredefinedDateRange {
  key: PredefinedDateRangeKey;
  label: string;
  getRange?: () => { from: Date; to: Date };
}

const predefinedDateRanges: PredefinedDateRange[] = [
  { key: 'today', label: 'Today', getRange: () => { const now = new Date(); return { from: now, to: now }; } },
  { key: 'this_week', label: 'This Week', getRange: () => { const now = new Date(); return { from: startOfWeek(now), to: endOfWeek(now) }; } },
  { key: 'last_week', label: 'Last Week', getRange: () => { const now = new Date(); return { from: startOfWeek(subWeeks(now, 1)), to: endOfWeek(subWeeks(now, 1)) }; } },
  { key: 'this_month', label: 'This Month', getRange: () => { const now = new Date(); return { from: startOfMonth(now), to: endOfMonth(now) }; } },
  { key: 'last_month', label: 'Last Month', getRange: () => { const now = new Date(); return { from: startOfMonth(subMonths(now, 1)), to: endOfMonth(subMonths(now, 1)) }; } },
  { key: 'this_quarter', label: 'This Quarter', getRange: () => { const now = new Date(); return { from: startOfQuarter(now), to: endOfQuarter(now) }; } },
  { key: 'last_quarter', label: 'Last Quarter', getRange: () => { const now = new Date(); return { from: startOfQuarter(subQuarters(now, 1)), to: endOfQuarter(subQuarters(now, 1)) }; } },
  { key: 'q4_2024', label: 'Q4 2024 (Oct-Dec)', getRange: () => ({ from: new Date(2024, 9, 1), to: new Date(2024, 11, 31, 23, 59, 59) }) },
  { key: 'year_2024', label: 'Year 2024', getRange: () => ({ from: new Date(2024, 0, 1), to: new Date(2024, 11, 31, 23, 59, 59) }) },
  { key: 'year_2025', label: 'Year 2025', getRange: () => ({ from: new Date(2025, 0, 1), to: new Date(2025, 11, 31, 23, 59, 59) }) },
  { key: 'custom', label: 'Custom Range' },
];


export default function ReportsPage() {
  const [reportType, setReportType] = useState<string>('');
  const [selectedPresetDateRangeKey, setSelectedPresetDateRangeKey] = useState<PredefinedDateRangeKey>('this_month');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({ from: startOfMonth(new Date()), to: endOfMonth(new Date())});
  
  const [selectedCategories, setSelectedCategories] = useState<TaskCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ResolutionStatus[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<TaskFrequency[]>([]);
  const { toast } = useToast();

  const activeDateRange = useMemo(() => {
    if (selectedPresetDateRangeKey === 'custom') {
      return customDateRange;
    }
    const preset = predefinedDateRanges.find(p => p.key === selectedPresetDateRangeKey);
    return preset?.getRange ? preset.getRange() : { from: undefined, to: undefined };
  }, [selectedPresetDateRangeKey, customDateRange]);

  const handleGenerateReport = () => {
    if (!reportType) {
      toast({ title: "Select Report Type", description: "Please select a type of report to generate.", variant: "destructive" });
      return;
    }
    if (!activeDateRange?.from || !activeDateRange?.to) {
      toast({ title: "Select Date Range", description: "Please select a valid date range for the report.", variant: "destructive" });
      return;
    }

    const finalFilters = {
      reportType,
      dateRange: { 
        from: format(activeDateRange.from, 'yyyy-MM-dd'), 
        to: format(activeDateRange.to, 'yyyy-MM-dd') 
      },
      categories: selectedCategories,
      statuses: selectedStatuses,
      roles: selectedRoles,
      frequencies: selectedFrequencies,
    };
    
    // Simulate filtering mockTasks based on criteria
    const filteredReportTasks = mockTasks.filter(task => {
        const taskDate = task.lastCompletedOn || task.endDate || task.startDate; // Prioritize completion, then due, then start
        if (!taskDate) return false;
        
        const dateMatch = new Date(taskDate) >= new Date(activeDateRange.from!) && new Date(taskDate) <= new Date(activeDateRange.to!);
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(task.category);
        const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(task.status);
        const roleMatch = selectedRoles.length === 0 || (Array.isArray(task.responsibleRole) ? task.responsibleRole.some(r => selectedRoles.includes(r)) : selectedRoles.includes(task.responsibleRole as Role));
        const frequencyMatch = selectedFrequencies.length === 0 || selectedFrequencies.includes(task.frequency);

        return dateMatch && categoryMatch && statusMatch && roleMatch && frequencyMatch;
    });

    console.log("Generating report with criteria:", finalFilters);
    console.log("Number of tasks matching criteria:", filteredReportTasks.length);
    // In a real app, here you would format `filteredReportTasks` into CSV/PDF and trigger download.
    // For example, to show completion rates:
    const totalTasksInRange = filteredReportTasks.length;
    const completedTasksInRange = filteredReportTasks.filter(t => t.status === 'Resolved' || t.status === 'Complete').length;
    const completionRate = totalTasksInRange > 0 ? (completedTasksInRange / totalTasksInRange) * 100 : 0;
    
    const reportSummary = `
      Report Type: ${reportType}
      Date Range: ${finalFilters.dateRange.from} to ${finalFilters.dateRange.to}
      Filters:
        Categories: ${selectedCategories.join(', ') || 'All'}
        Statuses: ${selectedStatuses.join(', ') || 'All'}
        Roles: ${selectedRoles.join(', ') || 'All'}
        Frequencies: ${selectedFrequencies.join(', ') || 'All'}
      ---
      Tasks matching criteria: ${totalTasksInRange}
      Completed tasks in range: ${completedTasksInRange}
      Completion Rate: ${completionRate.toFixed(1)}%
      Missed tasks: ${totalTasksInRange - completedTasksInRange}
      Validator reviews (example - tasks with validator approval): ${filteredReportTasks.filter(t => t.validatorApproval).length}
    `;

    toast({ 
        title: "Report Generation Started", 
        description: `Report for '${reportType}' from ${finalFilters.dateRange.from} to ${finalFilters.dateRange.to} is being processed. Criteria logged to console.`,
        duration: 7000,
    });
    console.log("Report Summary:", reportSummary);
    // alert("Report generation initiated. Criteria logged to console. Filtered tasks: " + filteredReportTasks.length);
  };
  
  const toggleSelection = <T extends string>(currentSelection: T[], item: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    if (currentSelection.includes(item)) {
      setter(currentSelection.filter(i => i !== item));
    } else {
      setter([...currentSelection, item]);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-accent" /> Reports Dashboard
          </CardTitle>
          <CardDescription>
            Generate and export reports based on various criteria. Select report type and filters below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border rounded-lg bg-muted/30 items-end">
            <div>
              <Label htmlFor="reportType" className="text-sm font-medium">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="reportType" className="mt-1 bg-background">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task_resolution_summary">Task Resolution Summary</SelectItem>
                  <SelectItem value="task_completion_rates">Task Completion Rates</SelectItem>
                  <SelectItem value="missed_vs_completed">Missed vs. Completed Checklists</SelectItem>
                  <SelectItem value="validator_review_log">Validator Review Log</SelectItem>
                  <SelectItem value="escalated_tasks_report">Escalated Tasks Report</SelectItem>
                  <SelectItem value="staff_activity_overview">Staff Activity Overview</SelectItem>
                  <SelectItem value="compliance_snapshot_by_chapter">Compliance Snapshot (by Chapter)</SelectItem>
                  <SelectItem value="task_frequency_analysis">Task Frequency Analysis</SelectItem>
                  <SelectItem value="full_task_export">Full Task Export (filtered)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="predefinedDateRange" className="text-sm font-medium">Date Range Preset</Label>
              <Select value={selectedPresetDateRangeKey} onValueChange={(value) => setSelectedPresetDateRangeKey(value as PredefinedDateRangeKey)}>
                <SelectTrigger id="predefinedDateRange" className="mt-1 bg-background">
                  <History className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select predefined range" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedDateRanges.map(range => (
                    <SelectItem key={range.key} value={range.key}>{range.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">
                {selectedPresetDateRangeKey === 'custom' ? "Custom Date Range" : "Selected Range (Auto)"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-1 bg-background"
                    disabled={selectedPresetDateRangeKey !== 'custom'}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {activeDateRange?.from ? (
                      activeDateRange.to ? (
                        <>
                          {format(activeDateRange.from, "LLL dd, y")} -{" "}
                          {format(activeDateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(activeDateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={customDateRange.from}
                    selected={customDateRange}
                    onSelect={setCustomDateRange}
                    numberOfMonths={2}
                    disabled={selectedPresetDateRangeKey !== 'custom'}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-4 p-6 border rounded-lg bg-muted/30">
             <h3 className="text-lg font-semibold flex items-center gap-2"><Filter className="h-5 w-5 text-muted-foreground" /> Additional Filter Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <Label className="text-sm font-medium mb-2 block">Task Categories</Label>
                    <ScrollArea className="h-40 w-full rounded-md border p-2 bg-background">
                        {allTaskCategories.map(cat => (
                            <div key={cat} className="flex items-center space-x-2 mb-1">
                                <Checkbox id={`cat-${cat}`} checked={selectedCategories.includes(cat)} onCheckedChange={() => toggleSelection(selectedCategories, cat, setSelectedCategories)} />
                                <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer flex-1 min-w-0 break-words">{cat}</Label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
                <div>
                    <Label className="text-sm font-medium mb-2 block">Task Statuses</Label>
                     <ScrollArea className="h-40 w-full rounded-md border p-2 bg-background">
                        {allResolutionStatuses.map(stat => (
                            <div key={stat} className="flex items-center space-x-2 mb-1">
                                <Checkbox id={`stat-${stat}`} checked={selectedStatuses.includes(stat)} onCheckedChange={() => toggleSelection(selectedStatuses, stat, setSelectedStatuses)} />
                                <Label htmlFor={`stat-${stat}`} className="text-sm font-normal cursor-pointer">{stat}</Label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
                 <div>
                    <Label className="text-sm font-medium mb-2 block">Responsible Roles</Label>
                     <ScrollArea className="h-40 w-full rounded-md border p-2 bg-background">
                        {allMockRoles.map(role => (
                            <div key={role} className="flex items-center space-x-2 mb-1">
                                <Checkbox id={`role-${role}`} checked={selectedRoles.includes(role)} onCheckedChange={() => toggleSelection(selectedRoles, role, setSelectedRoles)} />
                                <Label htmlFor={`role-${role}`} className="text-sm font-normal cursor-pointer">{role}</Label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
                <div>
                    <Label className="text-sm font-medium mb-2 block">Task Frequencies</Label>
                     <ScrollArea className="h-40 w-full rounded-md border p-2 bg-background">
                        {allTaskFrequencies.map(freq => (
                            <div key={freq} className="flex items-center space-x-2 mb-1">
                                <Checkbox id={`freq-${freq}`} checked={selectedFrequencies.includes(freq)} onCheckedChange={() => toggleSelection(selectedFrequencies, freq, setSelectedFrequencies)} />
                                <Label htmlFor={`freq-${freq}`} className="text-sm font-normal cursor-pointer flex items-center gap-1.5">
                                  <Repeat className="h-3 w-3 text-muted-foreground" /> {freq}
                                </Label>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
          </div>


          <div className="flex justify-end mt-8">
            <Button onClick={handleGenerateReport} size="lg" disabled={!reportType || !activeDateRange?.from || !activeDateRange?.to}>
              <Download className="mr-2 h-5 w-5" /> Generate Report
            </Button>
          </div>

          <div className="mt-8 p-6 border rounded-lg bg-muted/30 min-h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>Select criteria and click "Generate Report".</p>
              <p className="text-xs">Report details will be logged to the console.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

