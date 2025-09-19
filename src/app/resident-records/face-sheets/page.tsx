
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
import { PlusCircle, Search, Filter, FileDown, Contact } from 'lucide-react'; // Changed icon
import { useToast } from "@/hooks/use-toast";
import { allAuditCategories, allAuditStatuses, allAppRoles, allMockComplianceChapters } from '@/lib/mock-data';
import { parseISO } from 'date-fns';

export default function FaceSheetsPage() {
  const [faceSheetRecords, setFaceSheetRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status?: AuditStatus | 'all';
    // Category filter might be less relevant if all items are 'Resident Records Management'
    // but can be kept if other sub-categories might appear.
    category?: AuditToolCategory | 'all'; 
    chapterReferenceTag?: string | 'all';
    assignedRole?: AppRole | 'all';
  }>({ status: 'all', category: 'Resident Records Management', chapterReferenceTag: 'all', assignedRole: 'all' });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AuditRecord | null>(null);

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedRecordForEvidence, setSelectedRecordForEvidence] = useState<AuditRecord | null>(null);

  useEffect(() => {
    const fetchFaceSheetRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/face-sheets');
        if (!response.ok) {
          throw new Error(`Failed to fetch face sheet records: ${response.statusText}`);
        }
        const data: any[] = await response.json();
        const processedData: AuditRecord[] = data.map(item => ({
          ...item,
          lastCompletedDate: item.lastCompletedDate ? parseISO(item.lastCompletedDate) : null,
          createdAt: parseISO(item.createdAt),
          updatedAt: parseISO(item.updatedAt),
        }));
        setFaceSheetRecords(processedData);
      } catch (err: any) {
        console.error("Error fetching face sheet records:", err);
        setError("Could not load face sheet records. Please try again later.");
        toast({ variant: "destructive", title: "Error", description: "Could not load face sheet records." });
      } finally {
        setLoading(false);
      }
    };
    fetchFaceSheetRecords();
  }, [toast]);

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value === 'all' ? 'all' : value }));
  };

  const filteredFaceSheetRecords = useMemo(() => {
    return faceSheetRecords.filter(record => {
      // Search term can target resident name (in record.name) or notes
      const searchMatch = !searchTerm || 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const statusMatch = filters.status === 'all' || record.status === filters.status;
      const categoryMatch = filters.category === 'all' || record.category === filters.category;
      const chapterMatch = filters.chapterReferenceTag === 'all' || record.chapterReferenceTag === filters.chapterReferenceTag;
      const roleMatch = filters.assignedRole === 'all' || (Array.isArray(record.assignedRole) ? record.assignedRole.includes(filters.assignedRole as AppRole) : record.assignedRole === filters.assignedRole);
      
      return searchMatch && statusMatch && categoryMatch && chapterMatch && roleMatch;
    });
  }, [faceSheetRecords, searchTerm, filters]);

  const handleOpenForm = (record?: AuditRecord) => {
    setEditingRecord(record || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleSaveRecord = (formData: Omit<AuditRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    // In a real app, this would make an API call (POST or PATCH to /api/face-sheets)
    // For now, update client-side state
    const recordCategory = 'Resident Records Management'; // Ensure category is set for Face Sheets

    if (editingRecord) {
      const updatedRecord = { 
        ...editingRecord, 
        ...formData, 
        category: recordCategory, // Enforce category
        updatedAt: new Date(),
        lastCompletedDate: (formData.status === 'Up-to-date' || formData.status === 'Resolved') ? new Date() : editingRecord.lastCompletedDate,
       };
      setFaceSheetRecords(prev => prev.map(r => r.id === editingRecord.id ? updatedRecord : r));
      toast({ title: "Face Sheet Updated", description: `Record "${updatedRecord.name}" saved.` });
    } else {
      const newRecord: AuditRecord = {
        ...formData,
        id: `facesheet_${Date.now()}`, // Temporary client-side ID
        category: recordCategory, // Enforce category
        createdAt: new Date(),
        updatedAt: new Date(),
        lastCompletedDate: (formData.status === 'Up-to-date' || formData.status === 'Resolved') ? new Date() : null,
      };
      setFaceSheetRecords(prev => [newRecord, ...prev]);
      toast({ title: "Face Sheet Added", description: `New record "${newRecord.name}" added.` });
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
    // In a real app, this would make an API call (PATCH to /api/face-sheets/[id])
    setFaceSheetRecords(prev => prev.map(r => r.id === recordId ? { ...r, evidenceLink, updatedAt: new Date() } : r));
    if (selectedRecordForEvidence && selectedRecordForEvidence.id === recordId) {
      setSelectedRecordForEvidence(prev => prev ? { ...prev, evidenceLink, updatedAt: new Date() } : null);
    }
    toast({ title: "Evidence Link Saved", description: `Evidence for face sheet updated.` });
    handleCloseEvidenceModal();
  };

  const handleExportData = () => {
    if (filteredFaceSheetRecords.length === 0) {
      toast({ title: "No Data to Export", description: "Please refine your filters or add data.", variant: "default" });
      return;
    }
    const headers = ["ID", "Resident Document Name", "Category", "Assigned Staff", "Validator", "Last Reviewed/Updated", "Status", "Document Link", "Chapter Reference", "Notes", "Created At", "Updated At"];
    const rows = filteredFaceSheetRecords.map(record => [
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
    link.setAttribute("download", "face_sheets_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export Successful", description: "Face sheets data exported as CSV." });
  };

  // Filter options specific to Face Sheets (e.g., statuses like 'Up-to-date', 'Review Needed')
  const faceSheetSpecificStatuses: AuditStatus[] = ['Up-to-date', 'Pending Review', 'Review Needed', 'Archived'];


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Contact className="h-6 w-6 text-accent" /> 
            Resident Face Sheets Management
          </CardTitle>
          <CardDescription>
            Manage and track resident face sheets, ensuring they are up-to-date and accessible.
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
                  {faceSheetSpecificStatuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
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
                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Face Sheet Record
                </Button>
                 <Button onClick={handleExportData} variant="outline">
                    <FileDown className="mr-2 h-5 w-5" /> Export Data
                </Button>
            </div>
          </div>

          <AuditTable 
            records={filteredFaceSheetRecords}
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
