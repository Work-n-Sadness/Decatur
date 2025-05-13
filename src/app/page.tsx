
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import TaskCard from '@/components/dashboard/task-card';
import TaskDetailsDialog from '@/components/dashboard/task-details-dialog';
import AttachEvidenceDialog from '@/components/dashboard/attach-evidence-dialog';
import DashboardFilters from '@/components/dashboard/dashboard-filters';
import { mockTasks, allMockRoles, allMockComplianceChapters } from '@/lib/mock-data';
import type { Task, TaskCategory, TaskStatus, Role, TaskFrequency } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

const uniqueCategories = Array.from(new Set(mockTasks.map(task => task.category))) as TaskCategory[];
const uniqueStatuses = Array.from(new Set(mockTasks.map(task => task.status))) as TaskStatus[];
const uniqueRoles = allMockRoles; // Use all defined roles for filter
const allFrequencies: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Mid Yearly', 'Annually', 'Bi-annually', 'As Needed'];
const uniqueComplianceChapterTags = allMockComplianceChapters;

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Partial<{ category: TaskCategory; status: TaskStatus; role: Role; frequency: TaskFrequency; complianceChapterTag: string }>>({});
  const [sortBy, setSortBy] = useState<string>('dueDate_asc');
  
  const [isAttachEvidenceDialogOpen, setIsAttachEvidenceDialogOpen] = useState(false);
  const [selectedTaskForEvidence, setSelectedTaskForEvidence] = useState<Task | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const handleSearch = (term: string) => setSearchTerm(term.toLowerCase());
  const handleFilterChange = (newFilters: Partial<{ category: TaskCategory; status: TaskStatus; role: Role; frequency: TaskFrequency; complianceChapterTag: string }>) => {
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

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    toast({
      title: "Task Updated",
      description: `Task "${updatedTask.name}" has been saved successfully.`,
    });
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
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, evidenceLink: evidenceLink || undefined } : task
      )
    );
    toast({
      title: "Evidence Link Saved",
      description: `Evidence link for task has been updated.`,
    });
    handleCloseAttachEvidenceDialog();
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? {...prev, evidenceLink: evidenceLink || undefined} : null);
    }
  };

  const handleExportReport = () => {
    const headers = ["ID", "Name", "Category", "Frequency", "Responsible Role", "Status", "Progress", "Assigned Staff", "Validator Role", "Start Date", "End Date", "Deliverables", "Notes", "Evidence Link", "Last Completed On", "Completed By", "Validator Approval", "Compliance Chapter"];
    const rows = filteredAndSortedTasks.map(task => [
      task.id,
      task.name,
      task.category,
      task.frequency,
      task.responsibleRole,
      task.status,
      task.progress,
      task.assignedStaff,
      task.validator,
      task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd HH:mm') : '',
      task.endDate ? format(new Date(task.endDate), 'yyyy-MM-dd HH:mm') : '',
      task.deliverables,
      task.notes,
      task.evidenceLink || '',
      task.lastCompletedOn ? format(new Date(task.lastCompletedOn), 'yyyy-MM-dd HH:mm') : '',
      task.completedBy || '',
      task.validatorApproval || '',
      task.complianceChapterTag || '',
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')); // Escape quotes and wrap in quotes
    
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
      "Task ID", "Task Name", "Category", "Frequency", "Responsible Role", "Assigned Staff", 
      "Validator Role", "Initial Start Date", "Initial End Date", "Current Status", "Progress", 
      "Last Completed On", "Completed By", "Validator Approval", "Compliance Chapter", 
      "Activity Timestamp", "Activity User", "Activity Action", "Activity Details"
    ];
    
    let rows: string[] = [];

    filteredAndSortedTasks.forEach(task => {
      const commonTaskData = [
        task.id, task.name, task.category, task.frequency, task.responsibleRole, task.assignedStaff,
        task.validator,
        task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd HH:mm') : '',
        task.endDate ? format(new Date(task.endDate), 'yyyy-MM-dd HH:mm') : '',
        task.status, task.progress,
        task.lastCompletedOn ? format(new Date(task.lastCompletedOn), 'yyyy-MM-dd HH:mm') : '',
        task.completedBy || '',
        task.validatorApproval || '',
        task.complianceChapterTag || ''
      ];

      if (task.activities && task.activities.length > 0) {
        task.activities.forEach(activity => {
          const activityData = [
            activity.timestamp ? format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm') : '',
            activity.user,
            activity.action,
            activity.details
          ];
          rows.push([...commonTaskData, ...activityData].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));
        });
      } else {
        // Task with no activities, still list it with empty activity fields
        rows.push([...commonTaskData, '', '', '', ''].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));
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


  const filteredAndSortedTasks = useMemo(() => {
    let currentTasks = tasks
      .filter(task => task.name.toLowerCase().includes(searchTerm))
      .filter(task => !filters.category || filters.category === 'all' || task.category === filters.category)
      .filter(task => !filters.status || filters.status === 'all' || task.status === filters.status)
      .filter(task => !filters.role || filters.role === 'all' || task.responsibleRole === filters.role)
      .filter(task => !filters.frequency || filters.frequency === 'all' || task.frequency === filters.frequency)
      .filter(task => !filters.complianceChapterTag || filters.complianceChapterTag === 'all' || task.complianceChapterTag === filters.complianceChapterTag);


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
        currentTasks.sort((a,b) => a.status.localeCompare(b.status));
        break;
      case 'progress_asc':
        currentTasks.sort((a,b) => a.progress - b.progress);
        break;
      case 'progress_desc':
        currentTasks.sort((a,b) => b.progress - a.progress);
        break;
      case 'frequency':
        const frequencyOrder: TaskFrequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Mid Yearly', 'Annually', 'Bi-annually', 'As Needed'];
        currentTasks.sort((a,b) => frequencyOrder.indexOf(a.frequency) - frequencyOrder.indexOf(b.frequency));
        break;
      default:
        // Default sort by due date ascending
        currentTasks.sort((a, b) => (a.endDate ? new Date(a.endDate).getTime() : Infinity) - (b.endDate ? new Date(b.endDate).getTime() : Infinity));
        break;
    }
    return currentTasks;
  }, [tasks, searchTerm, filters, sortBy]);

  return (
    <div className="space-y-6">
      <DashboardFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onExportReport={handleExportReport}
        onExportAuditLog={handleExportAuditLog}
        categories={uniqueCategories}
        statuses={uniqueStatuses}
        roles={uniqueRoles}
        frequencies={allFrequencies} 
        complianceChapterTags={uniqueComplianceChapterTags}
      />

      {filteredAndSortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onOpenDetails={handleOpenDetails}
              onOpenAttachEvidence={handleOpenAttachEvidence}
            />
          ))}
        </div>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Tasks Found</AlertTitle>
          <AlertDescription>
            No tasks match your current search and filter criteria. Try adjusting your filters.
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

