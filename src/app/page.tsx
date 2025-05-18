"use client"; // This page uses client-side state for task interactions

import ChildCard from '@/components/children/child-card';
import type { Child } from '@/types';
import { BookOpen, Home as HomeIcon, Users, Heart, Coins } from 'lucide-react';

// Mock Data
const childrenData: Child[] = [
  {
    id: 'child1',
    name: 'Alex Miller',
    birthDate: '2015-07-20',
    monthlyAllowanceGoal: 50,
    avatarUrl: 'https://placehold.co/100x100.png',
    categories: [
      {
        id: 'cat1_1',
        name: 'Responsabilidades Escolares',
        icon: BookOpen,
        weight: 0.4,
        isActive: true,
        tasks: [
          { id: 'task1_1_1', name: 'Terminar la tarea a tiempo', completed: false, value: 10, isActive: true },
          { id: 'task1_1_2', name: 'Leer durante 20 minutos', completed: true, value: 5, isActive: true },
          { id: 'task1_1_3', name: 'Preparar la mochila para el día siguiente', completed: false, value: 5, isActive: true },
        ],
      },
      {
        id: 'cat1_2',
        name: 'Tareas Familiares',
        icon: HomeIcon,
        weight: 0.3,
        isActive: true,
        tasks: [
          { id: 'task1_2_1', name: 'Hacer la cama todas las mañanas', completed: false, value: 10, isActive: true },
          { id: 'task1_2_2', name: 'Ayudar a poner la mesa para la cena', completed: false, value: 8, isActive: true },
          { id: 'task1_2_3', name: 'Ordenar los juguetes antes de dormir', completed: true, value: 7, isActive: true },
        ],
      },
      {
        id: 'cat1_3',
        name: 'Habilidades Sociales',
        icon: Users,
        weight: 0.15,
        isActive: true,
        tasks: [
          { id: 'task1_3_1', name: 'Compartir juguetes con hermano/amigo', completed: false, value: 10, isActive: true },
          { id: 'task1_3_2', name: 'Decir "por favor" y "gracias"', completed: true, value: 5, isActive: true },
        ],
      },
      {
        id: 'cat1_4',
        name: 'Metas de Comportamiento',
        icon: Heart,
        weight: 0.15,
        isActive: true,
        tasks: [
          { id: 'task1_4_1', name: 'Escuchar a la primera cuando se le pida', completed: false, value: 15, isActive: true },
          { id: 'task1_4_2', name: 'Manejar la frustración con calma', completed: false, value: 10, isActive: true },
        ],
      },
    ],
  },
  {
    id: 'child2',
    name: 'Jamie Lee',
    birthDate: '2012-03-10',
    monthlyAllowanceGoal: 70,
    avatarUrl: 'https://placehold.co/100x100.png',
    categories: [
      {
        id: 'cat2_1',
        name: 'Logros Académicos',
        icon: BookOpen,
        weight: 0.5,
        isActive: true,
        tasks: [
          { id: 'task2_1_1', name: 'Completar la hoja de trabajo de matemáticas', completed: true, value: 10, isActive: true },
          { id: 'task2_1_2', name: 'Estudiar para el examen de ciencias', completed: false, value: 15, isActive: true },
          { id: 'task2_1_3', name: 'Practicar instrumento musical durante 30 minutos', completed: false, value: 10, isActive: true },
        ],
      },
      {
        id: 'cat2_2',
        name: 'Contribuciones en el Hogar',
        icon: HomeIcon,
        weight: 0.3,
        isActive: true,
        tasks: [
          { id: 'task2_2_1', name: 'Pasear al perro', completed: false, value: 10, isActive: true },
          { id: 'task2_2_2', name: 'Ayudar a desempacar las compras', completed: true, value: 5, isActive: true },
          { id: 'task2_2_3', name: 'Mantener la habitación limpia', completed: false, value: 15, isActive: true },
        ],
      },
      {
        id: 'cat2_3',
        name: 'Desarrollo Personal',
        icon: Users,
        weight: 0.2,
        isActive: true,
        tasks: [
          { id: 'task2_3_1', name: 'Practicar una nueva habilidad durante 15 minutos', completed: false, value: 10, isActive: true },
          { id: 'task2_3_2', name: 'Ayudar a un miembro de la familia sin que se lo pidan', completed: false, value: 10, isActive: true },
        ],
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center space-x-3">
          <Coins className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Logros de <span className="text-primary">Bolsillo</span>
          </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">
          Empoderando a los niños con responsabilidad, una tarea a la vez.
        </p>
      </header>

      <div className="space-y-12">
        {childrenData.map(child => (
          <ChildCard key={child.id} child={child} />
        ))}
      </div>
      
      <footer className="mt-16 py-8 text-center text-muted-foreground text-sm border-t">
        <p>&copy; {new Date().getFullYear()} Logros de Bolsillo. Todos los derechos reservados.</p>
        <p>¡Diseñado para que las tareas sean divertidas y gratificantes!</p>
      </footer>
    </div>
  );
}
