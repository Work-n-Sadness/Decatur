"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming you have firebase initialized in lib/firebase.ts
import { TaskCard } from '@/components/dashboard/task-card'; // Assuming a TaskCard component exists
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Task } from '@/types'; // Assuming you have a Task type definition
import { groupBy } from '@/lib/utils'; // Assuming a utility function for grouping

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    // Initialize filters with empty strings or default values
    taskName: '',
    category: '',
    frequency: '',
    status: '',
    responsibleRole: '',
    complianceChapter: '',
    specialCareTag: '',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      let tasksQuery = query(collection(db, 'checklistTasks'));
      setError(null); // Reset error

      try {
        // Apply filters (Firestore queries can only have one '==', so for multiple filters
        // you might need to fetch and filter client-side or use more advanced querying)
        // For a simple example with one '==', let's apply only one filter at a time
        // or consider fetching all and filtering client-side for more complex combinations.
        // As per the instructions, we will apply all filters here, but note the Firestore limitations.
        if (filters.taskName) {
          tasksQuery = query(tasksQuery, where('taskName', '==', filters.taskName));
        }
        if (filters.category) {
          tasksQuery = query(tasksQuery, where('category', '==', filters.category));
        }
        if (filters.frequency) {
          tasksQuery = query(tasksQuery, where('frequency', '==', filters.frequency));
        }
        if (filters.status) {
          tasksQuery = query(tasksQuery, where('status', '==', filters.status));
        }
        if (filters.responsibleRole) {
          tasksQuery = query(tasksQuery, where('responsibleRole', '==', filters.responsibleRole));
        }
        if (filters.complianceChapter) {
          tasksQuery = query(tasksQuery, where('complianceChapter', '==', filters.complianceChapter));
        }
        if (filters.specialCareTag) {
          tasksQuery = query(tasksQuery, where('specialCareTag', '==', filters.specialCareTag));
        }

        const querySnapshot = await getDocs(tasksQuery);
        const fetchedTasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks.");
        setTasks([]); // Clear tasks on error
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filters]); // Refetch when filters change

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleExportTaskReport = () => {
    // Implement export logic (e.g., call a Firebase Function)
    console.log("Exporting Task Report");
  };

  const handleExportAuditLog = () => {
    // Implement export logic (e.g., call a Firebase Function)
    console.log("Exporting Audit Log");
  };

  const handleExportSurveyPacket = () => {
    // Implement export logic (e.g., call a Firebase Function)
    console.log("Exporting Survey Packet");
  };

  const groupedTasks = groupBy(tasks, 'category');

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Task Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Filter by Task Name"
          value={filters.taskName}
          onChange={(e) => handleFilterChange('taskName', e.target.value)}
        />
        <Select onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            {/* Populate with actual categories from your data or a predefined list */}
            <SelectItem value="Medication Audits">Medication Audits</SelectItem>
            <SelectItem value="Environmental Checks">Environmental Checks</SelectItem>
            {/* Add more categories */}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFilterChange('frequency', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Frequency" />
          </SelectTrigger>
          <SelectContent>
            {/* Populate with actual frequencies */}
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            {/* Add more frequencies */}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Flagged">Flagged</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by Responsible Role"
          value={filters.responsibleRole}
          onChange={(e) => handleFilterChange('responsibleRole', e.target.value)}
        />
        <Input
          placeholder="Filter by Compliance Chapter"
          value={filters.complianceChapter}
          onChange={(e) => handleFilterChange('complianceChapter', e.target.value)}
        />
        <Input
          placeholder="Filter by Special Care Tag"
          value={filters.specialCareTag}
          onChange={(e) => handleFilterChange('specialCareTag', e.target.value)}
        />
      </div>

      <div className="flex space-x-4 mb-6">
        <Button onClick={handleExportTaskReport}>Export Task Report</Button>
        <Button onClick={handleExportAuditLog}>Export Audit Log</Button>
        <Button onClick={handleExportSurveyPacket}>Export Survey Packet</Button>
      </div>

      {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                // Pass other necessary props to TaskCard
              />
            ))}
          </div>
          <Separator className="mt-6" />
        </div>
      ))}
    </div>
  );
}