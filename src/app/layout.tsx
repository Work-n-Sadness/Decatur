
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import AppLayout from '@/components/layout/app-layout'; // Corrected import: GeistSans and GeistMono are types
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: 'Decatur West - Workflow Dashboard',
  description: 'Assisted Living Residence Workflow Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AppLayout>
          {children}
        </AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
