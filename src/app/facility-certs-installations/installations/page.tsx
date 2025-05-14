
"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, type Timestamp } from 'firebase/firestore';
import type { FacilityInstallation, InstallationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { getInstallationCategoryIcon } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "facilityInstallations"), orderBy("nextInspectionDue", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          lastInspectionDate: docData.lastInspectionDate && (docData.lastInspectionDate as Timestamp).toDate ? (docData.lastInspectionDate as Timestamp).toDate() : null,
          nextInspectionDue: docData.nextInspectionDue && (docData.nextInspectionDue as Timestamp).toDate ? (docData.nextInspectionDue as Timestamp).toDate() : null,
          createdAt: docData.createdAt && (docData.createdAt as Timestamp).toDate ? (docData.createdAt as Timestamp).toDate() : new Date(),
          updatedAt: docData.updatedAt && (docData.updatedAt as Timestamp).toDate ? (docData.updatedAt as Timestamp).toDate() : new Date(),
        } as FacilityInstallation;
      });
      setInstallations(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching installations:", err);
      setError("Failed to load installations. Please try again later.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
                  return (
                    <TableRow key={install.id}>
                      <TableCell className="font-medium">{install.installationName}</TableCell>
                      <TableCell className="flex items-center">
                        <CategoryIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {install.category}
                      </TableCell>
                      <TableCell>{install.location || 'N/A'}</TableCell>
                      <TableCell>{install.lastInspectionDate && isValid(install.lastInspectionDate) ? format(install.lastInspectionDate, 'PP') : 'N/A'}</TableCell>
                      <TableCell>{install.nextInspectionDue && isValid(install.nextInspectionDue) ? formatDistanceToNow(install.nextInspectionDue, { addSuffix: true }) : 'N/A'}</TableCell>
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
                            <a href={install.uploadInspectionLog} target="_blank" rel="noopener noreferrer" className="text-accent">
                              View Log
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

