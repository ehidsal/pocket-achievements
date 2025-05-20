
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
  userId?: string; // ID del padre/usuario al que pertenece el niño
  name: string;
  birthDate: string;
  monthlyAllowanceGoal: number;
  avatarUrl: string;
  categories: Category[];
  currency: 'EUR' | 'USD';
  level: ChildLevel;
  unlockedAchievements: UnlockedAchievement[];
  totalAchievementsUnlocked: number;

  // Campos para Stripe (conceptuales, el customerId estaría en el perfil del padre)
  stripeCustomerId?: string; // ID del Customer de Stripe para el padre
  stripeAccountId?: string;  // ID de la Cuenta Conectada o Cuenta Externa de Stripe para el hijo
  payoutsAuthorized?: boolean; // Si el padre autorizó abonos automáticos para este hijo
}

export interface IconMap {
  [key: string]: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

// Tipos para Historial de Pagos y Evaluaciones
export interface EvaluationCategoryDetail {
  categoryId: string;
  categoryName: string;
  iconName: string;
  earned: number;
  potential: number;
  compliancePercentage: number;
}

export interface EvaluationEntry {
  id: string;
  childId: string;
  weekStartDate: string;
  compliancePercentage: number;
  generatedAllowance: number;
  currency: 'EUR' | 'USD';
  predominantCategory?: EvaluationCategoryDetail;
  categoryDetails: EvaluationCategoryDetail[];
}

export interface HistoryFiltersState {
  dateRange?: { from?: Date; to?: Date };
  selectedCategoryId?: string;
  minCompliance: number;
}

// Tipo para Registro de Abonos
export interface Payout {
  id: string; // ID del documento en Firestore
  childId: string;
  userId: string; // ID del padre
  amount: number;
  currency: 'EUR' | 'USD';
  payoutDate: string; // ISO string de la fecha del abono
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  stripeTransferId?: string; // ID de la transferencia o payout en Stripe
  errorMessage?: string; // En caso de fallo
}

// Tipos para Chatbot Dialogflow
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
}
