
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, Timestamp, query, orderBy, where, getDocs, writeBatch, limit } from 'firebase/firestore';
import type { ChecklistItem, ResolutionStatus, RecurringTask } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Filter, Paperclip, RefreshCw, Save, Upload, AlertCircle, Edit3, Clock, ExternalLink, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid as isValidDate, isToday, differenceInCalendarDays } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';

const CHECKLIST_STATUSES: Extract<ResolutionStatus, 'Pending' | 'Complete' | 'Flagged'>[] = ['Pending', 'Complete', 'Flagged'];

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return <span className="text-sm font-medium">{format(time, 'PPpp')}</span>;
}

export default function ChecklistTable() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStaff, setFilterStaff] = useState('');
  const [filterValidator, setFilterValidator] = useState('');


  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<ChecklistItem | null>(null);
  const [currentEvidenceLink, setCurrentEvidenceLink] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');
  const [currentValidator, setCurrentValidator] = useState('');
  
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'checklists'), orderBy('dueDate', 'desc'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: ChecklistItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          ...data,
          dueDate: data.dueDate, // Keep as string YYYY-MM-DD
          createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date(data.createdAt),
          lastCompletedOn: (data.lastCompletedOn as Timestamp)?.toDate ? (data.lastCompletedOn as Timestamp).toDate() : null,
          statusUpdatedAt: (data.statusUpdatedAt as Timestamp)?.toDate ? (data.statusUpdatedAt as Timestamp).toDate() : null,
        } as ChecklistItem);
      });
      setChecklistItems(items);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching checklist items:", err);
      setError("Failed to load checklist items. Ensure Firestore is configured and you have an internet connection.");
      setLoading(false);
      toast({ variant: "destructive", title: "Error", description: "Could not load checklist items." });
    });

    return () => unsubscribe();
  }, [toast]);

  const handleStatusChange = async (itemId: string, newStatus: ChecklistItem['status']) => {
    const itemRef = doc(db, 'checklists', itemId);
    try {
      const updatePayload: Partial<ChecklistItem> = { 
        status: newStatus,
        statusUpdatedAt: Timestamp.now(),
      };
      if (newStatus === 'Complete') {
        updatePayload.lastCompletedOn = Timestamp.now();
        const item = checklistItems.find(i => i.id === itemId);
        updatePayload.completedBy = item?.assignedStaff || "System"; // Consider a more robust way to get current user
      } else if (newStatus !== 'Complete' && checklistItems.find(i => i.id === itemId)?.status === 'Complete') {
        updatePayload.lastCompletedOn = null;
        updatePayload.completedBy = null;
      }
      await updateDoc(itemRef, updatePayload as any); // Use `any` to bypass strict type checking for partial update if needed
      toast({ title: "Status Updated", description: `Task status changed to ${newStatus}.` });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const openEvidenceModal = (item: ChecklistItem) => {
    setSelectedItemForModal(item);
    setCurrentEvidenceLink(item.evidenceLink || '');
    setIsEvidenceModalOpen(true);
  };

  const handleSaveEvidence = async () => {
    if (!selectedItemForModal) return;
    const itemRef = doc(db, 'checklists', selectedItemForModal.id);
    try {
      await updateDoc(itemRef, { evidenceLink: currentEvidenceLink });
      toast({ title: "Evidence Link Saved", description: "Evidence link has been updated." });
      setIsEvidenceModalOpen(false);
      setSelectedItemForModal(null);
    } catch (err) {
      console.error("Error saving evidence link:", err);
      toast({ variant: "destructive", title: "Error", description: "Failed to save evidence link." });
    }
  };

  const openNotesModal = (item: ChecklistItem) => {
    setSelectedItemForModal(item);
    setCurrentNotes(item.notes || '');
    setCurrentValidator(item.validator || ''); // Also load validator for editing in notes modal for now
    setIsNotesModalOpen(true);
  };

  const handleSaveNotesAndValidator = async () => {
    if (!selectedItemForModal) return;
    const itemRef = doc(db, 'checklists', selectedItemForModal.id);
    try {
      await updateDoc(itemRef, { 
        notes: currentNotes,
        validator: currentValidator 
      });
      toast({ title: "Details Saved", description: "Notes and validator have been updated." });
      setIsNotesModalOpen(false);
      setSelectedItemForModal(null);
    } catch (err) {
      console.error("Error saving notes/validator:", err);
      toast({ variant: "destructive", title: "Error", description: "Failed to save notes/validator." });
    }
  };


  const filteredItems = useMemo(() => {
    return checklistItems.filter(item => {
      const dueDateObj = item.dueDate ? parseISO(item.dueDate) : null;
      const dateMatch = !filterDate || (dueDateObj && isValidDate(dueDateObj) && format(dueDateObj, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd'));
      const statusMatch = filterStatus === 'all' || item.status === filterStatus;
      const staffMatch = !filterStaff || (item.assignedStaff && item.assignedStaff.toLowerCase().includes(filterStaff.toLowerCase()));
      const validatorMatch = !filterValidator || (item.validator && item.validator.toLowerCase().includes(filterValidator.toLowerCase()));
      return dateMatch && statusMatch && staffMatch && validatorMatch;
    });
  }, [checklistItems, filterDate, filterStatus, filterStaff, filterValidator]);

  const getStatusBadgeVariant = (status: ChecklistItem['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Complete': return 'default';
      case 'Flagged': return 'destructive';
      default: return 'outline';
    }
  };
  
  const handleManualGenerate = async () => {
    toast({ title: "Manual Trigger", description: "Simulating task generation. Check Firestore and console."});
    console.log("Manual task generation process started...");

    try {
        const recurringTasksSnapshot = await getDocs(query(collection(db, 'recurringTasks')));
        if (recurringTasksSnapshot.empty) {
            toast({ title: "No recurring tasks found in DB", variant: "destructive" });
            console.log("No recurring tasks defined in Firestore 'recurringTasks' collection.");
            return;
        }

        const today = new Date();
        const batch = writeBatch(db);
        let tasksToCreateCount = 0;
        let tasksSkippedCount = 0;

        for (const docSnap of recurringTasksSnapshot.docs) {
            const taskData = docSnap.data() as RecurringTask;
            const taskId = docSnap.id;

            if (taskData.generateHistory && taskData.startDateForHistory) {
                let currentDate = parseISO(taskData.startDateForHistory);
                if (!isValidDate(currentDate)) {
                    console.warn(`Invalid startDateForHistory for ${taskData.taskName}: ${taskData.startDateForHistory}`);
                    continue;
                }
                
                console.log(`Processing history for ${taskData.taskName} from ${format(currentDate, 'yyyy-MM-dd')} to ${format(today, 'yyyy-MM-dd')}`);

                while (differenceInCalendarDays(currentDate, today) <= 0) {
                    const currentDayNameLoop = format(currentDate, 'EEEE'); // Full day name e.g. "Monday"
                    const loopDateString = format(currentDate, 'yyyy-MM-dd');
                    let shouldGenerateHistorical = false;

                    if (taskData.frequency === 'daily') {
                        shouldGenerateHistorical = true;
                    } else if (taskData.frequency === 'weekly' && taskData.recurrenceDays?.includes(currentDayNameLoop)) {
                        shouldGenerateHistorical = true;
                    } else if (taskData.frequency === 'monthly' && taskData.recurrenceDayOfMonth && currentDate.getDate() === taskData.recurrenceDayOfMonth) {
                        shouldGenerateHistorical = true;
                    }
                    
                    if (shouldGenerateHistorical) {
                        const checklistQueryHistorical = await getDocs(query(collection(db, 'checklists'),
                            where('taskId', '==', taskId),
                            where('dueDate', '==', loopDateString),
                            limit(1)
                        ));

                        if (checklistQueryHistorical.empty) {
                            const newChecklistItemRef = doc(collection(db, 'checklists'));
                            const isPastDate = differenceInCalendarDays(currentDate, today) < 0;
                            batch.set(newChecklistItemRef, {
                                taskName: taskData.taskName,
                                assignedStaff: taskData.assignedStaff,
                                validator: taskData.validator || null,
                                dueDate: loopDateString,
                                status: isPastDate ? 'Complete' : 'Pending',
                                createdAt: Timestamp.fromDate(currentDate),
                                statusUpdatedAt: Timestamp.fromDate(currentDate),
                                taskId: taskId,
                                notes: isPastDate ? 'Auto-completed during backfill.' : '',
                                evidenceLink: '',
                                lastCompletedOn: isPastDate ? Timestamp.fromDate(currentDate) : null,
                                completedBy: isPastDate ? 'System (Backfill)' : null,
                                category: taskData.category || null,
                                backfilled: true,
                            });
                            tasksToCreateCount++;
                            console.log(`Queued historical task: ${taskData.taskName} for ${loopDateString}`);
                        } else {
                            tasksSkippedCount++;
                            // console.log(`Skipped existing historical task: ${taskData.taskName} for ${loopDateString}`);
                        }
                    }
                    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
                }
            } else {
                // Regular generation for today if generateHistory is false or not set
                const currentDayName = format(today, 'EEEE');
                const todayDateString = format(today, 'yyyy-MM-dd');
                let shouldGenerateToday = false;
                if (taskData.frequency === 'daily') {
                    shouldGenerateToday = true;
                } else if (taskData.frequency === 'weekly' && taskData.recurrenceDays?.includes(currentDayName)) {
                    shouldGenerateToday = true;
                } else if (taskData.frequency === 'monthly' && taskData.recurrenceDayOfMonth && today.getDate() === taskData.recurrenceDayOfMonth) {
                    shouldGenerateToday = true;
                }

                if (shouldGenerateToday) {
                    const checklistQueryToday = await getDocs(query(collection(db, 'checklists'),
                        where('taskId', '==', taskId),
                        where('dueDate', '==', todayDateString),
                        limit(1)
                    ));
                    if (checklistQueryToday.empty) {
                        const newChecklistItemRef = doc(collection(db, 'checklists'));
                        batch.set(newChecklistItemRef, {
                            taskName: taskData.taskName,
                            assignedStaff: taskData.assignedStaff,
                            validator: taskData.validator || null,
                            dueDate: todayDateString,
                            status: 'Pending',
                            createdAt: Timestamp.now(),
                            statusUpdatedAt: Timestamp.now(),
                            taskId: taskId,
                            category: taskData.category || null,
                            backfilled: false,
                        });
                        tasksToCreateCount++;
                        console.log(`Queued task for today: ${taskData.taskName}`);
                    } else {
                        tasksSkippedCount++;
                    }
                }
            }
        }

        if (tasksToCreateCount > 0) {
            await batch.commit();
            toast({ title: "Success", description: `${tasksToCreateCount} checklist items were generated/queued.` });
            console.log(`Successfully created/queued ${tasksToCreateCount} new checklist items.`);
        } else {
            toast({ title: "No new tasks", description: "No new tasks were due for generation or they already exist." });
            console.log("No new tasks created. All due tasks may already exist.");
        }
        if (tasksSkippedCount > 0) {
             console.log(`Skipped ${tasksSkippedCount} tasks as they already existed for their respective due dates.`);
        }
        console.log("Manual task generation process finished.");

    } catch (e) {
        console.error("Error manually generating tasks:", e);
        toast({ title: "Manual Generation Error", description: String(e), variant: "destructive" });
    }
  };

  const handleExportToday = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const itemsToExport = checklistItems.filter(item => item.dueDate === todayStr);
    if (itemsToExport.length === 0) {
      toast({ title: "No Tasks Today", description: "No tasks are due today to export.", variant: "default" });
      return;
    }

    const headers = ["Task Name", "Assigned Staff", "Due Date", "Status", "Validator", "Last Completed", "Completed By", "Evidence Link", "Notes", "Category"];
    const rows = itemsToExport.map(item => [
      item.taskName,
      item.assignedStaff,
      item.dueDate,
      item.status,
      item.validator || 'N/A',
      item.lastCompletedOn && isValidDate(new Date(item.lastCompletedOn)) ? format(new Date(item.lastCompletedOn), 'PPp') : 'N/A',
      item.completedBy || 'N/A',
      item.evidenceLink || 'N/A',
      item.notes || 'N/A',
      item.category || 'N/A',
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `checklist_today_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export Successful", description: `Today's checklist exported as CSV.` });
  };


  if (loading) {
    return <div className="flex justify-center items-center h-32"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /> <span className="ml-2">Loading checklists...</span></div>;
  }

  if (error) {
    return <div className="text-destructive p-4 border border-destructive bg-destructive/10 rounded-md flex items-center"><AlertCircle className="h-5 w-5 mr-2"/> {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-card rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-xl font-semibold text-primary">Today’s Task Summary – {format(new Date(), 'MMMM dd, yyyy')}</h2>
                <p className="text-sm text-muted-foreground">Live view of automated checklist items.</p>
            </div>
            <div className="text-right">
                <LiveClock />
            </div>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <Label htmlFor="filter-date">Filter by Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 bg-background">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="filter-status">Filter by Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filter-status" className="mt-1 bg-background">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {CHECKLIST_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-staff">Filter by Staff</Label>
            <Input
              id="filter-staff"
              placeholder="Enter staff name..."
              value={filterStaff}
              onChange={(e) => setFilterStaff(e.target.value)}
              className="mt-1 bg-background"
            />
          </div>
           <div>
            <Label htmlFor="filter-validator">Filter by Validator</Label>
            <Input
              id="filter-validator"
              placeholder="Enter validator name..."
              value={filterValidator}
              onChange={(e) => setFilterValidator(e.target.value)}
              className="mt-1 bg-background"
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleManualGenerate} variant="outline" title="Manually simulate task generation (for testing)" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> Test Generate
            </Button>
            <Button onClick={handleExportToday} variant="outline" title="Export today's checklist to CSV" className="w-full">
                <FileText className="mr-2 h-4 w-4" /> Export Today
            </Button>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Assigned Staff</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Validator</TableHead>
              <TableHead>Last Completed / Updated</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? filteredItems.map((item) => {
              const dueDateObj = item.dueDate ? parseISO(item.dueDate) : null;
              const displayDueDate = dueDateObj && isValidDate(dueDateObj)
                ? isToday(dueDateObj) ? <span className="text-accent font-semibold">Today</span> : format(dueDateObj, 'PP')
                : 'N/A';
              
              let lastActionDate: Date | null = null;
              if (item.status === 'Complete' && item.lastCompletedOn && isValidDate(new Date(item.lastCompletedOn))) {
                  lastActionDate = new Date(item.lastCompletedOn);
              } else if (item.statusUpdatedAt && isValidDate(new Date(item.statusUpdatedAt))) {
                  lastActionDate = new Date(item.statusUpdatedAt);
              }


              return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.taskName}</TableCell>
                <TableCell>{item.assignedStaff}</TableCell>
                <TableCell>{displayDueDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell>{item.validator || 'N/A'}</TableCell>
                <TableCell>
                  {lastActionDate
                    ? `${format(lastActionDate, 'PPp')} ${item.status === 'Complete' && item.completedBy ? `by ${item.completedBy}` : ''}`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {item.evidenceLink ? (
                    <a href={item.evidenceLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center text-xs">
                      View <ExternalLink className="inline h-3 w-3 ml-1"/>
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.notes ? (
                     <span title={item.notes} className="truncate block max-w-[100px] text-xs">{item.notes}</span>
                  ) : <span className="text-xs text-muted-foreground">N/A</span>}
                </TableCell>
                <TableCell className="space-x-1 flex items-center">
                  <Select value={item.status} onValueChange={(newStatus) => handleStatusChange(item.id, newStatus as ChecklistItem['status'])}>
                    <SelectTrigger className="h-8 text-xs w-[100px] sm:w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHECKLIST_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                   <Button variant="outline" size="sm" onClick={() => openEvidenceModal(item)} className="h-8 px-2">
                    <Paperclip className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openNotesModal(item)} className="h-8 px-2">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            )}) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No checklist items found matching your criteria, or Firestore data is not yet available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={isEvidenceModalOpen} onOpenChange={setIsEvidenceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach/Edit Evidence Link</DialogTitle>
            <DialogDescription>For task: {selectedItemForModal?.taskName}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="evidence-link">Evidence URL</Label>
            <Input
              id="evidence-link"
              value={currentEvidenceLink}
              onChange={(e) => setCurrentEvidenceLink(e.target.value)}
              placeholder="https://example.com/evidence.pdf"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEvidenceModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEvidence}><Save className="mr-2 h-4 w-4" />Save Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes & Validator</DialogTitle>
            <DialogDescription>For task: {selectedItemForModal?.taskName}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="task-notes">Notes</Label>
              <Textarea
                id="task-notes"
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Enter notes for this task..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="task-validator">Validator</Label>
              <Input
                id="task-validator"
                value={currentValidator}
                onChange={(e) => setCurrentValidator(e.target.value)}
                placeholder="Enter validator name/role"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNotesAndValidator}><Save className="mr-2 h-4 w-4" />Save Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
