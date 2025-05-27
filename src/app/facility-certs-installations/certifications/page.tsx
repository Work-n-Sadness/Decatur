
"use client";

import React, { useState, useEffect } from 'react';
import type { FacilityCertification, CertificationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";

// Helper function to determine badge variant based on status
const getCertificationStatusBadgeVariant = (status: CertificationStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Due Soon':
      return 'secondary';
    case 'Expired':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Define FacilityCertificationsTable component
function FacilityCertificationsTable() {
  const [certifications, setCertifications] = useState<FacilityCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCertifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/facility-certifications');
        if (!response.ok) {
          let errorDetails = `HTTP error ${response.status}`;
          if (response.statusText) errorDetails += ` ${response.statusText}`;
          try {
            const errorBody = await response.json();
            if (errorBody && errorBody.message) errorDetails = `${errorDetails}: ${errorBody.message}`;
          } catch (e) { /* Ignore if body isn't JSON */ }
          throw new Error(`Failed to fetch certifications. ${errorDetails}`);
        }
        const data: any[] = await response.json();
        const processedData: FacilityCertification[] = data.map(item => ({
          ...item,
          issueDate: item.issueDate ? parseISO(item.issueDate) : new Date(0), // Fallback to prevent invalid date errors
          expirationDate: item.expirationDate ? parseISO(item.expirationDate) : new Date(0),
          createdAt: item.createdAt ? parseISO(item.createdAt) : new Date(0),
          updatedAt: item.updatedAt ? parseISO(item.updatedAt) : new Date(0),
        }));
        setCertifications(processedData);
      } catch (err: any) {
        console.error("Error fetching certifications:", err);
        setError(err.message || "Could not load certifications. Please try again later.");
        toast({ variant: "destructive", title: "Error", description: err.message || "Could not load certifications." });
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading certifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4 border border-destructive bg-destructive/10 rounded-md flex items-center">
        <AlertCircle className="h-5 w-5 mr-2"/> {error}
      </div>
    );
  }

  if (!loading && !error && certifications.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No certifications found. Add a new certification to get started.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Certifying Agency</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reviewed By</TableHead>
            <TableHead>Certificate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certifications.map(cert => (
            <TableRow key={cert.id}>
              <TableCell className="font-medium">{cert.certificationName}</TableCell>
              <TableCell>{cert.certifyingAgency}</TableCell>
              <TableCell>{isValid(cert.issueDate) ? format(cert.issueDate, 'PP') : 'N/A'}</TableCell>
              <TableCell>{isValid(cert.expirationDate) ? format(cert.expirationDate, 'PP') : 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getCertificationStatusBadgeVariant(cert.status)}>
                  {cert.status}
                </Badge>
              </TableCell>
              <TableCell>{cert.lastReviewedBy || 'N/A'}</TableCell>
              <TableCell>
                {cert.certificateUpload ? (
                  <Button variant="link" size="sm" asChild className="p-0 h-auto">
                    <a href={cert.certificateUpload} target="_blank" rel="noopener noreferrer" className="text-accent">
                      View Document
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

// Default export for the page
export default function CertificationsPage() {
  const pageTitle = "Facility Certifications";
  const descriptionText = "Track and monitor facility-level certifications. Ensure compliance with all regulatory requirements by keeping certifications up to date.";
  
  // TODO: Implement add new certification functionality - open a dialog/form
  const handleAddNewCertification = () => {
    console.log("Add new certification clicked"); 
    // Example: setIsFormOpen(true); setEditingRecord(null);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {pageTitle}
          <Button size="sm" onClick={handleAddNewCertification}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Certification
          </Button>
        </CardTitle>
        <CardDescription>
          {descriptionText}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FacilityCertificationsTable />
      </CardContent>
    </Card>
  );
}

// User's requested named export
export { FacilityCertificationsTable };
