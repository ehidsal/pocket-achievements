
"use client";

import * as React from 'react';
import type { Child } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface ChildSelectorProps {
  children: Child[];
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({ children, selectedChildId, onSelectChild }) => {
  if (!children || children.length === 0) {
    return <p className="text-muted-foreground">No hay niños disponibles.</p>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="child-select" className="text-sm font-medium">Seleccionar Hijo/a:</Label>
      <Select value={selectedChildId} onValueChange={onSelectChild}>
        <SelectTrigger id="child-select" className="w-full">
          <SelectValue placeholder="Selecciona un hijo/a" />
        </SelectTrigger>
        <SelectContent>
          {children.map(child => (
            <SelectItem key={child.id} value={child.id}>
              {child.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChildSelector;
