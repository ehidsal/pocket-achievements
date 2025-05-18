"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Child, Category as CategoryType, Task } from '@/types';
import { calculateAge } from '@/lib/utils';
import TaskCategory from '@/components/tasks/task-category';
import ColoredProgress from '@/components/shared/colored-progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User } from 'lucide-react';
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

  const totalPotentialAllowance = child.monthlyAllowanceGoal;
  let totalEarnedAllowance = 0;

  internalCategories.forEach(category => {
    const completedTasksValue = category.tasks.reduce((sum, task) => sum + (task.completed ? task.value : 0), 0);
    const totalTasksValue = category.tasks.reduce((sum, task) => sum + task.value, 0);
    const categoryProgress = totalTasksValue > 0 ? (completedTasksValue / totalTasksValue) : 0;
    totalEarnedAllowance += child.monthlyAllowanceGoal * category.weight * categoryProgress;
  });
  
  const overallProgressPercentage = totalPotentialAllowance > 0 ? (totalEarnedAllowance / totalPotentialAllowance) * 100 : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-card/50 p-6">
        <div className="flex items-start space-x-4">
          <Image
            src={child.avatarUrl}
            alt={`${child.name}'s avatar`}
            width={80}
            height={80}
            className="rounded-full border-2 border-primary shadow-sm"
            data-ai-hint="child avatar"
          />
          <div className="flex-grow">
            <CardTitle className="text-3xl font-bold text-primary">{child.name}</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-1">
              {age} years old
            </CardDescription>
             <div className="mt-3">
              <p className="text-sm font-medium text-foreground">
                Monthly Allowance Goal: <span className="font-bold text-accent">${totalPotentialAllowance.toFixed(2)}</span>
              </p>
              <p className="text-lg font-semibold text-foreground">
                Currently Earned: <span className="font-bold text-green-600">${totalEarnedAllowance.toFixed(2)}</span>
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
            onTaskToggle={handleTaskToggle}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ChildCard;
