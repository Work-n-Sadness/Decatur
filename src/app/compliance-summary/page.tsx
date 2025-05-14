
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockTasks as allMockTasks, allTaskCategories } from '@/lib/mock-data'; // Use allTaskCategories from new mock-data
import type { Task, TaskCategory, ResolutionStatus } from '@/types'; // Use ResolutionStatus from new types
import { getTaskCategoryIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList } from 'recharts';
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { ClipboardCheck } from 'lucide-react';


interface ComplianceStats {
  totalTasks: number;
  resolvedTasks: number; // Changed from completedTasks
  completionPercentage: number;
}

const chartColorPalette = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];


export default function ComplianceSummaryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // For this summary, we might treat "Resolved" as "Completed"
    // Or, we define what "completion" means in the context of ResolutionStatus
    // For now, let's consider 'Resolved' as the target completion state.
    setTasks(allMockTasks);
  }, []);

  const complianceData = useMemo(() => {
    const dataByCategory: Record<TaskCategory, ComplianceStats> = {} as Record<TaskCategory, ComplianceStats>;

    allTaskCategories.forEach(category => {
      dataByCategory[category] = { totalTasks: 0, resolvedTasks: 0, completionPercentage: 0 };
    });

    tasks.forEach(task => {
      if (dataByCategory[task.category]) {
        dataByCategory[task.category].totalTasks++;
        if (task.status === 'Resolved') { // Check for 'Resolved' status
          dataByCategory[task.category].resolvedTasks++;
        }
      }
    });

    allTaskCategories.forEach(category => {
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
    }));
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
                    margin={{ left: 120, right: 50 }} // Increased left margin for longer category names
                    barCategoryGap="20%"
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        tickLine={false} 
                        axisLine={false} 
                        width={250} // Adjusted width for potentially longer category names
                        style={{ fontSize: '11px' }} // Slightly smaller font for Y-axis labels
                        interval={0}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Adjusted for potentially 2 wide cards */}
            {allTaskCategories.map(category => {
              const stats = complianceData[category];
              if (!stats) return null;
              const CategoryIcon = getTaskCategoryIcon(category);
              return (
                <Card key={category} className="shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2"> {/* Reduced title size */}
                        <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                        {category}
                      </CardTitle>
                      <Badge variant={stats.completionPercentage === 100 ? "default" : (stats.completionPercentage > 70 ? "secondary" : "destructive")}>
                        {stats.completionPercentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={stats.completionPercentage} className="w-full h-3 mb-2" />
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
