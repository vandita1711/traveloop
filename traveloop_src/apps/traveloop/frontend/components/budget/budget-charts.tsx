"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/lib/utils";

const chartColors = ["#5b6cff", "#22c7ff", "#20c997", "#ffb020", "#ff6b6b", "#8b5cf6", "#0f172a"];

export function BudgetCharts({
  categoryBreakdown,
  timelineBudget,
}: {
  categoryBreakdown: { category: string; amount: number }[];
  timelineBudget: { month: string; planned: number; target: number }[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Category breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="amount" nameKey="category" innerRadius={70} outerRadius={110}>
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={entry.category} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => currency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Target vs planned</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineBudget}>
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value: number) => currency(Number(value))} />
              <Bar dataKey="target" fill="#cbd5e1" radius={[10, 10, 0, 0]} />
              <Bar dataKey="planned" fill="#5b6cff" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
