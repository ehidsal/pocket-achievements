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
  onTaskActivityToggle: (categoryId: string, taskId: string, taskIsActive: boolean) => void;
}

const TaskCategory: React.FC<TaskCategoryProps> = ({ 
  category, 
  childMonthlyAllowanceGoal, 
  onTaskToggle, 
  onCategoryActivityToggle,
  onTaskActivityToggle
}) => {
  const { id: categoryId, name, icon: Icon, tasks, weight, isActive: isCategoryActive } = category;
  const categoryCheckboxId = React.useId();

  const activeTasks = tasks.filter(task => task.isActive);
  const completedActiveTasks = activeTasks.filter(task => task.completed);

  const sumOfCompletedActiveTaskValues = completedActiveTasks.reduce((sum, task) => sum + task.value, 0);
  const sumOfAllActiveTaskValues = activeTasks.reduce((sum, task) => sum + task.value, 0);
  
  const categoryTaskCompletionProgress = isCategoryActive && sumOfAllActiveTaskValues > 0 
    ? (sumOfCompletedActiveTaskValues / sumOfAllActiveTaskValues) * 100 
    : 0;

  const maxCategoryEarnings = childMonthlyAllowanceGoal * weight;
  const earnedInCategory = isCategoryActive ? maxCategoryEarnings * (categoryTaskCompletionProgress / 100) : 0;

  return (
    <Card className={cn("mb-4 shadow-md transition-opacity duration-300", !isCategoryActive && "opacity-60")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className='flex items-center space-x-2'>
            <Checkbox
              id={`${categoryCheckboxId}-${categoryId}`}
              checked={isCategoryActive}
              onCheckedChange={(checked) => onCategoryActivityToggle(categoryId, !!checked)}
              aria-labelledby={`label-cat-${categoryCheckboxId}-${categoryId}`}
              className="mr-2"
            />
            <Icon className={cn("h-6 w-6", isCategoryActive ? "text-primary" : "text-muted-foreground")} />
            <Label htmlFor={`${categoryCheckboxId}-${categoryId}`} id={`label-cat-${categoryCheckboxId}-${categoryId}`} className="cursor-pointer">
              <CardTitle className={cn("text-xl font-semibold", !isCategoryActive && "text-muted-foreground line-through")}>{name}</CardTitle>
            </Label>
          </div>
          {isCategoryActive && (
            <Badge variant="secondary" className="text-sm">
              {completedActiveTasks.length}/{activeTasks.length} tareas activas
            </Badge>
          )}
        </div>
        <CardDescription className={cn("mt-1 text-xs", !isCategoryActive && "text-muted-foreground")}>
           Potencial: ${isCategoryActive ? maxCategoryEarnings.toFixed(2) : '0.00'} | Ganado: ${earnedInCategory.toFixed(2)}
           {!isCategoryActive && " (Categoría desactivada)"}
        </CardDescription>
      </CardHeader>
      {isCategoryActive && (
        <CardContent>
          <ColoredProgress value={categoryTaskCompletionProgress} className="mb-3" heightClassName="h-2" />
          <div className="space-y-1">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskToggle={(taskId, completed) => onTaskToggle(categoryId, taskId, completed)}
                onTaskActivityToggle={(taskId, taskIsActive) => onTaskActivityToggle(categoryId, taskId, taskIsActive)}
                disabled={!isCategoryActive} // TaskItem is disabled if the whole category is disabled
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TaskCategory;
