"use client";

import * as React from 'react';
import type { Category, Task } from '@/types';
import TaskItem from './task-item';
import ColoredProgress from '@/components/shared/colored-progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TaskCategoryProps {
  category: Category;
  childMonthlyAllowanceGoal: number;
  onTaskToggle: (categoryId: string, taskId: string, completed: boolean) => void;
  onCategoryActivityToggle: (categoryId: string, isActive: boolean) => void;
}

const TaskCategory: React.FC<TaskCategoryProps> = ({ category, childMonthlyAllowanceGoal, onTaskToggle, onCategoryActivityToggle }) => {
  const { id: categoryId, name, icon: Icon, tasks, weight, isActive } = category;
  const categoryCheckboxId = React.useId();

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  
  // Calculate progress only if the category is active and has tasks
  const categoryProgress = isActive && totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const maxCategoryEarnings = childMonthlyAllowanceGoal * weight;
  // Calculate earned amount only if the category is active
  const earnedInCategory = isActive ? maxCategoryEarnings * (categoryProgress / 100) : 0;

  return (
    <Card className={cn("mb-4 shadow-md transition-opacity duration-300", !isActive && "opacity-60")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className='flex items-center space-x-2'>
            <Checkbox
              id={`${categoryCheckboxId}-${categoryId}`}
              checked={isActive}
              onCheckedChange={(checked) => onCategoryActivityToggle(categoryId, !!checked)}
              aria-labelledby={`label-cat-${categoryCheckboxId}-${categoryId}`}
              className="mr-2"
            />
            <Icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
            <Label htmlFor={`${categoryCheckboxId}-${categoryId}`} id={`label-cat-${categoryCheckboxId}-${categoryId}`} className="cursor-pointer">
              <CardTitle className={cn("text-xl font-semibold", !isActive && "text-muted-foreground line-through")}>{name}</CardTitle>
            </Label>
          </div>
          {isActive && (
            <Badge variant="secondary" className="text-sm">
              {completedTasks}/{totalTasks} tareas
            </Badge>
          )}
        </div>
        <CardDescription className={cn("mt-1 text-xs", !isActive && "text-muted-foreground")}>
           Potencial: ${isActive ? maxCategoryEarnings.toFixed(2) : '0.00'} | Ganado: ${earnedInCategory.toFixed(2)}
           {!isActive && " (Categoría desactivada)"}
        </CardDescription>
      </CardHeader>
      {isActive && (
        <CardContent>
          <ColoredProgress value={categoryProgress} className="mb-3" heightClassName="h-2" />
          <div className="space-y-1">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskToggle={(taskId, completed) => onTaskToggle(categoryId, taskId, completed)}
                disabled={!isActive}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TaskCategory;
