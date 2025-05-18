"use client";

import Link from 'next/link';
import ChildCard from '@/components/children/child-card';
import type { Child } from '@/types';
import { Coins, BookOpen, Home as HomeIcon, Users, Heart, HelpCircle, Award, Target, TrendingUp, CheckCircle, History } from 'lucide-react';
import type { IconMap } from '@/types';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button'; // Nueva importación

export const iconComponents: IconMap = {
  BookOpen: BookOpen,
  HomeIcon: HomeIcon,
  Users: Users,
  Heart: Heart,
  Coins: Coins,
  HelpCircle: HelpCircle,
  Award: Award,
  Target: Target,
  TrendingUp: TrendingUp,
  CheckCircle: CheckCircle,
  History: History,
};

export const childrenData: Child[] = [
  {
    id: 'child1',
    userId: 'parent1',
    name: 'Alex Miller',
    birthDate: '2015-07-20',
    monthlyAllowanceGoal: 50,
    avatarUrl: 'https://placehold.co/100x100/E08A0B/444.png?text=AM',
    currency: 'EUR',
    level: 'Bronce',
    totalAchievementsUnlocked: 2,
    unlockedAchievements: [
      { id: 'ach1_1', achievementId: 'FIRST_TASK_COMPLETED', name: '¡Primer Paso!', description: 'Completaste tu primera tarea.', iconName: 'Award', dateUnlocked: '2024-05-10', type: 'Progreso' },
      { id: 'ach1_2', achievementId: 'FIVE_TASKS_IN_CATEGORY', name: 'Especialista Escolar', description: 'Completaste 5 tareas en la categoría Escuela.', iconName: 'BookOpen', dateUnlocked: '2024-05-15', type: 'Completista' },
    ],
    categories: [
      {
        id: 'cat1_1',
        name: 'Responsabilidades Escolares',
        iconName: 'BookOpen',
        weight: 0.4,
        isActive: true,
        tasks: [
          { id: 'task1_1_1', name: 'Terminar la tarea a tiempo', completed: true, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_1_2', name: 'Leer durante 20 minutos', completed: true, value: 5, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_1_3', name: 'Preparar la mochila para el día siguiente', completed: false, value: 5, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
      {
        id: 'cat1_2',
        name: 'Tareas Familiares',
        iconName: 'HomeIcon',
        weight: 0.3,
        isActive: true,
        tasks: [
          { id: 'task1_2_1', name: 'Hacer la cama todas las mañanas', completed: true, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_2_2', name: 'Ayudar a poner la mesa para la cena', completed: false, value: 8, isActive: true, creadaPorUsuario: false, frequency: 'semanal' },
          { id: 'task1_2_3', name: 'Ordenar los juguetes antes de dormir', completed: true, value: 7, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
      {
        id: 'cat1_3',
        name: 'Habilidades Sociales',
        iconName: 'Users',
        weight: 0.15,
        isActive: true,
        tasks: [
          { id: 'task1_3_1', name: 'Compartir juguetes con hermano/amigo', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_3_2', name: 'Decir "por favor" y "gracias"', completed: true, value: 5, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
      {
        id: 'cat1_4',
        name: 'Metas de Comportamiento',
        iconName: 'Heart',
        weight: 0.15,
        isActive: true,
        tasks: [
          { id: 'task1_4_1', name: 'Escuchar a la primera cuando se le pida', completed: false, value: 15, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_4_2', name: 'Manejar la frustración con calma', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
    ],
    stripeCustomerId: 'cus_padreAlex123',
    stripeAccountId: 'acct_hijoAlex456',
    payoutsAuthorized: true,
  },
  {
    id: 'child2',
    userId: 'parent2',
    name: 'Jamie Lee',
    birthDate: '2012-03-10',
    monthlyAllowanceGoal: 70,
    avatarUrl: 'https://placehold.co/100x100/E05A0B/FFF.png?text=JL',
    currency: 'USD',
    level: 'Novato',
    totalAchievementsUnlocked: 0,
    unlockedAchievements: [],
    categories: [
      {
        id: 'cat2_1',
        name: 'Logros Académicos',
        iconName: 'BookOpen',
        weight: 0.5,
        isActive: true,
        tasks: [
          { id: 'task2_1_1', name: 'Completar la hoja de trabajo de matemáticas', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task2_1_2', name: 'Estudiar para el examen de ciencias', completed: false, value: 15, isActive: true, creadaPorUsuario: false, frequency: 'semanal' },
          { id: 'task2_1_3', name: 'Practicar instrumento musical durante 30 minutos', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
      {
        id: 'cat2_2',
        name: 'Contribuciones en el Hogar',
        iconName: 'HomeIcon',
        weight: 0.3,
        isActive: true,
        tasks: [
          { id: 'task2_2_1', name: 'Pasear al perro', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task2_2_2', name: 'Ayudar a desempacar las compras', completed: true, value: 5, isActive: true, creadaPorUsuario: false, frequency: 'semanal' },
          { id: 'task2_2_3', name: 'Mantener la habitación limpia', completed: false, value: 15, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
      {
        id: 'cat2_3',
        name: 'Desarrollo Personal',
        iconName: 'Users',
        weight: 0.2,
        isActive: true,
        tasks: [
          { id: 'task2_3_1', name: 'Practicar una nueva habilidad durante 15 minutos', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task2_3_2', name: 'Ayudar a un miembro de la familia sin que se lo pidan', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
    ],
    stripeCustomerId: 'cus_padreJamie789',
    stripeAccountId: undefined, 
    payoutsAuthorized: false,
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <div className="inline-flex items-center space-x-3">
            <Coins className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              Pago<span className="text-primary">metro</span>
            </h1>
          </div>
          <ThemeToggleButton /> {/* Botón de cambio de tema añadido aquí */}
        </div>
        <p className="text-lg text-muted-foreground text-center">
          Cumple, Cobra, Ahorra.
        </p>
         <div className="mt-6 text-center">
          <Link href="/history" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90">
            <History className="mr-2 h-5 w-5" />
            Ver Historial de Pagos
          </Link>
        </div>
      </header>

      <div className="space-y-12">
        {childrenData.map(child => (
          <ChildCard key={child.id} child={child} />
        ))}
      </div>

      <footer className="mt-16 py-8 text-center text-muted-foreground text-sm border-t">
        <p>&copy; {new Date().getFullYear()} Pagometro. Todos los derechos reservados.</p>
        <p>¡Diseñado para que las tareas sean divertidas y gratificantes!</p>
      </footer>
    </div>
  );
}
