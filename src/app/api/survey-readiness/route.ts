
import { NextResponse } from 'next/server';
import { mockAuditRecords, allAuditCategories } from '@/lib/mock-data';
import type { AuditRecord } from '@/types';
import { parseISO } from 'date-fns';

export async function GET() {
  try {
    // For Survey Readiness, let's filter for records that have a chapterReferenceTag or are in specific categories
    const surveyRelevantRecords = mockAuditRecords.filter(record => 
      record.chapterReferenceTag || 
      record.category === 'Documentation & Compliance' ||
      record.category === 'General ALR Compliance' ||
      record.category === 'Postings & Required Notices'
    );

    const dataWithSerializableDates: AuditRecord[] = surveyRelevantRecords.map(record => ({
      ...record,
      lastCompletedDate: record.lastCompletedDate ? (record.lastCompletedDate instanceof Date ? record.lastCompletedDate.toISOString() : parseISO(record.lastCompletedDate as unknown as string).toISOString()) : null,
      createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : parseISO(record.createdAt as unknown as string).toISOString(),
      updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : parseISO(record.updatedAt as unknown as string).toISOString(),
    }));
    return NextResponse.json(dataWithSerializableDates);
  } catch (error) {
    console.error("API Error in /api/survey-readiness:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
        { message: "Internal Server Error fetching survey readiness records.", error: errorMessage },
        { status: 500 }
    );
  }
}
