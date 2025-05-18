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
  disabled?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskToggle, disabled = false }) => {
  const uniqueId = React.useId();
  return (
    <div className={cn(
        "flex items-center space-x-3 py-2 px-1 rounded-md transition-colors duration-150",
        !disabled && "hover:bg-secondary/50",
        disabled && "opacity-70 cursor-not-allowed"
      )}>
      <Checkbox
        id={`${uniqueId}-${task.id}`}
        checked={task.completed}
        onCheckedChange={(checked) => onTaskToggle(task.id, !!checked)}
        aria-labelledby={`label-${uniqueId}-${task.id}`}
        disabled={disabled}
      />
      <Label 
        htmlFor={`${uniqueId}-${task.id}`} 
        id={`label-${uniqueId}-${task.id}`} 
        className={cn(
          "flex-grow text-sm", 
          !disabled && "cursor-pointer",
          disabled && "cursor-not-allowed",
          task.completed && "line-through text-muted-foreground"
        )}
      >
        {task.name}
      </Label>
      {task.completed ? (
        <Star className="h-5 w-5 text-primary" fill="currentColor" aria-label="Completada" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground/50" aria-label="Pendiente" />
      )}
    </div>
  );
};

export default TaskItem;
