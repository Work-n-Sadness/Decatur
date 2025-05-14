
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockTasks as allMockTasks, allTaskCategories } from '@/lib/mock-data'; 
import type { Task, TaskCategory, ResolutionStatus } from '@/types'; 
import { getTaskCategoryIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList } from 'recharts';
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { ClipboardCheck } from 'lucide-react';


interface ComplianceStats {
  totalTasks: number;
  resolvedTasks: number; 
  completionPercentage: number;
}

const chartColorPalette = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-1)/0.7)', // Added more distinct colors
  'hsl(var(--chart-2)/0.7)',
  'hsl(var(--chart-3)/0.7)',
];


export default function ComplianceSummaryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(allMockTasks);
  }, []);

  const complianceData = useMemo(() => {
    const dataByCategory: Record<string, ComplianceStats> = {}; // Use string for key to accommodate dynamic categories from mock data

    allTaskCategories.forEach(category => {
      dataByCategory[category] = { totalTasks: 0, resolvedTasks: 0, completionPercentage: 0 };
    });

    tasks.forEach(task => {
      if (!dataByCategory[task.category]) { // Handle if a task category is not in allTaskCategories (defensive)
         dataByCategory[task.category] = { totalTasks: 0, resolvedTasks: 0, completionPercentage: 0 };
      }
      dataByCategory[task.category].totalTasks++;
      if (task.status === 'Resolved') { 
        dataByCategory[task.category].resolvedTasks++;
      }
    });

    Object.keys(dataByCategory).forEach(category => { // Iterate over keys of dataByCategory
      const categoryData = dataByCategory[category];
      if (categoryData.totalTasks > 0) {
        categoryData.completionPercentage = Math.round((categoryData.resolvedTasks / categoryData.totalTasks) * 100);
      }
    });
    
    return dataByCategory;
  }, [tasks]);

  const chartData = useMemo(() => {
    return allTaskCategories.map((category, index) => ({
      name: category,
      percentage: complianceData[category]?.completionPercentage || 0,
      fill: chartColorPalette[index % chartColorPalette.length],
    })).filter(item => complianceData[item.name]?.totalTasks > 0); // Only show categories with tasks
  }, [complianceData]);
  
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach(item => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-accent" />
            Compliance Summary Panel
          </CardTitle>
          <CardDescription>
            Real-time overview of task resolution percentages per ALR domain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Overall Compliance Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] w-full p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ left: 200, right: 50, top: 5, bottom: 5 }} 
                      barCategoryGap="20%"
                    >
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis 
                          dataKey="name" 
                          type="category" 
                          tickLine={false} 
                          axisLine={false} 
                          width={180} 
                          interval={0}
                          style={{ fontSize: '11px', whiteSpace: 'normal', wordBreak: 'break-word' }}
                          tickFormatter={(value: string) => value.length > 30 ? `${value.substring(0, 28)}...` : value} // Truncate long labels
                      />
                      <RechartsTooltip
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                        formatter={(value: number) => [`${value}%`, "Resolution"]}
                      />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
                        <LabelList 
                            dataKey="percentage" 
                            position="right" 
                            offset={8} 
                            className="fill-foreground" 
                            fontSize={12}
                            formatter={(value: number) => `${value}%`}
                          />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-muted-foreground p-4">No compliance data to display. Ensure tasks are populated.</p>
          )}
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
            {allTaskCategories.map(category => {
              const stats = complianceData[category];
              if (!stats || stats.totalTasks === 0) return null; // Don't render card if no tasks in this category
              const CategoryIcon = getTaskCategoryIcon(category);
              return (
                <Card key={category} className="shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2 leading-tight"> 
                        <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                        {category}
                      </CardTitle>
                      <Badge variant={stats.completionPercentage === 100 ? "default" : (stats.completionPercentage >= 70 ? "secondary" : "destructive")}>
                        {stats.completionPercentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={stats.completionPercentage} className="w-full h-3 mb-2" 
                      aria-label={`${category} compliance ${stats.completionPercentage}%`} />
                    <p className="text-sm text-muted-foreground">
                      {stats.resolvedTasks} out of {stats.totalTasks} tasks resolved.
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
