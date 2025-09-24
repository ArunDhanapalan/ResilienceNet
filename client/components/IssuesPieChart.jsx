"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";

// Define a color palette using the CSS variables
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const IssuesByCategoryPieChart = ({ issuesData = [] }) => {
  // Process the data to count issues by category
  const data = useMemo(() => {
    if (!issuesData || issuesData.length === 0) return [];

    const categoryCounts = issuesData.reduce((acc, issue) => {
      const category = issue.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(categoryCounts).map((category) => ({
      name: category,
      value: categoryCounts[category],
    }));
  }, [issuesData]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Issues by Category</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 text-sm">
            No issues available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60} // donut effect
                paddingAngle={2}
                strokeWidth={2}
                // 👇 add labels inside slices
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};