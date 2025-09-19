
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuditTable } from '@/components/audit-tool/audit-table';
import { AuditRecordFormDialog } from '@/components/audit-tool/audit-record-form-dialog';
import { AttachEvidenceDialogAudit } from '@/components/audit-tool/attach-evidence-dialog-audit';
import type { AuditRecord, AuditStatus, AppRole } from '@/types';
import { PlusCircle, Search, Filter, FileDown, Activity } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { allAppRoles, allMockStaffNames, allMockComplianceChapters } from '@/lib/mock-data';
import { parseISO } from 'date-fns';

type AuditRecordFormData = Omit<AuditRecord, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'lastCompletedDate'>;

export default function MARLogsPage() {
  const [marRecords, setMarRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status?: AuditStatus | 'all';
    assignedRole?: AppRole | 'all'; // Filters by QMAP role
    residentName?: string | 'all';
  }>({ status: 'all', assignedRole: 'all', residentName: 'all' });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AuditRecord | null>(null);

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedRecordForEvidence, setSelectedRecordForEvidence] = useState<AuditRecord | null>(null);

  useEffect(() => {
    const fetchMarRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/mar-logs');
        if (!response.ok) {
          throw new Error(`Failed to fetch MAR records: ${response.statusText}`);
        }
        const data: any[] = await response.json();
        const processedData: AuditRecord[] = data.map(item => ({
          ...item,
          lastCompletedDate: item.lastCompletedDate ? parseISO(item.lastCompletedDate) : null,
          createdAt: parseISO(item.createdAt), // Scheduled time
          updatedAt: parseISO(item.updatedAt), // Actual time
        }));
        setMarRecords(processedData);
      } catch (err: any) {
        console.error("Error fetching MAR records:", err);
        setError("Could not load MAR records. Please try again later.");
        toast({ variant: "destructive", title: "Error", description: "Could not load MAR records." });
      } finally {
        setLoading(false);
      }
    };
    fetchMarRecords();
  }, [toast]);
  
  const residentNames = useMemo(() => {
    const names = marRecords.map(r => r.name.split(' - ')[0]);
    return ['all', ...Array.from(new Set(names))];
  }, [marRecords]);


  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredMarRecords = useMemo(() => {
    return marRecords.filter(record => {
      const searchMatch = !searchTerm || 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const statusMatch = filters.status === 'all' || record.status === filters.status;
      const roleMatch = filters.assignedRole === 'all' || record.assignedRole === filters.assignedRole;
      const residentMatch = filters.residentName === 'all' || record.name.startsWith(filters.residentName as string);

      return searchMatch && statusMatch && roleMatch && residentMatch;
    });
  }, [marRecords, searchTerm, filters]);

  const handleOpenForm = (record?: AuditRecord) => {
    setEditingRecord(record || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleSaveRecord = (formData: AuditRecordFormData) => {
    const recordCategory = 'Medication Administration Record'; 

    if (editingRecord) {
      const updatedRecord: AuditRecord = { 
        ...editingRecord, 
        ...formData, 
        category: recordCategory, 
        updatedAt: new Date(), // Represents actual administration time
        lastCompletedDate: (formData.status === 'Administered' || formData.status === 'Late') ? new Date() : null,
       };
      setMarRecords(prev => prev.map(r => r.id === editingRecord.id ? updatedRecord : r));
      toast({ title: "MAR Entry Updated", description: `Entry for "${updatedRecord.name}" saved.` });
    } else {
      const newRecord: AuditRecord = {
        id: `mar_${Date.now()}`, 
        name: formData.name,
        category: recordCategory, 
        assignedRole: formData.assignedRole,
        validator: formData.validator,
        status: formData.status,
        chapterReferenceTag: formData.chapterReferenceTag,
        notes: formData.notes,
        createdAt: new Date(), // Represents scheduled time for new manual entries
        updatedAt: new Date(), // Represents actual time
        lastCompletedDate: (formData.status === 'Administered' || formData.status === 'Late') ? new Date() : null,
      };
      setMarRecords(prev => [newRecord, ...prev]);
      toast({ title: "MAR Entry Added", description: `New entry for "${newRecord.name}" added.` });
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
    setMarRecords(prev => prev.map(r => r.id === recordId ? { ...r, evidenceLink, updatedAt: new Date() } : r));
    if (selectedRecordForEvidence && selectedRecordForEvidence.id === recordId) {
      setSelectedRecordForEvidence(prev => prev ? { ...prev, evidenceLink, updatedAt: new Date() } : null);
    }
    toast({ title: "Documentation Link Saved", description: `Link for MAR entry updated.` });
    handleCloseEvidenceModal();
  };

  const handleExportData = () => {
    if (filteredMarRecords.length === 0) {
      toast({ title: "No Data to Export", description: "Please refine your filters or add data." });
      return;
    }
    const headers = ["ID", "Resident-Medication", "QMAP", "Validator", "Scheduled Time", "Actual Time", "Status", "Notes (Dosage, Route)", "Chapter Ref"];
    const rows = filteredMarRecords.map(record => [
      record.id,
      record.name,
      Array.isArray(record.assignedRole) ? record.assignedRole.join('; ') : record.assignedRole,
      record.validator || '',
      record.createdAt.toLocaleString(),
      record.lastCompletedDate ? record.lastCompletedDate.toLocaleString() : 'N/A',
      record.status,
      record.notes || '',
      record.chapterReferenceTag || '',
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mar_logs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export Successful", description: "MAR logs data exported as CSV." });
  };

  const marSpecificStatuses: AuditStatus[] = ['Administered', 'Missed', 'Late', 'Pending Review'];
  const qmapRoles: AppRole[] = ['QMAP Supervisor', 'Caregiver'];


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-accent" /> 
            Medication Administration Records (MAR)
          </CardTitle>
          <CardDescription>
            Log and track all scheduled medication administrations. This lightweight log is for QMAP internal use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/30 rounded-lg shadow space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="relative md:col-span-2 xl:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search resident or medication..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filters.residentName} onValueChange={(value) => handleFilterChange('residentName', value)}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Resident" />
                </SelectTrigger>
                <SelectContent>
                  {residentNames.map(name => <SelectItem key={name} value={name}>{name === 'all' ? 'All Residents' : name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(filters.status)} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {marSpecificStatuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(filters.assignedRole)} onValueChange={(value) => handleFilterChange('assignedRole', value)}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by QMAP Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All QMAP Roles</SelectItem>
                  {qmapRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Manual MAR Entry
                </Button>
                 <Button onClick={handleExportData} variant="outline">
                    <FileDown className="mr-2 h-5 w-5" /> Export Data
                </Button>
            </div>
          </div>

          <AuditTable 
            records={filteredMarRecords}
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
