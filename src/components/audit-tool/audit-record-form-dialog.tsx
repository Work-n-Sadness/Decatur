
"use client";

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { AuditRecord, AuditToolCategory, AuditStatus, AppRole } from '@/types';
import { allAuditCategories, allAuditStatuses, allAppRoles, allMockComplianceChapters } from '@/lib/mock-data';
import { Save, X } from 'lucide-react';

const auditRecordSchema = z.object({
  name: z.string().min(3, "Audit name must be at least 3 characters long."),
  category: z.enum(allAuditCategories as [AuditToolCategory, ...AuditToolCategory[]], { required_error: "Category is required." }),
  assignedRole: z.custom<AppRole | AppRole[]>((val) => { // Allow string or array of strings
    if (typeof val === 'string' && val.length > 0) return true;
    if (Array.isArray(val) && val.length > 0 && val.every(item => typeof item === 'string' && item.length > 0)) return true;
    return false;
  }, "Assigned role is required."),
  validator: z.string().optional().nullable(),
  status: z.enum(allAuditStatuses as [AuditStatus, ...AuditStatus[]], { required_error: "Status is required." }),
  chapterReferenceTag: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type AuditRecordFormData = z.infer<typeof auditRecordSchema>;

interface AuditRecordFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AuditRecord) => void;
  existingRecord?: AuditRecord | null;
}

export function AuditRecordFormDialog({ isOpen, onClose, onSave, existingRecord }: AuditRecordFormDialogProps) {
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<AuditRecordFormData>({
    resolver: zodResolver(auditRecordSchema),
    defaultValues: {
      name: '',
      category: allAuditCategories[0],
      assignedRole: allAppRoles[0] as AppRole, // Default to first role
      validator: '',
      status: 'Pending Review',
      chapterReferenceTag: '',
      notes: '',
    }
  });

  useEffect(() => {
    if (existingRecord) {
      reset({
        name: existingRecord.name,
        category: existingRecord.category,
        assignedRole: existingRecord.assignedRole,
        validator: existingRecord.validator || '',
        status: existingRecord.status,
        chapterReferenceTag: existingRecord.chapterReferenceTag || '',
        notes: existingRecord.notes || '',
      });
    } else {
      reset({ // Reset to default for new record
        name: '',
        category: allAuditCategories[0],
        assignedRole: allAppRoles[0] as AppRole,
        validator: '',
        status: 'Pending Review',
        chapterReferenceTag: '',
        notes: '',
      });
    }
  }, [existingRecord, reset, isOpen]);

  const onSubmit = (data: AuditRecordFormData) => {
    const recordToSave: AuditRecord = {
      id: existingRecord?.id || `temp_id_${Date.now()}`, // Temporary ID for new records
      ...existingRecord, // Spread existing to keep fields like evidenceLink, dates
      name: data.name,
      category: data.category,
      assignedRole: data.assignedRole,
      validator: data.validator || null,
      status: data.status,
      chapterReferenceTag: data.chapterReferenceTag || undefined,
      notes: data.notes || undefined,
      // These should be set by API/backend ideally
      createdAt: existingRecord?.createdAt || new Date(),
      updatedAt: new Date(),
      lastCompletedDate: data.status === 'Compliant' || data.status === 'Resolved' ? (existingRecord?.lastCompletedDate || new Date()) : existingRecord?.lastCompletedDate || null,
    };
    onSave(recordToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{existingRecord ? 'Edit Audit Record' : 'Add New Audit Record'}</DialogTitle>
          <DialogDescription>
            {existingRecord ? 'Update the details of the audit record.' : 'Fill in the details to create a new audit record.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[60vh] p-1 pr-4">
            <div className="grid gap-4 py-4 ">
              <div>
                <Label htmlFor="name">Audit Name / Description</Label>
                <Input id="name" {...register("name")} className="mt-1" />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="category" className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {allAuditCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <Label htmlFor="assignedRole">Assigned Role</Label>
                <Controller
                  name="assignedRole"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value as AppRole)} // Assuming single role for now
                      value={Array.isArray(field.value) ? field.value[0] : field.value}
                    >
                      <SelectTrigger id="assignedRole" className="mt-1"><SelectValue placeholder="Select assigned role" /></SelectTrigger>
                      <SelectContent>
                        {allAppRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.assignedRole && <p className="text-sm text-destructive mt-1">{errors.assignedRole.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="validator">Validator (Optional)</Label>
                 <Controller
                  name="validator"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <SelectTrigger id="validator" className="mt-1"><SelectValue placeholder="Select validator" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {allAppRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="status" className="mt-1"><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        {allAuditStatuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
              </div>

              <div>
                <Label htmlFor="chapterReferenceTag">Chapter Reference Tag (Optional)</Label>
                 <Controller
                  name="chapterReferenceTag"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <SelectTrigger id="chapterReferenceTag" className="mt-1"><SelectValue placeholder="Select chapter tag" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {allMockComplianceChapters.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="col-span-full">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" {...register("notes")} className="mt-1 min-h-[100px]" />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="border-t pt-4 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> {existingRecord ? 'Save Changes' : 'Create Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
