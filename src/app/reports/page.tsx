
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart3, CalendarIcon, Download, Filter, FileText, Repeat } from "lucide-react";
import { format } from "date-fns";
import { allTaskCategories, allResolutionStatuses, allMockRoles, allTaskFrequencies } from '@/lib/mock-data'; 
import type { TaskCategory, ResolutionStatus, Role, TaskFrequency } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function ReportsPage() {
  const [reportType, setReportType] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedCategories, setSelectedCategories] = useState<TaskCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ResolutionStatus[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<TaskFrequency[]>([]);


  const handleGenerateReport = () => {
    console.log("Generating report with criteria:", {
      reportType,
      dateRange,
      selectedCategories,
      selectedStatuses,
      selectedRoles,
      selectedFrequencies,
    });
    // This is a placeholder. Actual report generation would involve:
    // 1. Fetching `mockTasks` (or real data).
    // 2. Filtering tasks based on selected criteria.
    // 3. Formatting data into CSV or preparing for PDF generation.
    // 4. Triggering download.
    alert("Report generation initiated (see console for criteria). This is a placeholder for actual report generation logic. To implement, filter `mockTasks` based on state and generate a CSV.");
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border rounded-lg bg-muted/30">
            <div>
              <Label htmlFor="reportType" className="text-sm font-medium">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="reportType" className="mt-1">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task_resolution">Task Resolution Summary</SelectItem>
                  <SelectItem value="escalated_tasks">Escalated Tasks Report</SelectItem>
                  <SelectItem value="staff_activity">Staff Activity Overview</SelectItem>
                  <SelectItem value="compliance_snapshot">Compliance Snapshot</SelectItem>
                  <SelectItem value="frequency_analysis">Task Frequency Analysis</SelectItem>
                  <SelectItem value="full_task_export">Full Task Export</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Date Range (for Last Resolved On)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
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
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-4 p-6 border rounded-lg bg-muted/30">
             <h3 className="text-lg font-semibold flex items-center gap-2"><Filter className="h-5 w-5 text-muted-foreground" /> Filter Criteria</h3>
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
            <Button onClick={handleGenerateReport} size="lg" disabled={!reportType}>
              <Download className="mr-2 h-5 w-5" /> Generate Report
            </Button>
          </div>

          <div className="mt-8 p-6 border rounded-lg bg-muted/30 min-h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>Generated report will appear here once implemented.</p>
              <p className="text-xs">Select criteria and click "Generate Report".</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
