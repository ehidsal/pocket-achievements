"use client";

import * as React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Task } from '@/types';
import { Star, Circle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onTaskActivityToggle: (taskId: string, isActive: boolean) => void;
  disabled?: boolean; // Category is disabled
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskToggle, onTaskActivityToggle, disabled = false }) => {
  const uniqueId = React.useId();
  
  return (
    <div className={cn(
        "flex items-center space-x-2 py-2 px-1 rounded-md transition-all duration-150",
        !task.isActive && "opacity-60", // Apply opacity if task itself is inactive
        !disabled && task.isActive && "hover:bg-secondary/50", // Hover only if category and task active
        disabled && "cursor-not-allowed" // Category disabled
      )}>
      <Checkbox
        id={`${uniqueId}-${task.id}`}
        checked={task.completed}
        onCheckedChange={(checked) => onTaskToggle(task.id, !!checked)}
        aria-labelledby={`label-${uniqueId}-${task.id}`}
        disabled={disabled || !task.isActive} // Disabled if category OR task is inactive
      />
      <Label 
        htmlFor={`${uniqueId}-${task.id}`} 
        id={`label-${uniqueId}-${task.id}`} 
        className={cn(
          "flex-grow text-sm", 
          !disabled && task.isActive && "cursor-pointer", // Clickable if category and task active
          (disabled || !task.isActive) && "cursor-not-allowed",
          task.completed && task.isActive && "line-through text-muted-foreground", // Line-through if active and completed
          !task.isActive && "text-muted-foreground" // Style for inactive task name
        )}
      >
        {task.name}
      </Label>
      
      <div className="w-5 h-5 flex items-center justify-center">
        {!task.isActive ? (
          <EyeOff className="h-5 w-5 text-muted-foreground/70" aria-label="Tarea inactiva" />
        ) : task.completed ? (
          <Star className="h-5 w-5 text-primary" fill="currentColor" aria-label="Completada" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/50" aria-label="Pendiente" />
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={() => onTaskActivityToggle(task.id, !task.isActive)}
        disabled={disabled} // Only disabled if category is disabled
        aria-label={task.isActive ? "Marcar tarea como inactiva" : "Marcar tarea como activa"}
        title={task.isActive ? "Marcar tarea como inactiva" : "Marcar tarea como activa"}
      >
        {task.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
      </Button>
    </div>
  );
};

export default TaskItem;
