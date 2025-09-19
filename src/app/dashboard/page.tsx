"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Task } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { groupBy } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TaskCard from '@/components/dashboard/task-card';
import TaskDetailsDialog from '@/components/dashboard/task-details-dialog';
import AttachEvidenceDialog from '@/components/dashboard/attach-evidence-dialog';
import DashboardFilters from '@/components/dashboard/dashboard-filters';
import { allTaskCategories, allResolutionStatuses, allAppRoles, allTaskFrequencies, allMockComplianceChapters } from '@/lib/mock-data';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [taskForEvidence, setTaskForEvidence] = useState<Task | null>(null);
  
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate_asc');


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tasksResponse = await fetch('/api/tasks');
        if (!tasksResponse.ok) throw new Error(`Failed to fetch tasks: ${tasksResponse.statusText}`);
        
        const tasksData: any[] = await tasksResponse.json();
        
        const processDate = (date: any) => (date ? parseISO(date) : null);
        
        const processedTasks: Task[] = tasksData.map(item => ({
          ...item,
          startDate: processDate(item.startDate),
          endDate: processDate(item.endDate),
          lastCompletedOn: processDate(item.lastCompletedOn),
          activities: item.activities?.map((act: any) => ({ ...act, timestamp: processDate(act.timestamp) })) || [],
        }));
        
        setTasks(processedTasks);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Tasks",
          description: error instanceof Error ? error.message : "Could not load task data.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);
  
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
    toast({ title: "Task Updated", description: `Task "${updatedTask.name}" has been saved.` });
    handleCloseDetails();
  };

  const handleOpenAttachEvidence = (task: Task) => {
    setTaskForEvidence(task);
    setIsEvidenceOpen(true);
  };

  const handleCloseAttachEvidence = () => {
    setIsEvidenceOpen(false);
    setTaskForEvidence(null);
  };

  const handleSaveEvidence = (taskId: string, evidenceLink: string) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, evidenceLink } : t));
    toast({ title: "Evidence Saved", description: "The evidence link has been updated." });
    handleCloseAttachEvidence();
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task => task.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(task => {
          if (key === 'careFlag') {
            return task.residentCareFlags?.includes(filters[key]);
          }
          return (task as any)[key] === filters[key];
        });
      }
    });

    // Sorting logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'dueDate_asc': return (a.endDate?.getTime() || 0) - (b.endDate?.getTime() || 0);
        case 'dueDate_desc': return (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0);
        case 'status': return a.status.localeCompare(b.status);
        case 'progress_desc': return b.progress - a.progress;
        case 'progress_asc': return a.progress - b.progress;
        case 'frequency': return a.frequency.localeCompare(b.frequency);
        default: return 0;
      }
    });

    return filtered;
  }, [tasks, searchTerm, filters, sortBy]);

  const groupedTasks = useMemo(() => groupBy(filteredAndSortedTasks, 'category'), [filteredAndSortedTasks]);
  const defaultOpenAccordions = useMemo(() => Object.keys(groupedTasks), [groupedTasks]);


  if (loading) {
    return (
       <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full lg:col-span-2" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <DashboardFilters 
            onSearch={setSearchTerm}
            onFilterChange={setFilters}
            onSortChange={setSortBy}
            onExportReport={() => console.log("Exporting Task Report")}
            onExportAuditLog={() => console.log("Exporting Audit Log")}
            onExportSurveyPrepPacket={() => console.log("Exporting Survey Prep Packet")}
            categories={allTaskCategories}
            statuses={allResolutionStatuses}
            roles={allAppRoles}
            frequencies={allTaskFrequencies}
            complianceChapterTags={allMockComplianceChapters}
        />
        
        <Accordion type="multiple" defaultValue={defaultOpenAccordions} className="w-full space-y-4">
            {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                <AccordionItem value={category} key={category} className="border bg-card rounded-lg shadow-sm">
                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                    {category} ({categoryTasks.length})
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categoryTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onOpenDetails={handleOpenDetails}
                                onOpenAttachEvidence={handleOpenAttachEvidence}
                            />
                        ))}
                    </div>
                </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>

      <TaskDetailsDialog
        task={selectedTask}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onSave={handleSaveTask}
        onOpenAttachEvidence={handleOpenAttachEvidence}
      />
      <AttachEvidenceDialog
        task={taskForEvidence}
        isOpen={isEvidenceOpen}
        onClose={handleCloseAttachEvidence}
        onSaveEvidence={handleSaveEvidence}
      />
    </div>
  );
}
