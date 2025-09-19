"use client";

import React, { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paperclip, Save, X } from 'lucide-react';

interface AttachEvidenceDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveEvidence: (taskId: string, evidenceLink: string) => void;
}

export default function AttachEvidenceDialog({ task, isOpen, onClose, onSaveEvidence }: AttachEvidenceDialogProps) {
  const [evidenceLink, setEvidenceLink] = useState('');

  useEffect(() => {
    if (task && isOpen) {
      setEvidenceLink(task.evidenceLink || '');
    } else {
      setEvidenceLink('');
    }
  }, [task, isOpen]);

  if (!task) return null;

  const handleSave = () => {
    onSaveEvidence(task.id, evidenceLink);
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
            Provide a URL link to the evidence for task: "{task.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="evidence-link" className="text-right col-span-1">
              Link URL
            </Label>
            <Input
              id="evidence-link"
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
