
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter, ArrowDownUp, Download } from "lucide-react";
import type { TaskCategory, TaskStatus, Role } from "@/types";

interface DashboardFiltersProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: Partial<{ category: TaskCategory; status: TaskStatus; role: Role }>) => void;
  onSortChange: (sortBy: string) => void;
  onExport: () => void; // Placeholder for export functionality
  categories: TaskCategory[];
  statuses: TaskStatus[];
  roles: Role[];
}

export default function DashboardFilters({ 
  onSearch, 
  onFilterChange, 
  onSortChange, 
  onExport,
  categories,
  statuses,
  roles
}: DashboardFiltersProps) {
  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Select onValueChange={(value) => onFilterChange({ category: value as TaskCategory })}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ status: value as TaskStatus })}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
             {statuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ role: value as Role })}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
          </SelectContent>
        </Select>
        
        <Select onValueChange={(value) => onSortChange(value)}>
          <SelectTrigger>
            <ArrowDownUp className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="dueDate_asc">Due Date (Oldest)</SelectItem>
            <SelectItem value="dueDate_desc">Due Date (Newest)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="progress_desc">Progress (High-Low)</SelectItem>
            <SelectItem value="progress_asc">Progress (Low-High)</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={onExport} variant="outline" className="w-full lg:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
