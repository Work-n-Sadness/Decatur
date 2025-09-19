
"use client";

import React, { useMemo } from 'react';
import type { AuditRecord, ResidentCareFlag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Droplets, AlertTriangle, Users, UserPlus, UserMinus, FileText } from 'lucide-react';
import { isThisWeek, startOfWeek } from 'date-fns';

interface ResidentSummaryProps {
  residents: AuditRecord[];
  movements: AuditRecord[];
}

const RiskFlag: React.FC<{ icon: React.ElementType, label: string, count: number }> = ({ icon: Icon, label, count }) => (
  <div className="flex items-center space-x-2">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <div className="text-sm">
      <span className="font-semibold">{count}</span>
      <span className="text-muted-foreground ml-1">{label}</span>
    </div>
  </div>
);

export default function ResidentSummary({ residents, movements }: ResidentSummaryProps) {
  const residentCount = useMemo(() => residents.filter(r => r.status !== 'Archived').length, [residents]);
  const today = new Date();
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });

  const moveEventsThisWeek = useMemo(() => {
    return movements.filter(m => {
      const eventDate = m.lastCompletedDate || m.createdAt;
      return eventDate && isThisWeek(new Date(eventDate), { weekStartsOn: 1 });
    });
  }, [movements]);

  const moveInsThisWeek = moveEventsThisWeek.filter(m => m.status === 'Admission Complete').length;
  const moveOutsThisWeek = moveEventsThisWeek.filter(m => m.status === 'Discharge Complete').length;

  const riskDistribution = useMemo(() => {
    const activeResidents = residents.filter(r => r.status !== 'Archived');
    const counts: Record<string, number> = {
      dementia: 0,
      diabetic: 0,
      fall_risk: 0,
      total_flags: 0,
    };
    activeResidents.forEach(resident => {
      let hasFlag = false;
      if (resident.residentCareFlags?.includes('dementia')) {
        counts.dementia++;
        hasFlag = true;
      }
      if (resident.residentCareFlags?.includes('diabetes')) {
        counts.diabetic++;
        hasFlag = true;
      }
      if (resident.residentCareFlags?.some(flag => ['fall_risk_high', 'fall_risk_medium'].includes(flag))) {
        counts.fall_risk++;
        hasFlag = true;
      }
      if(hasFlag) counts.total_flags++;
    });
    return counts;
  }, [residents]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6 text-accent" />
          Resident Summary
        </CardTitle>
        <CardDescription>A quick overview of the resident population and key risk factors.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-around items-center p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{residentCount}</p>
            <p className="text-sm text-muted-foreground">Current Residents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold flex items-center gap-2 text-green-600">
                <UserPlus className="h-5 w-5" /> {moveInsThisWeek}
            </p>
            <p className="text-sm text-muted-foreground">Move-ins This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold flex items-center gap-2 text-red-600">
                <UserMinus className="h-5 w-5" /> {moveOutsThisWeek}
            </p>
            <p className="text-sm text-muted-foreground">Move-outs This Week</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Key Risk Distribution
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <RiskFlag icon={Brain} label="Dementia" count={riskDistribution.dementia} />
            <RiskFlag icon={Droplets} label="Diabetic" count={riskDistribution.diabetic} />
            <RiskFlag icon={AlertTriangle} label="High/Medium Fall Risk" count={riskDistribution.fall_risk} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
