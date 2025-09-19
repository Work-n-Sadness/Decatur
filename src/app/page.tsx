
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Task, FacilityCertification } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { parseISO } from 'date-fns';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import ComplianceScorecard from '@/components/dashboard/compliance-scorecard';
import AlertsDeadlines from '@/components/dashboard/alerts-deadlines';
import QuickLinks from '@/components/dashboard/quick-links';
import { Skeleton } from '@/components/ui/skeleton';


export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [certifications, setCertifications] = useState<FacilityCertification[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tasksResponse, certsResponse] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/facility-certifications')
        ]);

        if (!tasksResponse.ok) {
          throw new Error(`Failed to fetch tasks: ${tasksResponse.statusText}`);
        }
        if (!certsResponse.ok) {
            throw new Error(`Failed to fetch certifications: ${certsResponse.statusText}`);
        }

        const tasksData: any[] = await tasksResponse.json();
        const certsData: any[] = await certsResponse.json();
        
        const processedTasks: Task[] = tasksData.map(item => ({
          ...item,
          startDate: parseISO(item.startDate),
          endDate: item.endDate ? parseISO(item.endDate) : null,
          lastCompletedOn: item.lastCompletedOn ? parseISO(item.lastCompletedOn) : null,
          activities: item.activities?.map((act: any) => ({ ...act, timestamp: parseISO(act.timestamp) })) || [],
        }));
        
        const processedCerts: FacilityCertification[] = certsData.map(item => ({
            ...item,
            issueDate: parseISO(item.issueDate),
            expirationDate: parseISO(item.expirationDate),
            createdAt: parseISO(item.createdAt),
            updatedAt: parseISO(item.updatedAt),
        }));

        setTasks(processedTasks);
        setCertifications(processedCerts);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Dashboard",
          description: error instanceof Error ? error.message : "Could not load tasks and certifications.",
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
         <Skeleton className="h-64 w-full" />
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
      <AlertsDeadlines tasks={tasks} certifications={certifications} />
    </div>
  );
}
