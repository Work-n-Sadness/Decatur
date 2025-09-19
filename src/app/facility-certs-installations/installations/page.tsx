
"use client";

import React, { useState, useEffect } from 'react';
import { mockInstallations } from '@/lib/mock-data'; // Using mock data directly for now
import type { FacilityInstallation, InstallationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { getInstallationCategoryIcon } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';


// Helper function to determine badge variant based on status
const getInstallationStatusBadgeVariant = (status: InstallationStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Operational':
      return 'default'; // Green or primary
    case 'Needs Repair':
      return 'secondary'; // Yellow or orange
    case 'Out of Service':
      return 'destructive'; // Red
    default:
      return 'outline';
  }
};


export default function InstallationsPage() {
  const [installations, setInstallations] = useState<FacilityInstallation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInstallations = async () => {
        setLoading(true);
        setError(null);
        try {
            // In a real app, this would be: const response = await fetch('/api/installations');
            // For now, we simulate an async fetch from mock data.
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

            if (!mockInstallations) {
                throw new Error("Installation data is not available.");
            }

            const processedData: FacilityInstallation[] = mockInstallations.map(item => ({
                ...item,
                lastInspectionDate: item.lastInspectionDate ? (typeof item.lastInspectionDate === 'string' ? parseISO(item.lastInspectionDate) : item.lastInspectionDate) : null,
                nextInspectionDue: item.nextInspectionDue ? (typeof item.nextInspectionDue === 'string' ? parseISO(item.nextInspectionDue) : item.nextInspectionDue) : null,
                createdAt: typeof item.createdAt === 'string' ? parseISO(item.createdAt) : item.createdAt,
                updatedAt: typeof item.updatedAt === 'string' ? parseISO(item.updatedAt) : item.updatedAt,
            }));

            setInstallations(processedData);
        } catch (err: any) {
            console.error("Error fetching installations:", err);
            setError("Failed to load installation logs. Please try again later.");
            toast({ variant: "destructive", title: "Error", description: "Could not load installation logs." });
        } finally {
            setLoading(false);
        }
    };

    fetchInstallations();
  }, [toast]);

  const pageTitle = "Installations & Infrastructure Compliance";
  const descriptionText = "Track major facility systems, their inspection schedules, and compliance status. Ensure all critical infrastructure is operational and meets safety standards.";

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {pageTitle}
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Installation
          </Button>
        </CardTitle>
        <CardDescription>
          {descriptionText}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2">Loading installations...</span>
          </div>
        )}
        {error && (
          <div className="text-destructive p-4 border border-destructive bg-destructive/10 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2"/> {error}
          </div>
        )}
        {!loading && !error && installations.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No installations found. Add a new installation to get started.
          </div>
        )}
        {!loading && !error && installations.length > 0 && (
           <ScrollArea className="h-[600px] rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
                <TableRow>
                  <TableHead>System</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Inspected</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Log</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installations.map(install => {
                  const CategoryIcon = getInstallationCategoryIcon(install.category);
                  const lastInspectionDate = install.lastInspectionDate ? new Date(install.lastInspectionDate) : null;
                  const nextInspectionDue = install.nextInspectionDue ? new Date(install.nextInspectionDue) : null;
                  
                  return (
                    <TableRow key={install.id}>
                      <TableCell className="font-medium">{install.installationName}</TableCell>
                      <TableCell className="flex items-center">
                        <CategoryIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {install.category}
                      </TableCell>
                      <TableCell>{install.location || 'N/A'}</TableCell>
                      <TableCell>{lastInspectionDate && isValid(lastInspectionDate) ? format(lastInspectionDate, 'PP') : 'N/A'}</TableCell>
                      <TableCell>{nextInspectionDue && isValid(nextInspectionDue) ? formatDistanceToNow(nextInspectionDue, { addSuffix: true }) : 'N/A'}</TableCell>
                      <TableCell>{install.inspectionFrequency || 'N/A'}</TableCell>
                      <TableCell>{install.serviceVendor || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getInstallationStatusBadgeVariant(install.status)}>
                          {install.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {install.uploadInspectionLog ? (
                          <Button variant="link" size="sm" asChild className="p-0 h-auto">
                            <a href={install.uploadInspectionLog} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                              View Log <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
