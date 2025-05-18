
"use client";

import * as React from 'react';
import type { EvaluationEntry } from '@/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

interface HistoryChartProps {
  data: EvaluationEntry[];
  currency: 'EUR' | 'USD';
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data, currency }) => {
  if (data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No hay datos suficientes para mostrar el gráfico.</div>;
  }

  const chartData = data
    .map(entry => ({
      name: format(new Date(entry.weekStartDate), "dd MMM", { locale: es }),
      cumplimiento: entry.compliancePercentage,
      paga: entry.generatedAllowance,
    }))
    .reverse(); // Reverse to show chronologically in chart

  const chartConfig = {
    cumplimiento: {
      label: "Cumplimiento (%)",
      color: "hsl(var(--chart-1))",
    },
    paga: {
      label: `Paga (${currency})`,
      color: "hsl(var(--chart-2))",
    },
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border rounded-md shadow-lg">
          <p className="label font-semibold">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} style={{ color: pld.color }}>
              {pld.dataKey === 'paga' 
                ? `${chartConfig.paga.label}: ${formatCurrency(pld.value, currency, currency === 'EUR' ? 'es-ES' : 'en-US')}`
                : `${chartConfig.cumplimiento.label}: ${pld.value}%`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };


  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8} 
            tickFormatter={(value) => value}
            style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="hsl(var(--chart-1))" 
            tickFormatter={(value) => `${value}%`}
            style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}
            domain={[0, 100]}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="hsl(var(--chart-2))" 
            tickFormatter={(value) => formatCurrency(value, currency, currency === 'EUR' ? 'es-ES' : 'en-US').replace(/\s*([€$])/, '$1')} // Compact currency
            style={{ fontSize: '0.75rem', fill: 'hsl(var(--muted-foreground))' }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--muted))', opacity: 0.3 }}/>
          <Legend content={<ChartLegendContent />} />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="cumplimiento" 
            stroke={chartConfig.cumplimiento.color} 
            strokeWidth={2} 
            dot={{ r: 4, fill: chartConfig.cumplimiento.color, strokeWidth:0 }} 
            activeDot={{ r: 6, fill: chartConfig.cumplimiento.color, strokeWidth:0 }}
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="paga" 
            stroke={chartConfig.paga.color} 
            strokeWidth={2}
            dot={{ r: 4, fill: chartConfig.paga.color, strokeWidth:0 }} 
            activeDot={{ r: 6, fill: chartConfig.paga.color, strokeWidth:0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default HistoryChart;
