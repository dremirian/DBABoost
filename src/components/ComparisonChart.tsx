import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ComparisonResult } from '../types';

interface ComparisonChartProps {
  comparison: ComparisonResult;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ comparison }) => {
  const chartData = [
    {
      name: 'Tempo Total (ms)',
      antes: comparison.before.duration,
      depois: comparison.after.duration,
    },
    {
      name: 'CPU Time (ms)',
      antes: comparison.before.cpu,
      depois: comparison.after.cpu,
    },
    {
      name: 'Logical Reads',
      antes: comparison.before.logicalReads,
      depois: comparison.after.logicalReads,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Comparação Visual</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="antes" fill="#ef4444" name="Antes" />
          <Bar dataKey="depois" fill="#10b981" name="Depois" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};