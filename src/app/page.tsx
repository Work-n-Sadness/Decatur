
"use client";

import React, { useState, useEffect } from 'react';
import type { Task, FacilityCertification, AuditRecord } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { parseISO } from 'date-fns';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import ComplianceScorecard from '@/components/dashboard/compliance-scorecard';
import AlertsDeadlines from '@/components/dashboard/alerts-deadlines';
import QuickLinks from '@/components/dashboard/quick-links';
import TaskProgress from '@/components/dashboard/task-progress';
import ResidentSummary from '@/components/dashboard/resident-summary';
import { Skeleton } from '@/components/ui/skeleton';


export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [certifications, setCertifications] = useState<FacilityCertification[]>([]);
  const [faceSheets, setFaceSheets] = useState<AuditRecord[]>([]);
  const [movements, setMovements] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tasksResponse, certsResponse, faceSheetsResponse, movementsResponse] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/facility-certifications'),
          fetch('/api/face-sheets'),
          fetch('/api/admissions-discharges')
        ]);

        if (!tasksResponse.ok) throw new Error(`Failed to fetch tasks: ${tasksResponse.statusText}`);
        if (!certsResponse.ok) throw new Error(`Failed to fetch certifications: ${certsResponse.statusText}`);
        if (!faceSheetsResponse.ok) throw new Error(`Failed to fetch face sheets: ${faceSheetsResponse.statusText}`);
        if (!movementsResponse.ok) throw new Error(`Failed to fetch movements: ${movementsResponse.statusText}`);


        const tasksData: any[] = await tasksResponse.json();
        const certsData: any[] = await certsResponse.json();
        const faceSheetsData: any[] = await faceSheetsResponse.json();
        const movementsData: any[] = await movementsResponse.json();
        
        const processDate = (date: any) => (date ? parseISO(date) : null);
        
        const processedTasks: Task[] = tasksData.map(item => ({
          ...item,
          startDate: processDate(item.startDate),
          endDate: processDate(item.endDate),
          lastCompletedOn: processDate(item.lastCompletedOn),
          activities: item.activities?.map((act: any) => ({ ...act, timestamp: processDate(act.timestamp) })) || [],
        }));
        
        const processedCerts: FacilityCertification[] = certsData.map(item => ({
            ...item,
            issueDate: processDate(item.issueDate),
            expirationDate: processDate(item.expirationDate),
            createdAt: processDate(item.createdAt),
            updatedAt: processDate(item.updatedAt),
        }));
        
        const processedAuditRecords = (data: any[]): AuditRecord[] => data.map(item => ({
            ...item,
            lastCompletedDate: processDate(item.lastCompletedDate),
            createdAt: processDate(item.createdAt),
            updatedAt: processDate(item.updatedAt),
        }));

        setTasks(processedTasks);
        setCertifications(processedCerts);
        setFaceSheets(processedAuditRecords(faceSheetsData));
        setMovements(processedAuditRecords(movementsData));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Dashboard",
          description: error instanceof Error ? error.message : "Could not load all dashboard data.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);
  
  if (loading) {
    return (
       <div className="space-y-6">
        <WelcomeBanner />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full lg:col-span-2" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
           <Skeleton className="h-64 w-full" />
           <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ComplianceScorecard tasks={tasks} />
        <QuickLinks />
      </div>
       <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
         <TaskProgress tasks={tasks} />
         <ResidentSummary residents={faceSheets} movements={movements} />
       </div>
      <AlertsDeadlines tasks={tasks} certifications={certifications} />
    </div>
  );
}
