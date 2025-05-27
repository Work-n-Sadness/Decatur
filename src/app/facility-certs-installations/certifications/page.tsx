
"use client";

import React, { useState, useEffect } from 'react';
import type { FacilityCertification, CertificationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { format, isValid as isValidDate, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";

// Helper function to determine badge variant based on status
const getCertificationStatusBadgeVariant = (status: CertificationStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active':
      return 'default'; // Typically green or primary
    case 'Due Soon':
      return 'secondary'; // Typically yellow or orange
    case 'Expired':
      return 'destructive'; // Typically red
    default:
      return 'outline';
  }
};

export function FacilityCertificationsTable() {
  const [certifications, setCertifications] = useState<FacilityCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCertifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/facility-certifications'); // Ensure this path is correct
        if (!response.ok) {
          let errorDetails = `HTTP error ${response.status}`;
          if (response.statusText) errorDetails += ` ${response.statusText}`;
          // Try to get more details from the response body if it's JSON
          try {
            const errorBody = await response.json();
            if (errorBody && errorBody.message) errorDetails = `${errorDetails}: ${errorBody.message}`;
            if (errorBody && errorBody.error) errorDetails = `${errorDetails} (Server error: ${errorBody.error})`;
          } catch (e) { /* Ignore if body isn't JSON or response is not a JSON error */ }
          throw new Error(`Failed to fetch certifications. ${errorDetails}`);
        }
        const data: any[] = await response.json();
        
        const processedData: FacilityCertification[] = data.map(item => {
          // Ensure all date fields are parsed correctly
          const issueDate = item.issueDate ? parseISO(item.issueDate) : new Date(0);
          const expirationDate = item.expirationDate ? parseISO(item.expirationDate) : new Date(0);
          const createdAt = item.createdAt ? parseISO(item.createdAt) : new Date(0);
          const updatedAt = item.updatedAt ? parseISO(item.updatedAt) : new Date(0);

          return {
            ...item,
            issueDate: isValidDate(issueDate) ? issueDate : new Date(0),
            expirationDate: isValidDate(expirationDate) ? expirationDate : new Date(0),
            createdAt: isValidDate(createdAt) ? createdAt : new Date(0),
            updatedAt: isValidDate(updatedAt) ? updatedAt : new Date(0),
          };
        });
        setCertifications(processedData);
      } catch (err: any) {
        console.error("Error fetching certifications:", err);
        const description = err.message || "Could not load certifications. Please try again later. Ensure the API route /api/facility-certifications is available and working.";
        setError(description);
        toast({ variant: "destructive", title: "Error Loading Certifications", description });
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
        No certifications found. Add a new certification to get started, or check the API endpoint.
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
              <TableCell>{isValidDate(cert.issueDate) ? format(cert.issueDate, 'PP') : 'N/A'}</TableCell>
              <TableCell>{isValidDate(cert.expirationDate) ? format(cert.expirationDate, 'PP') : 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getCertificationStatusBadgeVariant(cert.status)}>
                  {cert.status}
                </Badge>
              </TableCell>
              <TableCell>{cert.lastReviewedBy || 'N/A'}</TableCell>
              <TableCell>
                {cert.certificateUpload ? (
                  <Button variant="link" size="sm" asChild className="p-0 h-auto">
                    <a href={cert.certificateUpload} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                      View Document <ExternalLink className="ml-1 h-3 w-3" />
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
