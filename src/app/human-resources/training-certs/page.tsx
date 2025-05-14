"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockStaffTrainingData, allMockStaffNames, allTrainingTypes, allTrainingStatuses, allMockRoles } from '@/lib/mock-data';
import type { StaffTrainingRecord, TrainingType, TrainingStatus, Role } from '@/types';
import { UsersRound, Filter, Search, ExternalLink, CalendarIcon, Edit2, PlusCircle, Save, X } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StaffTrainingCertsPage() {
  const [trainingData, setTrainingData] = useState<StaffTrainingRecord[]>([]);
  const [filteredData, setFilteredData] = useState<StaffTrainingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [selectedTrainingType, setSelectedTrainingType] = useState<TrainingType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TrainingStatus | 'all'>('all');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StaffTrainingRecord | null>(null);
  const [currentFormData, setCurrentFormData] = useState<Partial<StaffTrainingRecord>>({});

  const { toast } = useToast();

  useEffect(() => {
    // Ensure dates are Date objects
    const processedData = mockStaffTrainingData.map(record => ({
      ...record,
      completionDate: record.completionDate && typeof record.completionDate === 'string' ? parseISO(record.completionDate) : record.completionDate,
      expiryDate: record.expiryDate && typeof record.expiryDate === 'string' ? parseISO(record.expiryDate) : record.expiryDate,
    }));
    setTrainingData(processedData);
  }, []);

  useEffect(() => {
    let data = trainingData;
    if (searchTerm) {
      data = data.filter(record => 
        record.staffMemberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.staffRole.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedStaff !== 'all') {
      data = data.filter(record => record.staffMemberName === selectedStaff);
    }
    if (selectedTrainingType !== 'all') {
      data = data.filter(record => record.trainingType === selectedTrainingType);
    }
    if (selectedStatus !== 'all') {
      data = data.filter(record => record.status === selectedStatus);
    }
    setFilteredData(data);
  }, [trainingData, searchTerm, selectedStaff, selectedTrainingType, selectedStatus]);

  const getStatusBadgeVariant = (status: TrainingStatus) => {
    switch (status) {
      case 'Compliant': return 'default'; 
      case 'Expiring Soon': return 'secondary'; 
      case 'Overdue': return 'destructive'; 
      case 'Pending Documentation': return 'outline'; 
      default: return 'outline';
    }
  };
  
  const handleOpenForm = (record?: StaffTrainingRecord) => {
    setEditingRecord(record || null);
    setCurrentFormData(record ? { 
      ...record,
      completionDate: record.completionDate ? new Date(record.completionDate) : null,
      expiryDate: record.expiryDate ? new Date(record.expiryDate) : null,
     } : { staffMemberName: '', trainingType: allTrainingTypes[0], status: allTrainingStatuses[0], staffRole: allMockRoles[0] });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
    setCurrentFormData({});
  };

  const handleFormChange = (field: keyof StaffTrainingRecord, value: any) => {
    setCurrentFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleDateChange = (field: 'completionDate' | 'expiryDate', date: Date | undefined) => {
    setCurrentFormData(prev => ({...prev, [field]: date || null}));
  };

  const handleSaveRecord = () => {
    if (!currentFormData.staffMemberName || !currentFormData.trainingType || !currentFormData.staffRole || !currentFormData.status) {
        toast({ title: "Error", description: "Staff name, role, training type, and status are required.", variant: "destructive"});
        return;
    }

    let recordToSave: StaffTrainingRecord = {
        id: editingRecord?.id || `training_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        staffMemberName: currentFormData.staffMemberName!,
        staffRole: currentFormData.staffRole!,
        trainingType: currentFormData.trainingType!,
        completionDate: currentFormData.completionDate ? new Date(currentFormData.completionDate) : null,
        expiryDate: currentFormData.expiryDate ? new Date(currentFormData.expiryDate) : null,
        status: currentFormData.status!,
        documentationLink: currentFormData.documentationLink,
        notes: currentFormData.notes,
    };
    
    // Auto-update status based on dates if manually set status seems inconsistent
    if (recordToSave.expiryDate && new Date(recordToSave.expiryDate) < new Date() && recordToSave.status !== 'Overdue') {
        recordToSave.status = 'Overdue';
    } else if (recordToSave.completionDate && !recordToSave.expiryDate && recordToSave.status !== 'Compliant') {
        // For trainings like Orientation that don't expire, if completed, it's compliant
        if (recordToSave.trainingType === 'Orientation') recordToSave.status = 'Compliant';
    } else if (!recordToSave.completionDate && recordToSave.status !== 'Pending Documentation') {
        recordToSave.status = 'Pending Documentation';
    }


    if (editingRecord) {
      setTrainingData(prev => prev.map(r => r.id === editingRecord.id ? recordToSave : r));
      toast({ title: "Record Updated", description: "Training record saved successfully." });
    } else {
      setTrainingData(prev => [recordToSave, ...prev]);
      toast({ title: "Record Added", description: "New training record added." });
    }
    handleCloseForm();
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersRound className="h-6 w-6 text-accent" /> Staff Training &amp; Certifications
          </CardTitle>
          <CardDescription>
            Track deadlines and compliance for QMAP training, TB tests, CPR, and orientation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/30 rounded-lg shadow space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by staff name or role..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Staff" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    <SelectItem value="all">All Staff</SelectItem>
                    {allMockStaffNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <Select value={selectedTrainingType} onValueChange={(value) => setSelectedTrainingType(value as TrainingType | 'all')}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Training Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Training Types</SelectItem>
                  {allTrainingTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as TrainingStatus | 'all')}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {allTrainingStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Record
                </Button>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Training Type</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documentation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? filteredData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.staffMemberName}</TableCell>
                      <TableCell>{record.staffRole}</TableCell>
                      <TableCell>{record.trainingType}</TableCell>
                      <TableCell>
                        {record.completionDate && isValid(new Date(record.completionDate)) ? format(new Date(record.completionDate), 'PP') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {record.expiryDate && isValid(new Date(record.expiryDate)) ? format(new Date(record.expiryDate), 'PP') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {record.documentationLink ? (
                          <Button variant="link" size="sm" asChild className="p-0 h-auto">
                            <a href={record.documentationLink} target="_blank" rel="noopener noreferrer" className="text-accent">
                              View Doc <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenForm(record)}>
                              <Edit2 className="h-4 w-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No training records found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{editingRecord ? 'Edit Training Record' : 'Add New Training Record'}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] p-1">
            <div className="grid gap-4 py-4 pr-4">
                <div>
                    <Label htmlFor="staffMemberName">Staff Member</Label>
                     <Select 
                        value={currentFormData.staffMemberName} 
                        onValueChange={(value) => handleFormChange('staffMemberName', value)}
                      >
                        <SelectTrigger id="staffMemberName" className="mt-1">
                            <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                             <ScrollArea className="h-[200px]">
                                {allMockStaffNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                             </ScrollArea>
                        </SelectContent>
                    </Select>
                    {!currentFormData.staffMemberName && <p className="text-destructive text-xs mt-1">Staff name is required.</p>}
                </div>
                 <div>
                    <Label htmlFor="staffRole">Staff Role</Label>
                     <Select 
                        value={currentFormData.staffRole} 
                        onValueChange={(value) => handleFormChange('staffRole', value as Role)}
                      >
                        <SelectTrigger id="staffRole" className="mt-1">
                            <SelectValue placeholder="Select staff role" />
                        </SelectTrigger>
                        <SelectContent>
                            {allMockRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     {!currentFormData.staffRole && <p className="text-destructive text-xs mt-1">Staff role is required.</p>}
                </div>
                <div>
                    <Label htmlFor="trainingType">Training Type</Label>
                    <Select 
                        value={currentFormData.trainingType} 
                        onValueChange={(value) => handleFormChange('trainingType', value as TrainingType)}
                    >
                        <SelectTrigger id="trainingType" className="mt-1">
                             <SelectValue placeholder="Select training type" />
                        </SelectTrigger>
                        <SelectContent>
                            {allTrainingTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     {!currentFormData.trainingType && <p className="text-destructive text-xs mt-1">Training type is required.</p>}
                </div>
                 <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                        value={currentFormData.status} 
                        onValueChange={(value) => handleFormChange('status', value as TrainingStatus)}
                    >
                        <SelectTrigger id="status" className="mt-1">
                             <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {allTrainingStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     {!currentFormData.status && <p className="text-destructive text-xs mt-1">Status is required.</p>}
                </div>
                <div>
                    <Label htmlFor="completionDate">Completion Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal mt-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {currentFormData.completionDate && isValid(new Date(currentFormData.completionDate)) ? format(new Date(currentFormData.completionDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={currentFormData.completionDate ? new Date(currentFormData.completionDate) : undefined} onSelect={(date) => handleDateChange('completionDate', date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal mt-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {currentFormData.expiryDate && isValid(new Date(currentFormData.expiryDate)) ? format(new Date(currentFormData.expiryDate), "PPP") : <span>Pick a date (optional)</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={currentFormData.expiryDate ? new Date(currentFormData.expiryDate) : undefined} onSelect={(date) => handleDateChange('expiryDate', date)} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="col-span-full">
                    <Label htmlFor="documentationLink">Documentation Link (URL)</Label>
                    <Input id="documentationLink" value={currentFormData.documentationLink || ''} onChange={(e) => handleFormChange('documentationLink', e.target.value)} className="mt-1" placeholder="https://example.com/certificate.pdf" />
                </div>
                <div className="col-span-full">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={currentFormData.notes || ''} onChange={(e) => handleFormChange('notes', e.target.value)} className="mt-1" placeholder="Optional notes..." />
                </div>
            </div>
            </ScrollArea>
            <DialogFooter className="border-t pt-4">
                <Button variant="outline" onClick={handleCloseForm}><X className="mr-2 h-4 w-4" />Cancel</Button>
                <Button onClick={handleSaveRecord}><Save className="mr-2 h-4 w-4" />Save Record</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
