
import { NextResponse } from 'next/server';
import { mockCaseManagementRecords } from '@/lib/mock-data';
import type { AuditRecord } from '@/types';
import { parseISO } from 'date-fns';

export async function GET() {
  try {
    // Ensure dates are in ISO string format for JSON serialization.
    const dataWithSerializableDates: AuditRecord[] = mockCaseManagementRecords.map(record => ({
      ...record,
      lastCompletedDate: record.lastCompletedDate 
        ? (record.lastCompletedDate instanceof Date ? record.lastCompletedDate.toISOString() : parseISO(record.lastCompletedDate as unknown as string).toISOString()) 
        : null,
      createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : parseISO(record.createdAt as unknown as string).toISOString(),
      updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : parseISO(record.updatedAt as unknown as string).toISOString(),
    }));

    return NextResponse.json(dataWithSerializableDates);
  } catch (error) {
    console.error("API Error in /api/case-management:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
        { message: "Internal Server Error fetching case management records.", error: errorMessage },
        { status: 500 }
    );
  }
}
