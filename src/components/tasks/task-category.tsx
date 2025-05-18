"use client";

import * as React from 'react';
import type { Category, Task } from '@/types';
import TaskItem from './task-item';
import ColoredProgress from '@/components/shared/colored-progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskCategoryProps {
  category: Category;
  childMonthlyAllowanceGoal: number;
  onTaskToggle: (categoryId: string, taskId: string, completed: boolean) => void;
}

const TaskCategory: React.FC<TaskCategoryProps> = ({ category, childMonthlyAllowanceGoal, onTaskToggle }) => {
  const { name, icon: Icon, tasks, weight } = category;

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const categoryProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const maxCategoryEarnings = childMonthlyAllowanceGoal * weight;
  const earnedInCategory = maxCategoryEarnings * (categoryProgress / 100);

  return (
    <Card className="mb-4 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className='flex items-center space-x-2'>
            <Icon className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-sm">
            {completedTasks}/{totalTasks} tareas
          </Badge>
        </div>
        <CardDescription className="mt-1 text-xs">
           Potencial: ${maxCategoryEarnings.toFixed(2)} | Ganado: ${earnedInCategory.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColoredProgress value={categoryProgress} className="mb-3" heightClassName="h-2" />
        <div className="space-y-1">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskToggle={(taskId, completed) => onTaskToggle(category.id, taskId, completed)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCategory;
