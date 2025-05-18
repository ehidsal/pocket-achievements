
"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Child, Category as CategoryType, Task } from '@/types';
import { calculateAge, formatCurrency } from '@/lib/utils';
import TaskCategory from '@/components/tasks/task-category';
import ColoredProgress from '@/components/shared/colored-progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ChildCardProps {
  child: Child;
}

const ChildCard: React.FC<ChildCardProps> = ({ child }) => {
  const [internalCategories, setInternalCategories] = React.useState<CategoryType[]>(child.categories);

  const age = calculateAge(child.birthDate);

  const handleTaskToggle = (categoryId: string, taskId: string, completed: boolean) => {
    setInternalCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.map(task =>
                task.id === taskId ? { ...task, completed } : task
              ),
            }
          : category
      )
    );
  };

  const handleCategoryActivityToggle = (categoryId: string, newIsActiveState: boolean) => {
    setInternalCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? { ...category, isActive: newIsActiveState }
          : category
      )
    );
  };

  const handleTaskActivityToggle = (categoryId: string, taskId: string, taskIsActive: boolean) => {
    setInternalCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.map(task =>
                task.id === taskId ? { ...task, isActive: taskIsActive } : task
              ),
            }
          : category
      )
    );
  };
  
  const totalPotentialAllowance = child.monthlyAllowanceGoal;
  let totalEarnedAllowance = 0;

  internalCategories.forEach(category => {
    if (category.isActive) { 
      const activeTasks = category.tasks.filter(task => task.isActive);
      const completedActiveTasksValue = activeTasks.reduce((sum, task) => sum + (task.completed ? task.value : 0), 0);
      const totalValueFromActiveTasks = activeTasks.reduce((sum, task) => sum + task.value, 0);
      
      const categoryTaskCompletionProgress = totalValueFromActiveTasks > 0 
        ? (completedActiveTasksValue / totalValueFromActiveTasks) 
        : 0;
      
      totalEarnedAllowance += child.monthlyAllowanceGoal * category.weight * categoryTaskCompletionProgress;
    }
  });
  
  const overallProgressPercentage = totalPotentialAllowance > 0 ? (totalEarnedAllowance / totalPotentialAllowance) * 100 : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-card/50 p-6">
        <div className="flex items-start space-x-4">
          <Image
            src={child.avatarUrl}
            alt={`Avatar de ${child.name}`}
            width={80}
            height={80}
            className="rounded-full border-2 border-primary shadow-sm"
            data-ai-hint="child avatar"
          />
          <div className="flex-grow">
            <CardTitle className="text-3xl font-bold text-primary">{child.name}</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-1">
              {age} años
            </CardDescription>
             <div className="mt-3">
              <p className="text-sm font-medium text-foreground">
                Meta de Asignación Mensual: <span className="font-bold text-accent">{formatCurrency(totalPotentialAllowance, child.currency)}</span>
              </p>
              <p className="text-lg font-semibold text-foreground">
                Ganado Actualmente: <span className="font-bold text-green-600">{formatCurrency(totalEarnedAllowance, child.currency)}</span>
              </p>
              <ColoredProgress value={overallProgressPercentage} className="mt-2" heightClassName="h-3" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <Separator />

      <CardContent className="p-6 space-y-6 bg-background">
        {internalCategories.map(category => (
          <TaskCategory
            key={category.id}
            category={category}
            childMonthlyAllowanceGoal={child.monthlyAllowanceGoal}
            childCurrency={child.currency} // Pasar la moneda del niño
            onTaskToggle={handleTaskToggle}
            onCategoryActivityToggle={handleCategoryActivityToggle}
            onTaskActivityToggle={handleTaskActivityToggle}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ChildCard;
