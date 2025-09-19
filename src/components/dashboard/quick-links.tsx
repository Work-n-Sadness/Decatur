
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ListTodo, Users, Pill, Building, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickLinkItemProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const QuickLinkItem: React.FC<QuickLinkItemProps> = ({ href, title, description, icon: Icon }) => (
  <Link href={href} passHref>
    <div className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors group">
      <div className="p-2 bg-accent/10 rounded-md mr-4">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);


export default function QuickLinks() {
  const links = [
    {
      href: '/checklists',
      title: 'Checklist Manager',
      description: 'View and manage all daily tasks.',
      icon: ListTodo,
    },
    {
      href: '/resident-records/face-sheets',
      title: 'Resident Records',
      description: 'Access profiles, care plans, and notes.',
      icon: Users,
    },
    {
      href: '/medication-tracking/mar-logs',
      title: 'Medication Tracking',
      description: 'Log MAR entries and PRN.',
      icon: Pill,
    },
    {
      href: '/compliance-center/survey-packet',
      title: 'Compliance Center',
      description: 'Review certificates and audit logs.',
      icon: ShieldCheck,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map(link => (
          <QuickLinkItem key={link.href} {...link} />
        ))}
      </CardContent>
    </Card>
  );
}
