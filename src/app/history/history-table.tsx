
"use client";

import * as React from 'react';
import type { EvaluationEntry } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { iconComponents } from '@/app/page';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryTableProps {
  evaluations: EvaluationEntry[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ evaluations }) => {
  if (evaluations.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No hay datos de historial para los filtros seleccionados.</p>;
  }

  return (
    <Table>
      <TableCaption>Un resumen de las evaluaciones semanales.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Semana del</TableHead>
          <TableHead className="text-right">Cumplimiento</TableHead>
          <TableHead className="text-right">Paga Generada</TableHead>
          <TableHead>Categoría Principal</TableHead>
          <TableHead className="w-[250px]">Detalle Categorías</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {evaluations.map((entry) => {
          const PredominantIcon = entry.predominantCategory?.iconName ? iconComponents[entry.predominantCategory.iconName] || HelpCircle : HelpCircle;
          return (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">
                {format(new Date(entry.weekStartDate), "dd MMM yyyy", { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={entry.compliancePercentage >= 80 ? "default" : entry.compliancePercentage >= 50 ? "secondary" : "destructive"}>
                  {entry.compliancePercentage}%
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(entry.generatedAllowance, entry.currency, entry.currency === 'EUR' ? 'es-ES' : 'en-US')}
              </TableCell>
              <TableCell>
                {entry.predominantCategory ? (
                  <div className="flex items-center space-x-2">
                    <PredominantIcon className={cn("h-4 w-4 text-muted-foreground")} />
                    <span>{entry.predominantCategory.categoryName}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1 text-xs">
                  {entry.categoryDetails.map(detail => {
                     const Icon = iconComponents[detail.iconName] || HelpCircle;
                     return (
                        <div key={detail.categoryId} className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                                <Icon className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate max-w-[100px]">{detail.categoryName}:</span>
                            </div>
                            <span className="font-mono">{formatCurrency(detail.earned, entry.currency, entry.currency === 'EUR' ? 'es-ES' : 'en-US')}</span>
                        </div>
                     )
                  })}
                   {entry.categoryDetails.length === 0 && <span className="text-muted-foreground">Sin detalle</span>}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
