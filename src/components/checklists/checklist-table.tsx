
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, Timestamp, query, orderBy, where, getDocs, writeBatch, limit } from 'firebase/firestore';
import type { ChecklistItem, ResolutionStatus } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Filter, Paperclip, RefreshCw, Save, Upload, AlertCircle, Edit3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid as isValidDate } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';

const CHECKLIST_STATUSES: Extract<ResolutionStatus, 'Pending' | 'Complete' | 'Flagged'>[] = ['Pending', 'Complete', 'Flagged'];

export default function ChecklistTable() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStaff, setFilterStaff] = useState('');

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<ChecklistItem | null>(null);
  const [currentEvidenceLink, setCurrentEvidenceLink] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');
  
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'checklists'), orderBy('dueDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: ChecklistItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          // Ensure dates are JS Date objects if they are Timestamps
          dueDate: data.dueDate, // Keep as string YYYY-MM-DD
          createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date(data.createdAt),
          lastCompletedOn: (data.lastCompletedOn as Timestamp)?.toDate ? (data.lastCompletedOn as Timestamp).toDate() : null,
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
      const updatePayload: Partial<ChecklistItem> = { status: newStatus };
      if (newStatus === 'Complete') {
        updatePayload.lastCompletedOn = Timestamp.now();
        // Assuming current user or assigned staff completes it. This needs a proper user context in a real app.
        const item = checklistItems.find(i => i.id === itemId);
        updatePayload.completedBy = item?.assignedStaff || "System";
      } else if (newStatus !== 'Complete' && checklistItems.find(i => i.id === itemId)?.status === 'Complete') {
        // If changing from Complete to something else, clear completion details
        updatePayload.lastCompletedOn = null;
        updatePayload.completedBy = null;
      }
      await updateDoc(itemRef, updatePayload);
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
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedItemForModal) return;
    const itemRef = doc(db, 'checklists', selectedItemForModal.id);
    try {
      await updateDoc(itemRef, { notes: currentNotes });
      toast({ title: "Notes Saved", description: "Notes have been updated." });
      setIsNotesModalOpen(false);
      setSelectedItemForModal(null);
    } catch (err) {
      console.error("Error saving notes:", err);
      toast({ variant: "destructive", title: "Error", description: "Failed to save notes." });
    }
  };

  const filteredItems = useMemo(() => {
    return checklistItems.filter(item => {
      const dueDate = item.dueDate ? parseISO(item.dueDate) : null; // Parse YYYY-MM-DD string
      const dateMatch = !filterDate || (dueDate && isValidDate(dueDate) && format(dueDate, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd'));
      const statusMatch = filterStatus === 'all' || item.status === filterStatus;
      const staffMatch = !filterStaff || item.assignedStaff.toLowerCase().includes(filterStaff.toLowerCase());
      return dateMatch && statusMatch && staffMatch;
    });
  }, [checklistItems, filterDate, filterStatus, filterStaff]);

  const getStatusBadgeVariant = (status: ChecklistItem['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Complete': return 'default'; // Using primary for Complete
      case 'Flagged': return 'destructive';
      default: return 'outline';
    }
  };
  
  const handleManualGenerate = async () => {
    toast({ title: "Manual Trigger", description: "Simulating task generation. Check Firestore and console."});
    console.log("Manual trigger button clicked. In a real scenario, this might call an HTTPS Firebase Function.");
     try {
      const recurringTasksSnapshot = await getDocs(query(collection(db, 'recurringTasks'), where('autoGenerateChecklist', '==', true)));
      if (recurringTasksSnapshot.empty) {
        toast({ title: "No eligible recurring tasks found", variant: "destructive" });
        return;
      }

      const today = new Date();
      const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      const todayDateString = today.toISOString().split('T')[0];
      
      const batch = writeBatch(db);
      let tasksToCreateCount = 0;

      for (const docSnap of recurringTasksSnapshot.docs) {
        const taskData = docSnap.data() as any; // Type assertion for simplicity here
        const taskId = docSnap.id;
        let shouldGenerate = false;

        if (taskData.frequency === 'daily') shouldGenerate = true;
        else if (taskData.frequency === 'weekly' && taskData.recurrenceDays?.includes(currentDayName)) shouldGenerate = true;
        // Add monthly logic if needed:
        // else if (taskData.frequency === 'monthly' && today.getDate() === taskData.recurrenceDayOfMonth) shouldGenerate = true;


        if (shouldGenerate) {
           const checklistQuery = await getDocs(query(collection(db, 'checklists'),
            where('taskId', '==', taskId),
            where('dueDate', '==', todayDateString),
            orderBy('createdAt', 'desc'), 
            limit(1)
          ));

          if (checklistQuery.empty) {
            const newChecklistItemRef = doc(collection(db, 'checklists'));
            batch.set(newChecklistItemRef, {
              taskName: taskData.taskName,
              assignedStaff: taskData.assignedStaff,
              validator: taskData.validator || null,
              dueDate: todayDateString,
              status: 'Pending',
              createdAt: Timestamp.now(),
              taskId: taskId,
              notes: '',
              evidenceLink: '',
              lastCompletedOn: null,
              completedBy: null,
            });
            tasksToCreateCount++;
          }
        }
      }

      if (tasksToCreateCount > 0) {
        await batch.commit();
        toast({ title: "Success", description: `${tasksToCreateCount} checklist items were manually queued for creation.` });
      } else {
        toast({ title: "No new tasks", description: "No new tasks were due for manual generation today or they already exist." });
      }

    } catch (e) {
      console.error("Error manually generating tasks:", e);
      toast({ title: "Manual Generation Error", description: String(e), variant: "destructive" });
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-32"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /> <span className="ml-2">Loading checklists...</span></div>;
  }

  if (error) {
    return <div className="text-destructive p-4 border border-destructive bg-destructive/10 rounded-md flex items-center"><AlertCircle className="h-5 w-5 mr-2"/> {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="filter-date">Filter by Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
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
              <SelectTrigger id="filter-status" className="mt-1">
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
              className="mt-1"
            />
          </div>
          <Button onClick={handleManualGenerate} variant="outline" title="Manually simulate task generation (for testing)">
            <RefreshCw className="mr-2 h-4 w-4" /> Test Generate Tasks
          </Button>
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
              <TableHead>Last Completed</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.taskName}</TableCell>
                <TableCell>{item.assignedStaff}</TableCell>
                <TableCell>{item.dueDate ? format(parseISO(item.dueDate), 'PP') : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell>{item.validator || 'N/A'}</TableCell>
                <TableCell>
                  {item.lastCompletedOn && isValidDate(new Date(item.lastCompletedOn))
                    ? `${format(new Date(item.lastCompletedOn), 'PPp')} by ${item.completedBy || 'N/A'}`
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {item.evidenceLink ? (
                    <a href={item.evidenceLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      View <Upload className="inline h-3 w-3 ml-1"/>
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
                <TableCell className="space-x-1">
                  <Select value={item.status} onValueChange={(newStatus) => handleStatusChange(item.id, newStatus as ChecklistItem['status'])}>
                    <SelectTrigger className="h-8 text-xs w-[120px]">
                      <SelectValue placeholder="Change Status" />
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
            )) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No checklist items found matching your criteria, or Firestore data is not yet available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Evidence Modal */}
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

       {/* Notes Modal */}
      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>For task: {selectedItemForModal?.taskName}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="task-notes">Notes</Label>
            <Textarea
              id="task-notes"
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              placeholder="Enter notes for this task..."
              className="mt-1 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNotes}><Save className="mr-2 h-4 w-4" />Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
