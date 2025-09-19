
"use client";

import React, { useMemo } from 'react';
import type { Task, FacilityCertification } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertTriangle, CalendarClock, ChevronsRight } from 'lucide-react';
import { format, differenceInDays, startOfDay } from 'date-fns';

interface AlertsDeadlinesProps {
  tasks: Task[];
  certifications: FacilityCertification[];
}

export default function AlertsDeadlines({ tasks, certifications }: AlertsDeadlinesProps) {
  const today = startOfDay(new Date());

  const overdueTasks = useMemo(() => 
    tasks.filter(task => 
      (task.status === 'Pending' || task.status === 'Flagged') && 
      task.endDate && 
      differenceInDays(today, startOfDay(task.endDate)) > 0
    ).slice(0, 5), // Limit to 5 for the dashboard
    [tasks, today]
  );

  const expiringCerts = useMemo(() => 
    certifications.filter(cert => {
      const daysUntilExpiry = differenceInDays(startOfDay(cert.expirationDate), today);
      return cert.status !== 'Expired' && daysUntilExpiry >= 0 && daysUntilExpiry <= 90;
    }).sort((a, b) => a.expirationDate.getTime() - b.expirationDate.getTime())
    .slice(0, 5), // Limit to 5
    [certifications, today]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          Alerts & Deadlines
        </CardTitle>
        <CardDescription>Immediate action items and upcoming deadlines.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-2 flex items-center">Overdue Checklists</h3>
          {overdueTasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueTasks.map(task => (
                  <TableRow key={task.id} className="hover:bg-red-500/10">
                    <TableCell className="font-medium">
                      <Link href="/checklists" className="hover:underline text-primary">
                        {task.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        {task.endDate ? format(task.endDate, 'MMM dd, yyyy') : 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.assignedStaff}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground p-4 text-center">No overdue tasks. Great job!</p>
          )}
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2 flex items-center">Expiring Certificates (Next 90 Days)</h3>
          {expiringCerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Expires On</TableHead>
                  <TableHead>Days Left</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringCerts.map(cert => {
                  const daysLeft = differenceInDays(startOfDay(cert.expirationDate), today);
                  return (
                    <TableRow key={cert.id} className="hover:bg-yellow-500/10">
                      <TableCell className="font-medium">
                         <Link href="/compliance-center/certificates" className="hover:underline text-primary">
                            {cert.certificationName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={daysLeft <= 30 ? 'destructive' : 'secondary'}>
                          {format(cert.expirationDate, 'MMM dd, yyyy')}
                        </Badge>
                      </TableCell>
                      <TableCell>{daysLeft}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground p-4 text-center">No certificates expiring in the next 90 days.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
