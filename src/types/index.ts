
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

export interface Category {
  id: string;
  name: string;
  iconName: string; 
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
  currency: 'EUR' | 'USD'; // Nuevo campo para la moneda
}

export interface IconMap {
  [key: string]: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}
