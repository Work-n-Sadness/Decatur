
"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockStaffResponsibilityMatrix } from '@/lib/mock-data';
import type { Role, TaskCategory } from '@/types';
import { User, Briefcase, ListChecks, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTaskCategoryIcon } from '@/components/icons';

interface StaffResponsibility {
  role: Role;
  responsibilities: {
    taskName: string;
    deliverables: string;
    category: TaskCategory;
  }[];
}

const allRoles: Role[] = ['Nurse', 'Caregiver', 'Admin', 'Maintenance', 'Director'];

export default function StaffMatrixPage() {
  const [matrixData, setMatrixData] = useState<StaffResponsibility[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | 'all'>('all');

  useEffect(() => {
    // Simulate fetching data
    setMatrixData(mockStaffResponsibilityMatrix);
  }, []);

  const filteredMatrixData = selectedRole === 'all' 
    ? matrixData 
    : matrixData.filter(item => item.role === selectedRole);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-accent" /> Staff Responsibility Matrix
          </CardTitle>
          <CardDescription>
            Overview of roles and their assigned compliance tasks and deliverables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 max-w-xs">
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role | 'all')}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {allRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px] text-base">
                    <User className="inline-block h-5 w-5 mr-2 text-muted-foreground" />Role
                  </TableHead>
                  <TableHead className="text-base">
                    <Briefcase className="inline-block h-5 w-5 mr-2 text-muted-foreground" />Assigned Tasks & Responsibilities
                  </TableHead>
                  <TableHead className="text-base">
                    <ListChecks className="inline-block h-5 w-5 mr-2 text-muted-foreground" />Deliverables
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatrixData.length > 0 ? filteredMatrixData.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    <TableCell className="font-semibold text-primary-foreground align-top pt-4">
                      <Badge variant="secondary" className="text-md px-3 py-1">{item.role}</Badge>
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      <ul className="space-y-3">
                        {item.responsibilities.map((resp, rIndex) => {
                           const CategoryIcon = getTaskCategoryIcon(resp.category);
                           return (
                            <li key={rIndex} className="text-sm">
                              <p className="font-medium text-foreground">{resp.taskName}</p>
                              <p className="text-xs text-muted-foreground flex items-center">
                                <CategoryIcon className="h-3 w-3 mr-1.5" /> {resp.category}
                              </p>
                            </li>
                           );
                        })}
                      </ul>
                    </TableCell>
                    <TableCell className="align-top pt-4">
                       <ul className="space-y-3">
                        {item.responsibilities.map((resp, rIndex) => (
                            <li key={rIndex} className="text-sm text-muted-foreground">
                                {resp.deliverables}
                            </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No responsibilities found for the selected role.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
