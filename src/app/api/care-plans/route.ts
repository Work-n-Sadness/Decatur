
import { NextResponse } from 'next/server';
import { mockCarePlanAuditRecords } from '@/lib/mock-data';
import type { AuditRecord } from '@/types';
import { parseISO } from 'date-fns';

export async function GET() {
  try {
    // In a real application, you would fetch this data from your Supabase database.
    // For now, we're returning mock data.
    // Ensure dates are in ISO string format for JSON serialization.
    const dataWithSerializableDates: AuditRecord[] = mockCarePlanAuditRecords.map(record => ({
      ...record,
      lastCompletedDate: record.lastCompletedDate 
        ? (record.lastCompletedDate instanceof Date ? record.lastCompletedDate.toISOString() : parseISO(record.lastCompletedDate as unknown as string).toISOString()) 
        : null,
      createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : parseISO(record.createdAt as unknown as string).toISOString(),
      updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : parseISO(record.updatedAt as unknown as string).toISOString(),
    }));

    return NextResponse.json(dataWithSerializableDates);
  } catch (error) {
    console.error("API Error in /api/care-plans:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
        { message: "Internal Server Error fetching care plan records.", error: errorMessage },
        { status: 500 }
    );
  }
}
