
import { NextResponse } from 'next/server';
import { mockCertifications } from '@/lib/mock-data';
import type { FacilityCertification } from '@/types';
import { isValid, parseISO } from 'date-fns';

export async function GET() {
  try {
    // Defensive check for the data source
    if (!Array.isArray(mockCertifications)) {
      console.error("/api/facility-certifications: mockCertifications data source is not an array or is undefined.");
      return NextResponse.json(
        { message: "Internal Server Error: Data source unavailable for certifications." },
        { status: 500 }
      );
    }

    const dataWithSerializableDates: FacilityCertification[] = mockCertifications.map(cert => {
      // Helper to safely convert dates to ISO string
      const toISO = (dateInput: Date | string | null | undefined): string => {
        // Handle null or undefined explicitly if necessary, or ensure data is always valid
        if (dateInput === null || dateInput === undefined) {
          // Consider if epoch (new Date(0)) is appropriate or if you should filter out such records
          // or return null/undefined and handle it on the client. For now, defaulting to epoch for safety.
          console.warn(`Invalid or missing date encountered for cert: ${cert.certificationName}. Defaulting to epoch.`);
          return new Date(0).toISOString();
        }
        const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
        if (!isValid(d)) {
          console.warn(`Invalid date parsed for cert: ${cert.certificationName}, original value: ${dateInput}. Defaulting to epoch.`);
          return new Date(0).toISOString();
        }
        return d.toISOString();
      };

      return {
        ...cert,
        issueDate: toISO(cert.issueDate),
        expirationDate: toISO(cert.expirationDate),
        createdAt: toISO(cert.createdAt),
        updatedAt: toISO(cert.updatedAt),
      };
    });
    return NextResponse.json(dataWithSerializableDates);
  } catch (error) {
    console.error("API Error in /api/facility-certifications:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
        { message: "Internal Server Error fetching facility certifications.", error: errorMessage },
        { status: 500 }
    );
  }
}
