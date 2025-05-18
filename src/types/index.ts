
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
  id: string;
  userId?: string;
  name: string;
  birthDate: string;
  monthlyAllowanceGoal: number;
  avatarUrl: string;
  categories: Category[];
  currency: 'EUR' | 'USD';
  level: ChildLevel; // Nuevo campo
  unlockedAchievements: UnlockedAchievement[]; // Nuevo campo
  totalAchievementsUnlocked: number; // Nuevo campo
}

export interface IconMap {
  [key: string]: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}
