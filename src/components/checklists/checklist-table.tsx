
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { ChecklistItem, ResolutionStatus } from '@/types'; // Assuming Supabase client is set up here
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
import { format, parseISO, isValid as isValidDate, isToday, differenceInCalendarDays, startOfDay as dateFnsStartOfDay, isEqual as isEqualDate, isBefore } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
// No direct Supabase import here as data fetching is through API

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
    const fetchChecklistItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/checklists');
        if (!response.ok) {
          let errorDetails = `HTTP error ${response.status}`;
          if (response.statusText) {
            errorDetails += ` ${response.statusText}`;
          }
          try {
            const errorBody = await response.json();
            if (errorBody && errorBody.message) {
              errorDetails = `${errorDetails}: ${errorBody.message}`;
              if (errorBody.error) {
                errorDetails += ` (Server error: ${errorBody.error})`;
              }
            }
          } catch (e) {
            // Failed to parse JSON body, or no JSON body was sent
          }
          throw new Error(`Failed to fetch checklists. ${errorDetails}`);
        }
        const items: any[] = await response.json();
        
        const processedItems: ChecklistItem[] = items.map(item => ({
          ...item,
          // dueDate from API is already a string YYYY-MM-DD, but parseISO and startOfDay ensure it's a Date object for client logic
          dueDate: item.dueDate ? dateFnsStartOfDay(parseISO(item.dueDate)) : dateFnsStartOfDay(new Date()), 
          createdAt: item.createdAt ? parseISO(item.createdAt) : new Date(),
          lastCompletedOn: item.lastCompletedOn ? parseISO(item.lastCompletedOn) : null,
          statusUpdatedAt: item.statusUpdatedAt ? parseISO(item.statusUpdatedAt) : null,
        }));
        setChecklistItems(processedItems);
      } catch (err: any) {
        console.error("Error fetching checklist items:", err);
        setError(err.message || "Could not load checklist items. Please try again later.");
        toast({ variant: "destructive", title: "Error", description: err.message || "Could not load checklist items." });
      } finally {
        setLoading(false);
      }
    };
    fetchChecklistItems();
  }, [toast]);

  const handleStatusChange = async (itemId: string, newStatus: ChecklistItem['status']) => {
    const now = new Date();
    const item = checklistItems.find(i => i.id === itemId);
    let updatePayload: Partial<ChecklistItem> = {
      status: newStatus,
      statusUpdatedAt: now,
    };

    if (newStatus === 'Complete') {
      updatePayload.lastCompletedOn = now;
      updatePayload.completedBy = item?.assignedStaff || "System"; 
    } else if (newStatus !== 'Complete' && item?.status === 'Complete') {
      updatePayload.lastCompletedOn = null;
      updatePayload.completedBy = null;
    }
    
    // Optimistic UI update
    setChecklistItems(prevItems => prevItems.map(i => i.id === itemId ? { ...i, ...updatePayload } : i));
    
    // TODO: Implement PATCH request to API endpoint (e.g., /api/checklists/[id]) to update status in Supabase
    // Example:
    // try {
    //   const response = await fetch(`/api/checklists/${itemId}`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ status: newStatus, statusUpdatedAt: now.toISOString(), lastCompletedOn: updatePayload.lastCompletedOn?.toISOString(), completedBy: updatePayload.completedBy }),
    //   });
    //   if (!response.ok) throw new Error('Failed to update status');
    //   toast({ title: "Status Updated", description: `Task status changed to ${newStatus}.` });
    // } catch (error) {
    //   console.error("Error updating status:", error);
    //   toast({ variant: "destructive", title: "Update Error", description: "Could not update status on server." });
    //   // Optionally revert optimistic update here
    // }
    toast({ title: "Status Updated (UI Only)", description: `Task status changed to ${newStatus}. Implement API call.` });
  };

  const openEvidenceModal = (item: ChecklistItem) => {
    setSelectedItemForModal(item);
    setCurrentEvidenceLink(item.evidenceLink || '');
    setIsEvidenceModalOpen(true);
  };

  const handleSaveEvidence = async () => {
    if (!selectedItemForModal) return;
    // Optimistic UI update
    setChecklistItems(prevItems => prevItems.map(i => i.id === selectedItemForModal.id ? { ...i, evidenceLink: currentEvidenceLink } : i));
    
    // TODO: Implement PATCH request to API endpoint to save evidenceLink
    // Example:
    // try {
    //   const response = await fetch(`/api/checklists/${selectedItemForModal.id}`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ evidenceLink: currentEvidenceLink }),
    //   });
    //   if (!response.ok) throw new Error('Failed to save evidence');
    //   toast({ title: "Evidence Link Saved", description: "Evidence link has been updated." });
    // } catch (error) {
    //   console.error("Error saving evidence:", error);
    //   toast({ variant: "destructive", title: "Save Error", description: "Could not save evidence link." });
    // }
    toast({ title: "Evidence Link Saved (UI Only)", description: "Evidence link has been updated. Implement API call." });
    setIsEvidenceModalOpen(false);
    setSelectedItemForModal(null);
  };

  const openNotesModal = (item: ChecklistItem) => {
    setSelectedItemForModal(item);
    setCurrentNotes(item.notes || '');
    setCurrentValidator(item.validator || ''); 
    setIsNotesModalOpen(true);
  };

  const handleSaveNotesAndValidator = async () => {
    if (!selectedItemForModal) return;
    // Optimistic UI update
    setChecklistItems(prevItems => prevItems.map(i => i.id === selectedItemForModal.id ? { ...i, notes: currentNotes, validator: currentValidator } : i));
    
    // TODO: Implement PATCH request to API endpoint to save notes and validator
    // Example:
    // try {
    //   const response = await fetch(`/api/checklists/${selectedItemForModal.id}`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ notes: currentNotes, validator: currentValidator }),
    //   });
    //   if (!response.ok) throw new Error('Failed to save details');
    //   toast({ title: "Details Saved", description: "Notes and validator have been updated." });
    // } catch (error) {
    //   console.error("Error saving details:", error);
    //   toast({ variant: "destructive", title: "Save Error", description: "Could not save notes/validator." });
    // }
    toast({ title: "Details Saved (UI Only)", description: "Notes and validator have been updated. Implement API call." });
    setIsNotesModalOpen(false);
    setSelectedItemForModal(null);
  };

  const filteredItems = useMemo(() => {
    return checklistItems.filter(item => {
      const itemDueDateAsDate = item.dueDate instanceof Date ? item.dueDate : parseISO(item.dueDate as unknown as string);
      if (!itemDueDateAsDate || !isValidDate(itemDueDateAsDate)) return false;

      const dateMatch = !filterDate || isEqualDate(dateFnsStartOfDay(itemDueDateAsDate), dateFnsStartOfDay(filterDate));
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
    toast({ title: "Manual Task Generation", description: "This feature is for testing and requires a separate backend process (e.g., Supabase Edge Function) for live recurrence."});
    console.warn("Manual task generation would call a Supabase Edge Function or a custom API endpoint to simulate recurrence logic.");
  };

  const handleExportToday = () => {
    const todayClient = dateFnsStartOfDay(new Date()); // Use startOfDay for consistent comparison
    const itemsToExport = checklistItems.filter(item => {
        const itemDueDateJs = item.dueDate instanceof Date ? item.dueDate : parseISO(item.dueDate as unknown as string);
        return itemDueDateJs && isValidDate(itemDueDateJs) && isEqualDate(dateFnsStartOfDay(itemDueDateJs), todayClient);
    });

    if (itemsToExport.length === 0) {
      toast({ title: "No Tasks Today", description: "No tasks are due today to export.", variant: "default" });
      return;
    }

    const headers = ["Task Name", "Assigned Staff", "Due Date", "Status", "Validator", "Last Completed", "Completed By", "Evidence Link", "Notes", "Category"];
    const rows = itemsToExport.map(item => {
      const itemDueDateJs = item.dueDate instanceof Date ? item.dueDate : parseISO(item.dueDate as unknown as string);
      const itemLastCompletedJs = item.lastCompletedOn instanceof Date ? item.lastCompletedOn : (item.lastCompletedOn ? parseISO(item.lastCompletedOn as unknown as string) : null);
      
      return [
        item.taskName,
        item.assignedStaff,
        itemDueDateJs && isValidDate(itemDueDateJs) ? format(itemDueDateJs, 'PP') : 'N/A',
        item.status,
        item.validator || 'N/A',
        itemLastCompletedJs && isValidDate(itemLastCompletedJs) ? format(itemLastCompletedJs, 'PPp') : 'N/A',
        item.completedBy || 'N/A',
        item.evidenceLink || 'N/A',
        item.notes || 'N/A',
        item.category || 'N/A',
      ].map(field => `"${String(field ?? '').replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `checklist_today_${format(todayClient, 'yyyy-MM-dd')}.csv`);
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
            <Button onClick={handleManualGenerate} variant="outline" title="Simulate task generation for testing" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> Test Gen (Client)
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
              const itemDueDateJs = item.dueDate instanceof Date ? item.dueDate : parseISO(item.dueDate as unknown as string);
              const displayDueDate = itemDueDateJs && isValidDate(itemDueDateJs)
                ? isToday(itemDueDateJs) ? <span className="text-accent font-semibold">Today</span> : format(itemDueDateJs, 'PP')
                : 'N/A';
              
              let lastActionDate: Date | null = null;
              const itemStatusUpdatedAtJs = item.statusUpdatedAt instanceof Date ? item.statusUpdatedAt : (item.statusUpdatedAt ? parseISO(item.statusUpdatedAt as unknown as string) : null);
              const itemLastCompletedOnJs = item.lastCompletedOn instanceof Date ? item.lastCompletedOn : (item.lastCompletedOn ? parseISO(item.lastCompletedOn as unknown as string) : null);

              if (item.status === 'Complete' && itemLastCompletedOnJs && isValidDate(itemLastCompletedOnJs)) {
                  lastActionDate = itemLastCompletedOnJs;
              } else if (itemStatusUpdatedAtJs && isValidDate(itemStatusUpdatedAtJs)) {
                  lastActionDate = itemStatusUpdatedAtJs;
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
                  {lastActionDate && isValidDate(lastActionDate)
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
                  No checklist items found matching your criteria.
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
