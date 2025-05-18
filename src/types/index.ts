import type { LucideIcon } from 'lucide-react';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  value: number; // Represents the contribution of this task to the category's allowance portion
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  tasks: Task[];
  weight: number; // e.g., 0.4 for 40% of total allowance
  isActive: boolean; // Indicates if the category is currently active for the child
}

export interface Child {
  id: string;
  name: string;
  birthDate: string; // Format: "YYYY-MM-DD"
  monthlyAllowanceGoal: number;
  avatarUrl: string;
  categories: Category[];
}
