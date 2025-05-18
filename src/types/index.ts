
import type { LucideProps } from 'lucide-react';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  value: number;
  isActive: boolean;
  frequency?: 'diaria' | 'semanal';
  creadaPorUsuario?: boolean;
}

export type AchievementType = 'Constancia' | 'Dedicación' | 'Progreso' | 'Completista';
export type ChildLevel = 'Bronce' | 'Plata' | 'Oro' | 'Leyenda' | 'Novato';

export interface UnlockedAchievement {
  id: string; // Unique instance ID for Firestore
  achievementId: string; // Predefined achievement key (e.g., "FIRST_TASK_DONE")
  name: string;
  description: string;
  iconName: string; // Lucide icon name
  dateUnlocked: string; // ISO string date
  type: AchievementType;
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Lucide icon name
  tasks: Task[];
  weight: number;
  isActive: boolean;
}

export interface Child {
  id:string;
  userId?: string;
  name: string;
  birthDate: string;
  monthlyAllowanceGoal: number;
  avatarUrl: string;
  categories: Category[];
  currency: 'EUR' | 'USD';
  level: ChildLevel;
  unlockedAchievements: UnlockedAchievement[];
  totalAchievementsUnlocked: number;
}

export interface IconMap {
  [key: string]: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

// New types for Payment History
export interface EvaluationCategoryDetail {
  categoryId: string;
  categoryName: string;
  iconName: string;
  earned: number;
  potential: number;
  compliancePercentage: number; // Specific to this category for the week
}

export interface EvaluationEntry {
  id: string; // Unique ID for the evaluation period (e.g., week)
  childId: string;
  weekStartDate: string; // ISO string, e.g., "2024-05-20"
  compliancePercentage: number; // Overall compliance for the week (0-100)
  generatedAllowance: number; // Amount earned this week
  currency: 'EUR' | 'USD';
  predominantCategory?: EvaluationCategoryDetail; // Optional: The category that contributed most or was focused on
  categoryDetails: EvaluationCategoryDetail[]; // Detailed breakdown per category
}

export interface HistoryFiltersState {
  dateRange?: { from?: Date; to?: Date };
  selectedCategoryId?: string;
  minCompliance: number; // 0-100
}
