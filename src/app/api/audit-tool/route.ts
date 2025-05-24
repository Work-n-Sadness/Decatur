
import { NextResponse } from 'next/server';
import { mockAuditRecords } from '@/lib/mock-data';
import type { AuditRecord } from '@/types';

export async function GET() {
  // In a real application, you would fetch this data from your Supabase database.
  // For now, we're returning mock data.
  // Ensure dates are in ISO string format for JSON serialization.
  const dataWithSerializableDates: AuditRecord[] = mockAuditRecords.map(record => ({
    ...record,
    lastCompletedDate: record.lastCompletedDate ? record.lastCompletedDate.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }));

  return NextResponse.json(dataWithSerializableDates);
}
