
import { NextResponse } from 'next/server';
import { mockTasks } from '@/lib/mock-data';
import type { Task } from '@/types';
import { isValid, parseISO } from 'date-fns';

export async function GET() {
  try {
    const dataWithSerializableDates: Task[] = mockTasks.map(task => {
      
      const toISO = (date: any): string | null => {
        if (!date) return null;
        const d = date instanceof Date ? date : parseISO(date as string);
        return isValid(d) ? d.toISOString() : null;
      };

      const activities = Array.isArray(task.activities) ? task.activities.map(activity => ({
        ...activity,
        timestamp: toISO(activity.timestamp) || new Date(0).toISOString(),
      })) : [];

      return {
        ...task,
        startDate: toISO(task.startDate) || new Date(0).toISOString(),
        endDate: toISO(task.endDate),
        lastCompletedOn: toISO(task.lastCompletedOn),
        activities,
        recurrenceConfig: task.recurrenceConfig ? {
            ...task.recurrenceConfig,
            patternStartDate: toISO(task.recurrenceConfig.patternStartDate) || new Date(0).toISOString(),
            patternEndDate: toISO(task.recurrenceConfig.patternEndDate),
        } : undefined,
      };
    });

    return NextResponse.json(dataWithSerializableDates);
  } catch (error) {
    console.error("API Error in /api/tasks:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
        { message: "Internal Server Error fetching tasks.", error: errorMessage },
        { status: 500 }
    );
  }
}
