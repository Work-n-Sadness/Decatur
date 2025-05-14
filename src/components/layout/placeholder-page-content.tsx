"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list"; // Assuming a List component exists or will be created. For now, use ul/li.
import { Package } from "lucide-react";

interface PlaceholderPageContentProps {
  pageTitle: string;
}

export default function PlaceholderPageContent({ pageTitle }: PlaceholderPageContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6 text-accent" />
          {pageTitle}
        </CardTitle>
        <CardDescription>
          This page will display a task board or data table for {pageTitle}. 
          Content and functionality are under development.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Features to be implemented:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Display of relevant data (e.g., tasks, logs, records)</li>
          <li>Data fields: Assigned Role, Validator, Last Completed Date, Status</li>
          <li>Functionality to 📎 Attach Evidence (URL or upload)</li>
          <li>Export data capability (CSV / PDF)</li>
          <li>Display and filter by Chapter Reference Tag (e.g., Ch. 24.3)</li>
          <li>Comprehensive search and filtering options</li>
          <li>Role-based access control</li>
          <li>Mobile/responsive design</li>
        </ul>
      </CardContent>
    </Card>
  );
}
