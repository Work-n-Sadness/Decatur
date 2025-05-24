
"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AuditRecord, AuditStatus, AppRole } from '@/types';
import { Edit3, Paperclip, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface AuditTableProps {
  records: AuditRecord[];
  onEditRecord: (record: AuditRecord) => void;
  onAttachEvidence: (record: AuditRecord) => void;
  loading: boolean;
  error: string | null;
}

const getStatusBadgeVariant = (status: AuditStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Compliant':
    case 'Resolved':
      return 'default'; // Typically green or primary
    case 'Pending Review':
    case 'In Progress':
      return 'secondary'; // Typically blue or yellow
    case 'Action Required':
    case 'Non-Compliant':
      return 'destructive'; // Typically red
    default:
      return 'outline';
  }
};

const displayRole = (role: AppRole | AppRole[] | undefined): string => {
  if (!role) return 'N/A';
  if (Array.isArray(role)) return role.join(' / ');
  return role;
};

export function AuditTable({ records, onEditRecord, onAttachEvidence, loading, error }: AuditTableProps) {
  if (loading) {
    return <div className="flex justify-center items-center h-64"><RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" /> <span className="ml-3 text-lg">Loading audit records...</span></div>;
  }

  if (error) {
    return <div className="text-destructive p-6 border border-destructive bg-destructive/10 rounded-md flex items-center text-lg"><AlertCircle className="h-6 w-6 mr-3"/> {error}</div>;
  }

  if (records.length === 0) {
    return <div className="text-center text-muted-foreground py-10 text-lg">No audit records found matching your criteria.</div>;
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
          <TableRow>
            <TableHead className="min-w-[200px]">Audit Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Assigned Role</TableHead>
            <TableHead>Validator</TableHead>
            <TableHead>Last Completed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Chapter Tag</TableHead>
            <TableHead>Evidence</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.name}</TableCell>
              <TableCell>{record.category}</TableCell>
              <TableCell>{displayRole(record.assignedRole)}</TableCell>
              <TableCell>{record.validator || 'N/A'}</TableCell>
              <TableCell>
                {record.lastCompletedDate ? format(new Date(record.lastCompletedDate), 'PP') : 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
              </TableCell>
              <TableCell>{record.chapterReferenceTag || 'N/A'}</TableCell>
              <TableCell>
                {record.evidenceLink ? (
                  <Button variant="link" size="sm" asChild className="p-0 h-auto">
                    <a href={record.evidenceLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                      View <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="outline" size="sm" onClick={() => onEditRecord(record)} className="h-8 px-2">
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onAttachEvidence(record)} className="h-8 px-2">
                  <Paperclip className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
