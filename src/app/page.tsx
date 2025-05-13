
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import TaskCard from '@/components/dashboard/task-card';
import TaskDetailsDialog from '@/components/dashboard/task-details-dialog';
import DashboardFilters from '@/components/dashboard/dashboard-filters';
import { mockTasks } from '@/lib/mock-data';
import type { Task, TaskCategory, TaskStatus, Role } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const uniqueCategories = Array.from(new Set(mockTasks.map(task => task.category))) as TaskCategory[];
const uniqueStatuses = Array.from(new Set(mockTasks.map(task => task.status))) as TaskStatus[];
const uniqueRoles = Array.from(new Set(mockTasks.map(task => task.responsibleRole))) as Role[];


export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Partial<{ category: TaskCategory; status: TaskStatus; role: Role }>>({});
  const [sortBy, setSortBy] = useState<string>('dueDate_asc');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setTasks(mockTasks);
  }, []);

  const handleSearch = (term: string) => setSearchTerm(term.toLowerCase());
  const handleFilterChange = (newFilters: Partial<{ category: TaskCategory; status: TaskStatus; role: Role }>) => {
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
      variant: "default", 
    });
    // In a real app, you'd send this to a server
    // For now, just update local state
  };

  const handleExport = () => {
    // Basic CSV export
    const headers = ["ID", "Name", "Category", "Frequency", "Responsible Role", "Status", "Progress", "Assigned Staff", "Validator", "Start Date", "End Date", "Deliverables", "Notes"];
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
      task.startDate.toISOString(),
      task.endDate ? task.endDate.toISOString() : '',
      task.deliverables,
      task.notes,
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Report Exported", description: "Task report has been downloaded as CSV." });
  };

  const filteredAndSortedTasks = useMemo(() => {
    let currentTasks = tasks
      .filter(task => task.name.toLowerCase().includes(searchTerm))
      .filter(task => !filters.category || filters.category === 'all' || task.category === filters.category)
      .filter(task => !filters.status || filters.status === 'all' || task.status === filters.status)
      .filter(task => !filters.role || filters.role === 'all' || task.responsibleRole === filters.role);

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
      default:
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
        onExport={handleExport}
        categories={uniqueCategories}
        statuses={uniqueStatuses}
        roles={uniqueRoles}
      />

      {filteredAndSortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedTasks.map(task => (
            <TaskCard key={task.id} task={task} onOpenDetails={handleOpenDetails} />
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
      />
    </div>
  );
}
