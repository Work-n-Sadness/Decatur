
import { NextResponse } from 'next/server';
import { mockTasks } from '@/lib/mock-data';
import type { Task } from '@/types';

export async function GET() {
  try {
    const dataWithSerializableDates: Task[] = mockTasks.map(task => {
      // Ensure properties exist and are of expected type before calling methods
      const startDate = task.startDate instanceof Date 
        ? task.startDate.toISOString() 
        : (typeof task.startDate === 'string' ? task.startDate : new Date(0).toISOString()); // Fallback for safety

      const endDate = task.endDate 
        ? (task.endDate instanceof Date ? task.endDate.toISOString() : (typeof task.endDate === 'string' ? task.endDate : null)) 
        : null;

      const lastCompletedOn = task.lastCompletedOn 
        ? (task.lastCompletedOn instanceof Date ? task.lastCompletedOn.toISOString() : (typeof task.lastCompletedOn === 'string' ? task.lastCompletedOn : null))
        : null;

      const activities = Array.isArray(task.activities) ? task.activities.map(activity => {
        const timestamp = activity.timestamp instanceof Date 
          ? activity.timestamp.toISOString() 
          : (typeof activity.timestamp === 'string' ? activity.timestamp : new Date(0).toISOString()); // Fallback
        return {
          ...activity,
          timestamp,
        };
      }) : [];

      return {
        ...task,
        startDate,
        endDate,
        lastCompletedOn,
        activities,
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
