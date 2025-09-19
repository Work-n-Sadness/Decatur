
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ListTodo, Users, Pill, ShieldCheck, FilePlus, UserPlus, Award, BarChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickLinkItemProps {
  href: string;
  title: string;
  icon: LucideIcon;
}

const QuickLinkItem: React.FC<QuickLinkItemProps> = ({ href, title, icon: Icon }) => (
  <Link href={href} passHref>
    <div className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors group">
      <div className="p-2 bg-accent/10 rounded-md mr-4">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-sm">{title}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);


export default function QuickLinks() {
  const links = [
    {
      href: '/checklists',
      title: 'Log a Task',
      icon: FilePlus,
    },
    {
      href: '/resident-records/face-sheets',
      title: 'Add Resident',
      icon: UserPlus,
    },
    {
      href: '/facility-certs-installations/certifications',
      title: 'Upload Certificate',
      icon: Award,
    },
    {
      href: '/reports',
      title: 'Run Report',
      icon: BarChart,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map(link => (
          <QuickLinkItem key={link.href} {...link} />
        ))}
      </CardContent>
    </Card>
  );
}
