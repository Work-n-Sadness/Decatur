
"use client";

import React, { useState, useEffect } from 'react';
import type { AuditRecord } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paperclip, Save, X } from 'lucide-react';

interface AttachEvidenceDialogAuditProps {
  record: AuditRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveEvidence: (recordId: string, evidenceLink: string) => void;
}

export function AttachEvidenceDialogAudit({ record, isOpen, onClose, onSaveEvidence }: AttachEvidenceDialogAuditProps) {
  const [evidenceLink, setEvidenceLink] = useState('');

  useEffect(() => {
    if (record && isOpen) {
      setEvidenceLink(record.evidenceLink || '');
    } else if (!isOpen) {
      setEvidenceLink(''); // Reset when closed
    }
  }, [record, isOpen]);

  if (!record) return null;

  const handleSave = () => {
    if (record) {
      onSaveEvidence(record.id, evidenceLink);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Paperclip className="mr-2 h-5 w-5" />
            Attach/Edit Evidence
          </DialogTitle>
          <DialogDescription>
            Provide a URL link to the evidence for audit record: "{record.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="evidence-link-audit" className="text-right col-span-1">
              Link URL
            </Label>
            <Input
              id="evidence-link-audit"
              value={evidenceLink}
              onChange={(e) => setEvidenceLink(e.target.value)}
              placeholder="https://example.com/evidence.pdf"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
