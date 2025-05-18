
"use client";

import * as React from 'react';
import type { HistoryFiltersState, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';

interface HistoryFiltersProps {
  filters: HistoryFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<HistoryFiltersState>>;
  categories: Category[];
}

const HistoryFilters: React.FC<HistoryFiltersProps> = ({ filters, setFilters, categories }) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(filters.dateRange);

  React.useEffect(() => {
    setFilters(prev => ({ ...prev, dateRange }));
  }, [dateRange, setFilters]);

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({ ...prev, selectedCategoryId: categoryId === 'all' ? undefined : categoryId }));
  };

  const handleComplianceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, minCompliance: value[0] }));
  };
  
  const resetFilters = () => {
    setDateRange(undefined);
    setFilters({
      minCompliance: 0,
      selectedCategoryId: undefined,
      dateRange: undefined,
    });
  };

  return (
    <Card className="p-4 shadow-sm">
      <CardHeader className="p-2 pt-0">
        <CardTitle className="text-lg">Filtros del Historial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="date-range-picker" className="text-xs font-medium">Rango de Fechas</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range-picker"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd LLL, y", { locale: es })} -{" "}
                        {format(dateRange.to, "dd LLL, y", { locale: es })}
                      </>
                    ) : (
                      format(dateRange.from, "dd LLL, y", { locale: es })
                    )
                  ) : (
                    <span>Selecciona un rango</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="category-filter" className="text-xs font-medium">Categoría</Label>
            <Select
              value={filters.selectedCategoryId || 'all'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category-filter" className="w-full mt-1">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="compliance-slider" className="text-xs font-medium">
            Cumplimiento Mínimo: {filters.minCompliance}%
          </Label>
          <Slider
            id="compliance-slider"
            min={0}
            max={100}
            step={5}
            value={[filters.minCompliance]}
            onValueChange={handleComplianceChange}
            className="mt-2"
          />
        </div>
        <Button onClick={resetFilters} variant="ghost" size="sm" className="w-full text-muted-foreground">
          <FilterX className="mr-2 h-4 w-4" />
          Limpiar Filtros
        </Button>
      </CardContent>
    </Card>
  );
};


// Need to import Card, CardHeader, CardTitle, CardContent from "@/components/ui/card";
// This was missed in thought process for this specific component.
// Adding them here as they are used.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default HistoryFilters;
