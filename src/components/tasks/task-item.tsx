"use client";

import * as React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Task } from '@/types';
import { Star, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onTaskToggle: (taskId: string, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskToggle }) => {
  const uniqueId = React.useId();
  return (
    <div className="flex items-center space-x-3 py-2 px-1 hover:bg-secondary/50 rounded-md transition-colors duration-150">
      <Checkbox
        id={`${uniqueId}-${task.id}`}
        checked={task.completed}
        onCheckedChange={(checked) => onTaskToggle(task.id, !!checked)}
        aria-labelledby={`label-${uniqueId}-${task.id}`}
      />
      <Label htmlFor={`${uniqueId}-${task.id}`} id={`label-${uniqueId}-${task.id}`} className={cn("flex-grow cursor-pointer text-sm", task.completed && "line-through text-muted-foreground")}>
        {task.name}
      </Label>
      {task.completed ? (
        <Star className="h-5 w-5 text-primary" fill="currentColor" aria-label="Completed" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground/50" aria-label="Pending" />
      )}
    </div>
  );
};

export default TaskItem;
