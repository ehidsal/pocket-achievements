
import type { LucideProps } from 'lucide-react'; // Conservamos LucideProps por si se usa en otro lado, pero no para icon en Category

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  value: number; // Representa el "peso" o contribución de esta tarea
  isActive: boolean;
  frequency?: 'diaria' | 'semanal'; // Nuevo: frecuencia de la tarea
  creadaPorUsuario?: boolean;     // Nuevo: true si la tarea fue creada por el usuario
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Cambiado de 'icon: LucideIcon' a 'iconName: string'
  tasks: Task[];
  weight: number; // e.g., 0.4 for 40% of total allowance
  isActive: boolean;
}

export interface Child {
  id: string; // En un sistema real, este sería el ID del documento en Firestore
  userId?: string; // ID del padre/usuario al que pertenece el niño
  name: string;
  birthDate: string; // Format: "YYYY-MM-DD"
  monthlyAllowanceGoal: number;
  avatarUrl: string;
  categories: Category[];
}

// Interfaz para mapear nombres de iconos a componentes
export interface IconMap {
  [key: string]: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}
