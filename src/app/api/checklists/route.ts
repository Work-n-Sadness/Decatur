
import { NextResponse } from 'next/server';
import { mockChecklistItems } from '@/lib/mock-data';
import type { ChecklistItem } from '@/types';
import { isValid, parseISO } from 'date-fns';

export async function GET() {
  try {
    // Ensure dates are in ISO string format for JSON serialization.
    // And ensure they are valid Date objects before calling toISOString()
    const dataWithSerializableDates: ChecklistItem[] = mockChecklistItems.map(item => {
      // Helper to safely convert to ISO string
      const toISO = (date: string | Date | null | undefined): string | null => {
        if (!date) return null;
        const d = typeof date === 'string' ? parseISO(date) : date;
        return isValid(d) ? d.toISOString() : null;
      };

      return {
        ...item,
        // dueDate from mock data can be a string 'YYYY-MM-DD' or a Date object
        dueDate: item.dueDate ? toISO(item.dueDate)?.split('T')[0] : new Date(0).toISOString().split('T')[0], // Ensure YYYY-MM-DD format
        createdAt: toISO(item.createdAt) || new Date(0).toISOString(), // Ensure it's always a valid ISO string
        lastCompletedOn: toISO(item.lastCompletedOn),
        statusUpdatedAt: toISO(item.statusUpdatedAt),
      };
    });

    return NextResponse.json(dataWithSerializableDates);
  } catch (error) {
    console.error("API Error in /api/checklists:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
        { message: "Internal Server Error fetching checklists.", error: errorMessage },
        { status: 500 }
    );
  }
}
