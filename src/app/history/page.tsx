
"use client";

import * as React from 'react';
import type { Child, EvaluationEntry, HistoryFiltersState, Category } from '@/types';
import { childrenData } from '@/app/page'; // Using existing mock children data
import ChildSelector from './child-selector';
import HistoryFilters from './history-filters';
import HistoryTable from './history-table';
import HistoryChart from './history-chart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock evaluation data
const mockEvaluations: EvaluationEntry[] = [
  {
    id: 'eval1',
    childId: 'child1',
    weekStartDate: '2024-05-20',
    compliancePercentage: 85,
    generatedAllowance: 10.63, // (50 * 0.4 * (X/Y)) + (50 * 0.3 * (A/B)) ...
    currency: 'EUR',
    categoryDetails: [
      { categoryId: 'cat1_1', categoryName: 'Responsabilidades Escolares', iconName: 'BookOpen', earned: 5, potential: 8, compliancePercentage: 62.5 },
      { categoryId: 'cat1_2', categoryName: 'Tareas Familiares', iconName: 'HomeIcon', earned: 4, potential: 6, compliancePercentage: 66.6 },
      { categoryId: 'cat1_3', categoryName: 'Habilidades Sociales', iconName: 'Users', earned: 1.13, potential: 1.5, compliancePercentage: 75 },
      { categoryId: 'cat1_4', categoryName: 'Metas de Comportamiento', iconName: 'Heart', earned: 0.5, potential: 1.5, compliancePercentage: 33.3 },
    ],
    predominantCategory: { categoryId: 'cat1_1', categoryName: 'Responsabilidades Escolares', iconName: 'BookOpen', earned: 5, potential: 8, compliancePercentage: 62.5 },
  },
  {
    id: 'eval2',
    childId: 'child1',
    weekStartDate: '2024-05-27',
    compliancePercentage: 92,
    generatedAllowance: 11.50,
    currency: 'EUR',
     categoryDetails: [
      { categoryId: 'cat1_1', categoryName: 'Responsabilidades Escolares', iconName: 'BookOpen', earned: 7, potential: 8, compliancePercentage: 87.5 },
      { categoryId: 'cat1_2', categoryName: 'Tareas Familiares', iconName: 'HomeIcon', earned: 3, potential: 6, compliancePercentage: 50 },
      { categoryId: 'cat1_3', categoryName: 'Habilidades Sociales', iconName: 'Users', earned: 1.5, potential: 1.5, compliancePercentage: 100 },
    ],
    predominantCategory: { categoryId: 'cat1_1', categoryName: 'Responsabilidades Escolares', iconName: 'BookOpen', earned: 7, potential: 8, compliancePercentage: 87.5 },
  },
   {
    id: 'eval3',
    childId: 'child1',
    weekStartDate: '2024-06-03',
    compliancePercentage: 70,
    generatedAllowance: 8.75,
    currency: 'EUR',
     categoryDetails: [
      { categoryId: 'cat1_2', categoryName: 'Tareas Familiares', iconName: 'HomeIcon', earned: 5, potential: 6, compliancePercentage: 83.3 },
    ],
    predominantCategory: { categoryId: 'cat1_2', categoryName: 'Tareas Familiares', iconName: 'HomeIcon', earned: 5, potential: 6, compliancePercentage: 83.3 },
  },
  {
    id: 'eval4',
    childId: 'child2',
    weekStartDate: '2024-05-20',
    compliancePercentage: 75,
    generatedAllowance: 13.13, // (70 * 0.5 * X/Y) + ...
    currency: 'USD',
    categoryDetails: [
      { categoryId: 'cat2_1', categoryName: 'Logros Académicos', iconName: 'BookOpen', earned: 8.75, potential: 17.5, compliancePercentage: 50 },
      { categoryId: 'cat2_2', categoryName: 'Contribuciones en el Hogar', iconName: 'HomeIcon', earned: 4.38, potential: 10.5, compliancePercentage: 41.6 },
    ],
    predominantCategory: { categoryId: 'cat2_1', categoryName: 'Logros Académicos', iconName: 'BookOpen', earned: 8.75, potential: 17.5, compliancePercentage: 50 },
  },
  {
    id: 'eval5',
    childId: 'child2',
    weekStartDate: '2024-05-27',
    compliancePercentage: 95,
    generatedAllowance: 16.63,
    currency: 'USD',
    categoryDetails: [
       { categoryId: 'cat2_1', categoryName: 'Logros Académicos', iconName: 'BookOpen', earned: 15, potential: 17.5, compliancePercentage: 85.7 },
       { categoryId: 'cat2_3', categoryName: 'Desarrollo Personal', iconName: 'Users', earned: 1.63, potential: 7, compliancePercentage: 23.2 },
    ],
  },
];


export default function HistoryPage() {
  const [selectedChildId, setSelectedChildId] = React.useState<string>(childrenData[0]?.id || '');
  const [filters, setFilters] = React.useState<HistoryFiltersState>({
    minCompliance: 0,
  });

  const selectedChild = childrenData.find(c => c.id === selectedChildId);
  const childCategories = selectedChild?.categories || [];

  const filteredAndSortedEvaluations = React.useMemo(() => {
    return mockEvaluations
      .filter(entry => {
        if (entry.childId !== selectedChildId) return false;
        if (filters.dateRange?.from && new Date(entry.weekStartDate) < filters.dateRange.from) return false;
        if (filters.dateRange?.to && new Date(entry.weekStartDate) > filters.dateRange.to) return false;
        if (filters.selectedCategoryId && entry.categoryDetails.every(cd => cd.categoryId !== filters.selectedCategoryId)) {
            // If a category is selected, the entry must have *some* detail for that category
            // or if predominant is used for filtering:
            // if (filters.selectedCategoryId && entry.predominantCategory?.categoryId !== filters.selectedCategoryId) return false;
            return false;
        }
        if (entry.compliancePercentage < filters.minCompliance) return false;
        return true;
      })
      .sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime());
  }, [selectedChildId, filters]);

  const handleExportCSV = () => {
    if (filteredAndSortedEvaluations.length === 0) return;

    const headers = ["Semana", "Cumplimiento (%)", "Paga Generada", "Moneda", "Categoría Principal"];
    const rows = filteredAndSortedEvaluations.map(entry => [
      format(new Date(entry.weekStartDate), "dd MMM yyyy", { locale: es }),
      entry.compliancePercentage,
      entry.generatedAllowance.toFixed(2),
      entry.currency,
      entry.predominantCategory?.categoryName || "N/A"
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historial_pagos_${selectedChild?.name.replace(/\s+/g, '_') || 'hijo'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Historial de Pagos</h1>
        <p className="text-muted-foreground mt-2">
          Consulta cómo ha evolucionado la paga semanal de cada hijo.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <ChildSelector
            children={childrenData}
            selectedChildId={selectedChildId}
            onSelectChild={setSelectedChildId}
          />
        </div>
        <div className="md:col-span-3">
           <HistoryFilters
            filters={filters}
            setFilters={setFilters}
            categories={childCategories}
          />
        </div>
      </div>
      
      {selectedChild && (
        <>
          <div className="mb-6 flex justify-end">
            <Button onClick={handleExportCSV} variant="outline" disabled={filteredAndSortedEvaluations.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
          <div className="mb-10">
            <HistoryChart data={filteredAndSortedEvaluations} currency={selectedChild.currency} />
          </div>
          <HistoryTable evaluations={filteredAndSortedEvaluations} />
        </>
      )}
       {!selectedChild && <p>Por favor, selecciona un hijo para ver su historial.</p>}


    </div>
  );
}
