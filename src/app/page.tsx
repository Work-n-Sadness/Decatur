
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import TaskCard from '@/components/dashboard/task-card';
import TaskDetailsDialog from '@/components/dashboard/task-details-dialog';
import AttachEvidenceDialog from '@/components/dashboard/attach-evidence-dialog';
import DashboardFilters from '@/components/dashboard/dashboard-filters';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import { mockTasks, allMockRoles, allMockComplianceChapters, allTaskCategories, allResolutionStatuses, allTaskFrequencies, allMockStaffNames, allCareFlags } from '@/lib/mock-data';
import type { Task, TaskCategory, ResolutionStatus, Role, TaskFrequency, ActivityLog, ResidentCareFlag } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getTaskCategoryIcon } from '@/components/icons';
import { Info, Image as ImageIcon } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import Image from 'next/image'; 

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Partial<{ 
    category: TaskCategory; 
    status: ResolutionStatus; 
    role: Role; 
    frequency: TaskFrequency; 
    complianceChapterTag: string;
    careFlag: ResidentCareFlag; // Added careFlag to filters
  }>>({});
  const [sortBy, setSortBy] = useState<string>('dueDate_asc');
  
  const [isAttachEvidenceDialogOpen, setIsAttachEvidenceDialogOpen] = useState(false);
  const [selectedTaskForEvidence, setSelectedTaskForEvidence] = useState<Task | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    setTasks(mockTasks.map(task => ({ 
      ...task, 
      activities: task.activities || [],
      startDate: typeof task.startDate === 'string' ? parseISO(task.startDate) : task.startDate,
      endDate: task.endDate && typeof task.endDate === 'string' ? parseISO(task.endDate) : task.endDate,
      lastCompletedOn: task.lastCompletedOn && typeof task.lastCompletedOn === 'string' ? parseISO(task.lastCompletedOn) : task.lastCompletedOn,
    })));
  }, []);

  const handleSearch = (term: string) => setSearchTerm(term.toLowerCase());
  const handleFilterChange = (newFilters: Partial<{ 
    category: TaskCategory; 
    status: ResolutionStatus; 
    role: Role; 
    frequency: TaskFrequency; 
    complianceChapterTag: string;
    careFlag: ResidentCareFlag;
   }>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  const handleSortChange = (newSortBy: string) => setSortBy(newSortBy);

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (updatedTaskFromDialog: Task) => {
    let taskToProcess = { ...updatedTaskFromDialog };
    const originalTaskState = tasks.find(t => t.id === taskToProcess.id);
  
    const baseActivities = originalTaskState?.activities || [];
    let newActivities: ActivityLog[] = [...baseActivities];

    // Log status change if it occurred and it's not just a general save on a resolved task
    if (originalTaskState && originalTaskState.status !== taskToProcess.status) {
      newActivities.push({
        timestamp: new Date(),
        user: taskToProcess.assignedStaff || 'System', // Use assigned staff or a system user
        action: `Status Change: ${originalTaskState.status} -> ${taskToProcess.status}`,
        details: `Task status updated to ${taskToProcess.status}.`,
      });
    }
    
    const isResolvingNow = taskToProcess.status === 'Resolved' && originalTaskState?.status !== 'Resolved';
  
    if (isResolvingNow) {
      taskToProcess.lastCompletedOn = taskToProcess.lastCompletedOn || new Date(); 
      taskToProcess.completedBy = taskToProcess.completedBy || taskToProcess.assignedStaff;
      taskToProcess.progress = 100;
      
      // Check if this activity was already added by the dialog logic. Avoid duplicates.
      const existingResolveActivity = newActivities.find(act => act.action === 'Task Resolved' && act.user === taskToProcess.assignedStaff);
      if (!existingResolveActivity) {
        newActivities.push({
          timestamp: taskToProcess.lastCompletedOn,
          user: taskToProcess.completedBy, 
          action: 'Task Resolved',
          details: `Task marked as resolved. Progress set to 100%.`,
        });
      }
      
      toast({
        title: "Task Resolved",
        description: `"${taskToProcess.name}" has been successfully resolved.`,
      });

    } else if (taskToProcess.status === 'Resolved' && originalTaskState?.status === 'Resolved') {
       // If it was already resolved, just a general update. Ensure progress is 100.
       taskToProcess.progress = 100;
       toast({
          title: "Task Updated",
          description: `Task "${originalTaskState?.name || taskToProcess.name}" details saved.`,
        });
    } else if (originalTaskState?.status === 'Resolved' && taskToProcess.status !== 'Resolved') {
        // Task moved from Resolved to another status
        taskToProcess.lastCompletedOn = null;
        taskToProcess.completedBy = null;
        // Optionally adjust progress here if needed, e.g., taskToProcess.progress = 0;
        const existingUnresolveActivity = newActivities.find(act => act.action === 'Task Un-Resolved');
        if (!existingUnresolveActivity) {
           newActivities.push({
            timestamp: new Date(),
            user: taskToProcess.assignedStaff,
            action: 'Task Un-Resolved',
            details: `Task status changed from Resolved to ${taskToProcess.status}. Resolution details cleared.`,
          });
        }
        toast({
          title: "Task Status Updated",
          description: `Task "${taskToProcess.name}" is no longer resolved. Status: ${taskToProcess.status}.`,
        });
    } else { 
       // For other statuses or general updates
       toast({
          title: "Task Updated",
          description: `Task "${taskToProcess.name}" has been saved successfully.`,
        });
    }
    
    taskToProcess.activities = newActivities;
    setTasks(prevTasks => prevTasks.map(t => (t.id === taskToProcess.id ? taskToProcess : t)));
    
    if (selectedTask && selectedTask.id === taskToProcess.id) {
      setSelectedTask(taskToProcess);
    }
  };

  const handleOpenAttachEvidence = (task: Task) => {
    setSelectedTaskForEvidence(task);
    setIsAttachEvidenceDialogOpen(true);
  };

  const handleCloseAttachEvidenceDialog = () => {
    setIsAttachEvidenceDialogOpen(false);
    setSelectedTaskForEvidence(null);
  };

  const handleSaveEvidenceLink = (taskId: string, evidenceLink: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, evidenceLink: evidenceLink || undefined, activities: [...(task.activities || []), { timestamp: new Date(), user: task.assignedStaff || 'System', action: 'Evidence Updated', details: `Evidence link ${evidenceLink ? 'added/updated' : 'removed'}.`}] } : task
      )
    );
    toast({
      title: "Evidence Link Saved",
      description: `Evidence link for task has been updated.`,
    });
    handleCloseAttachEvidenceDialog();
    // If the detailed dialog is open for this task, update its state too
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {...prev, evidenceLink: evidenceLink || undefined} : null);
    }
  };

  const escapeCsvField = (field: any): string => {
    const stringField = String(field === null || field === undefined ? '' : field);
    return `"${stringField.replace(/"/g, '""')}"`;
  };

  const handleExportReport = () => {
    const headers = ["ID", "Name", "Category", "Frequency", "Responsible Role(s)", "Status", "Progress (%)", "Assigned Staff", "Validator", "Start Date", "End Date", "Due Time", "Deliverables", "Notes", "Evidence Link", "Last Resolved On", "Resolved By", "Validator Approval", "Compliance Chapter", "Care Flags"];
    const rows = filteredAndSortedTasks.map(task => [
      task.id,
      task.name,
      task.category,
      task.frequency,
      Array.isArray(task.responsibleRole) ? task.responsibleRole.join('; ') : task.responsibleRole,
      task.status,
      task.progress,
      task.assignedStaff,
      task.validator,
      task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd HH:mm') : '',
      task.endDate ? format(new Date(task.endDate), 'yyyy-MM-dd HH:mm') : '',
      task.time || '',
      task.deliverables,
      task.notes,
      task.evidenceLink || '',
      task.lastCompletedOn ? format(new Date(task.lastCompletedOn), 'yyyy-MM-dd HH:mm') : '',
      task.completedBy || '',
      task.validatorApproval || '',
      task.complianceChapterTag || '',
      task.residentCareFlags ? task.residentCareFlags.join('; ') : '',
    ].map(escapeCsvField).join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Task Report Exported", description: "Task report has been downloaded as CSV." });
  };

  const handleExportAuditLog = () => {
    const headers = [
      "Task ID", "Task Name", "Category", "Frequency", "Responsible Role(s)", "Assigned Staff", 
      "Validator Role", "Initial Start Date", "Initial End Date", "Current Status", "Progress (%)", 
      "Last Resolved On", "Resolved By", "Validator Approval", "Compliance Chapter", "Care Flags",
      "Activity Timestamp", "Activity User", "Activity Action", "Activity Details"
    ];
    
    let rows: string[] = [];

    filteredAndSortedTasks.forEach(task => {
      const commonTaskData = [
        task.id, task.name, task.category, task.frequency, 
        Array.isArray(task.responsibleRole) ? task.responsibleRole.join('; ') : task.responsibleRole, 
        task.assignedStaff,
        task.validator,
        task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd HH:mm') : '',
        task.endDate ? format(new Date(task.endDate), 'yyyy-MM-dd HH:mm') : '',
        task.status, task.progress,
        task.lastCompletedOn ? format(new Date(task.lastCompletedOn), 'yyyy-MM-dd HH:mm') : '',
        task.completedBy || '', 
        task.validatorApproval || '',
        task.complianceChapterTag || '',
        task.residentCareFlags ? task.residentCareFlags.join('; ') : '',
      ];

      if (task.activities && task.activities.length > 0) {
        task.activities.forEach(activity => {
          const activityData = [
            activity.timestamp ? format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm:ss') : '', 
            activity.user,
            activity.action,
            activity.details
          ];
          rows.push([...commonTaskData, ...activityData].map(escapeCsvField).join(','));
        });
      } else {
        // Add task even if no activities, with empty activity fields
        rows.push([...commonTaskData, '', '', '', ''].map(escapeCsvField).join(','));
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks_audit_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Audit Log Exported", description: "Task audit log has been downloaded as CSV." });
  };

  const handleExportSurveyPrepPacket = () => {
    const headers = [
      "Task ID", "Task Name", "Category", "Frequency", "Responsible Role(s)", "Assigned Staff", 
      "Validator", "Status", "Progress (%)", "Start Date", "End Date", "Due Time",
      "Deliverables", "Notes", "Evidence Link", "Last Resolved On", "Resolved By", 
      "Validator Approval", "Compliance Chapter", "Care Flags", "Activities Log (JSON)"
    ];
    const rows = filteredAndSortedTasks.map(task => [
      task.id,
      task.name,
      task.category,
      task.frequency,
      Array.isArray(task.responsibleRole) ? task.responsibleRole.join('; ') : task.responsibleRole,
      task.assignedStaff,
      task.validator || '',
      task.status,
      task.progress,
      task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd HH:mm') : '',
      task.endDate ? format(new Date(task.endDate), 'yyyy-MM-dd HH:mm') : '',
      task.time || '',
      task.deliverables,
      task.notes,
      task.evidenceLink || '',
      task.lastCompletedOn ? format(new Date(task.lastCompletedOn), 'yyyy-MM-dd HH:mm') : '',
      task.completedBy || '',
      task.validatorApproval || '',
      task.complianceChapterTag || '',
      task.residentCareFlags ? task.residentCareFlags.join('; ') : '',
      JSON.stringify(task.activities?.map(act => ({ ...act, timestamp: act.timestamp ? format(new Date(act.timestamp), 'yyyy-MM-dd HH:mm:ss') : ''})) || [])
    ].map(escapeCsvField).join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "survey_prep_packet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Survey Prep Packet Exported", description: "Survey prep packet has been downloaded as CSV." });
  };


  const filteredAndSortedTasks = useMemo(() => {
    let currentTasks = tasks
      .filter(task => task.name.toLowerCase().includes(searchTerm))
      .filter(task => !filters.category || filters.category === 'all' || task.category === filters.category)
      .filter(task => !filters.status || filters.status === 'all' || task.status === filters.status)
      .filter(task => !filters.role || filters.role === 'all' || (Array.isArray(task.responsibleRole) ? task.responsibleRole.includes(filters.role as Role) : task.responsibleRole === filters.role))
      .filter(task => !filters.frequency || filters.frequency === 'all' || task.frequency === filters.frequency)
      .filter(task => !filters.complianceChapterTag || filters.complianceChapterTag === 'all' || task.complianceChapterTag === filters.complianceChapterTag)
      .filter(task => !filters.careFlag || filters.careFlag === 'all' || (task.residentCareFlags && task.residentCareFlags.includes(filters.careFlag)));


    switch (sortBy) {
      case 'name_asc':
        currentTasks.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        currentTasks.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'dueDate_asc':
        currentTasks.sort((a, b) => (a.endDate ? new Date(a.endDate).getTime() : Infinity) - (b.endDate ? new Date(b.endDate).getTime() : Infinity));
        break;
      case 'dueDate_desc':
        currentTasks.sort((a, b) => (b.endDate ? new Date(b.endDate).getTime() : -Infinity) - (a.endDate ? new Date(a.endDate).getTime() : -Infinity));
        break;
      case 'status':
        const statusOrder: ResolutionStatus[] = ['Escalated', 'Pending', 'Resolved'];
        currentTasks.sort((a,b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
        break;
      case 'progress_asc':
        currentTasks.sort((a,b) => (a.progress || 0) - (b.progress || 0));
        break;
      case 'progress_desc':
        currentTasks.sort((a,b) => (b.progress || 0) - (a.progress || 0));
        break;
      case 'frequency':
        const frequencyOrder: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Mid Yearly', 'Annually', 'Bi-annually', 'As Needed'];
        currentTasks.sort((a,b) => frequencyOrder.indexOf(a.frequency) - frequencyOrder.indexOf(b.frequency));
        break;
      default: // Default to due date ascending
        currentTasks.sort((a, b) => (a.endDate ? new Date(a.endDate).getTime() : Infinity) - (b.endDate ? new Date(b.endDate).getTime() : Infinity));
        break;
    }
    return currentTasks;
  }, [tasks, searchTerm, filters, sortBy]);

  const groupedTasks = useMemo(() => {
    return allTaskCategories.map(category => ({
      category,
      tasks: filteredAndSortedTasks.filter(task => task.category === category),
    })).filter(group => group.tasks.length > 0 || (!filters.category || filters.category === 'all' || filters.category === group.category));
  }, [filteredAndSortedTasks, filters.category]);

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ImageIcon className="h-6 w-6" />
            Facility Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Facility Exterior"
              width={600}
              height={400}
              className="object-cover w-full h-full"
              data-ai-hint="facility building"
              priority 
            />
          </div>
        </CardContent>
      </Card>
      <DashboardFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onExportReport={handleExportReport}
        onExportAuditLog={handleExportAuditLog}
        onExportSurveyPrepPacket={handleExportSurveyPrepPacket}
        categories={allTaskCategories}
        statuses={allResolutionStatuses}
        roles={allMockRoles}
        frequencies={allTaskFrequencies} 
        complianceChapterTags={allMockComplianceChapters}
      />

      {filteredAndSortedTasks.length > 0 ? (
        <Accordion type="multiple" defaultValue={allTaskCategories} className="w-full space-y-4">
          {groupedTasks.map(({ category, tasks: categoryTasks }) => {
            if (categoryTasks.length === 0 && filters.category && filters.category !== 'all' && filters.category !== category) return null;

            const CategoryIcon = getTaskCategoryIcon(category);
            return (
              <AccordionItem value={category} key={category} className="border rounded-lg overflow-hidden bg-card shadow-sm">
                <AccordionTrigger className="bg-muted/50 hover:bg-muted/80 px-4 py-3 text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-6 w-6 text-accent" />
                    {category} ({categoryTasks.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-background">
                  {categoryTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                      {categoryTasks.map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onOpenDetails={handleOpenDetails}
                          onOpenAttachEvidence={handleOpenAttachEvidence}
                        />
                      ))}
                    </div>
                  ) : (
                     <div className="text-center py-4 text-muted-foreground">No tasks match current filters for this category.</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Tasks Found</AlertTitle>
          <AlertDescription>
            No tasks match your current search and filter criteria. Try adjusting your filters or view all tasks.
          </AlertDescription>
        </Alert>
      )}

      <TaskDetailsDialog
        task={selectedTask}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onSave={handleSaveTask}
        onOpenAttachEvidence={handleOpenAttachEvidence}
      />
      <AttachEvidenceDialog
        task={selectedTaskForEvidence}
        isOpen={isAttachEvidenceDialogOpen}
        onClose={handleCloseAttachEvidenceDialog}
        onSaveEvidence={handleSaveEvidenceLink}
      />
    </div>
  );
}
