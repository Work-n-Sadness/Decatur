
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuditTable } from '@/components/audit-tool/audit-table'; // Reusing AuditTable
import { AuditRecordFormDialog } from '@/components/audit-tool/audit-record-form-dialog'; // Reusing FormDialog
import { AttachEvidenceDialogAudit } from '@/components/audit-tool/attach-evidence-dialog-audit'; // Reusing EvidenceDialog
import type { AuditRecord, AuditStatus, AuditToolCategory, AppRole } from '@/types';
import { PlusCircle, Search, Filter, FileDown, NotebookPen } from 'lucide-react'; // Changed icon
import { useToast } from "@/hooks/use-toast";
import { allAuditCategories, allAuditStatuses, allAppRoles, allMockComplianceChapters } from '@/lib/mock-data';
import { parseISO } from 'date-fns';

export default function CarePlansPage() {
  const [carePlanRecords, setCarePlanRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status?: AuditStatus | 'all';
    category?: AuditToolCategory | 'all'; 
    chapterReferenceTag?: string | 'all';
    assignedRole?: AppRole | 'all';
  }>({ status: 'all', category: 'Resident Care Plans', chapterReferenceTag: 'all', assignedRole: 'all' });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AuditRecord | null>(null);

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedRecordForEvidence, setSelectedRecordForEvidence] = useState<AuditRecord | null>(null);

  useEffect(() => {
    const fetchCarePlanRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/care-plans');
        if (!response.ok) {
          throw new Error(`Failed to fetch care plan records: ${response.statusText}`);
        }
        const data: any[] = await response.json();
        const processedData: AuditRecord[] = data.map(item => ({
          ...item,
          lastCompletedDate: item.lastCompletedDate ? parseISO(item.lastCompletedDate) : null,
          createdAt: parseISO(item.createdAt),
          updatedAt: parseISO(item.updatedAt),
        }));
        setCarePlanRecords(processedData);
      } catch (err: any) {
        console.error("Error fetching care plan records:", err);
        setError("Could not load care plan records. Please try again later.");
        toast({ variant: "destructive", title: "Error", description: "Could not load care plan records." });
      } finally {
        setLoading(false);
      }
    };
    fetchCarePlanRecords();
  }, [toast]);

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value === 'all' ? 'all' : value }));
  };

  const filteredCarePlanRecords = useMemo(() => {
    return carePlanRecords.filter(record => {
      const searchMatch = !searchTerm || 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const statusMatch = filters.status === 'all' || record.status === filters.status;
      const categoryMatch = filters.category === 'all' || record.category === filters.category;
      const chapterMatch = filters.chapterReferenceTag === 'all' || record.chapterReferenceTag === filters.chapterReferenceTag;
      const roleMatch = filters.assignedRole === 'all' || (Array.isArray(record.assignedRole) ? record.assignedRole.includes(filters.assignedRole as AppRole) : record.assignedRole === filters.assignedRole);
      
      return searchMatch && statusMatch && categoryMatch && chapterMatch && roleMatch;
    });
  }, [carePlanRecords, searchTerm, filters]);

  const handleOpenForm = (record?: AuditRecord) => {
    setEditingRecord(record || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleSaveRecord = (formData: AuditRecordFormData) => {
    const recordCategory = 'Resident Care Plans'; 

    if (editingRecord) {
      const updatedRecord: AuditRecord = { 
        ...editingRecord, 
        ...formData, 
        category: recordCategory, 
        updatedAt: new Date(),
        lastCompletedDate: (formData.status === 'Active' || formData.status === 'Resolved') ? new Date() : editingRecord.lastCompletedDate,
       };
      setCarePlanRecords(prev => prev.map(r => r.id === editingRecord.id ? updatedRecord : r));
      toast({ title: "Care Plan Updated", description: `Care plan "${updatedRecord.name}" saved.` });
    } else {
      const newRecord: AuditRecord = {
        id: `careplan_${Date.now()}`, 
        name: formData.name,
        category: recordCategory, 
        assignedRole: formData.assignedRole,
        validator: formData.validator,
        status: formData.status,
        chapterReferenceTag: formData.chapterReferenceTag,
        notes: formData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastCompletedDate: (formData.status === 'Active' || formData.status === 'Resolved') ? new Date() : null,
      };
      setCarePlanRecords(prev => [newRecord, ...prev]);
      toast({ title: "Care Plan Added", description: `New care plan "${newRecord.name}" added.` });
    }
    handleCloseForm();
  };

  const handleOpenEvidenceModal = (record: AuditRecord) => {
    setSelectedRecordForEvidence(record);
    setIsEvidenceModalOpen(true);
  };

  const handleCloseEvidenceModal = () => {
    setIsEvidenceModalOpen(false);
    setSelectedRecordForEvidence(null);
  };

  const handleSaveEvidence = (recordId: string, evidenceLink: string) => {
    setCarePlanRecords(prev => prev.map(r => r.id === recordId ? { ...r, evidenceLink, updatedAt: new Date() } : r));
    if (selectedRecordForEvidence && selectedRecordForEvidence.id === recordId) {
      setSelectedRecordForEvidence(prev => prev ? { ...prev, evidenceLink, updatedAt: new Date() } : null);
    }
    toast({ title: "Evidence Link Saved", description: `Evidence for care plan updated.` });
    handleCloseEvidenceModal();
  };

  const handleExportData = () => {
    if (filteredCarePlanRecords.length === 0) {
      toast({ title: "No Data to Export", description: "Please refine your filters or add data.", variant: "default" });
      return;
    }
    const headers = ["ID", "Care Plan Name", "Category", "Assigned Staff", "Validator", "Last Reviewed/Updated", "Status", "Document Link", "Chapter Reference", "Notes", "Created At", "Updated At"];
    const rows = filteredCarePlanRecords.map(record => [
      record.id,
      record.name,
      record.category,
      Array.isArray(record.assignedRole) ? record.assignedRole.join('; ') : record.assignedRole,
      record.validator || '',
      record.lastCompletedDate ? record.lastCompletedDate.toISOString().split('T')[0] : '',
      record.status,
      record.evidenceLink || '',
      record.chapterReferenceTag || '',
      record.notes || '',
      record.createdAt.toISOString(),
      record.updatedAt.toISOString(),
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "care_plans_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export Successful", description: "Care plans data exported as CSV." });
  };

  const carePlanSpecificStatuses: AuditStatus[] = ['Active', 'Needs Review', 'Archived', 'Pending Review'];

  type AuditRecordFormData = Omit<AuditRecord, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'lastCompletedDate'> & {
    category?: AuditToolCategory; // Make category optional here as it's enforced in save
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <NotebookPen className="h-6 w-6 text-accent" /> 
            Resident Care Plans
          </CardTitle>
          <CardDescription>
            Manage and track resident care plans, ensuring they are current and regularly reviewed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/30 rounded-lg shadow space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
              <div className="relative md:col-span-2 xl:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by resident name or notes..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={String(filters.status)} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {carePlanSpecificStatuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(filters.assignedRole)} onValueChange={(value) => handleFilterChange('assignedRole', value)}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Assigned Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff Roles</SelectItem>
                  {allAppRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(filters.chapterReferenceTag)} onValueChange={(value) => handleFilterChange('chapterReferenceTag', value)}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Chapter Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chapter Tags</SelectItem>
                  {allMockComplianceChapters.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Care Plan
                </Button>
                 <Button onClick={handleExportData} variant="outline">
                    <FileDown className="mr-2 h-5 w-5" /> Export Data
                </Button>
            </div>
          </div>

          <AuditTable 
            records={filteredCarePlanRecords}
            onEditRecord={handleOpenForm}
            onAttachEvidence={handleOpenEvidenceModal}
            loading={loading}
            error={error}
          />
        </CardContent>
      </Card>

      <AuditRecordFormDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveRecord} 
        existingRecord={editingRecord}
      />

      <AttachEvidenceDialogAudit
        record={selectedRecordForEvidence}
        isOpen={isEvidenceModalOpen}
        onClose={handleCloseEvidenceModal}
        onSaveEvidence={handleSaveEvidence}
      />
    </div>
  );
}
