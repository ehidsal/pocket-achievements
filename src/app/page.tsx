
"use client"; // This page uses client-side state for task interactions

import ChildCard from '@/components/children/child-card';
import type { Child } from '@/types';
import { Coins, BookOpen, Home as HomeIcon, Users, Heart } from 'lucide-react';
import type { IconMap } from '@/types';

// Mapeo de nombres de iconos a componentes Lucide.
// Deberías expandir esto según los iconos que uses.
export const iconComponents: IconMap = {
  BookOpen: BookOpen,
  HomeIcon: HomeIcon, // O simplemente 'Home' si quieres usar el nombre directo de Lucide
  Users: Users,
  Heart: Heart,
  Coins: Coins,
  // Añade más iconos aquí según sea necesario
  HelpCircle: require('lucide-react').HelpCircle, // Ejemplo de fallback o icono por defecto
};


// Mock Data - Actualizado para usar iconName y añadir campos opcionales a las tareas
// En una aplicación real, estos datos vendrían de Firestore y ya tendrían userId asociado al Child.
const childrenData: Child[] = [
  {
    id: 'child1', // Este sería el ID del documento en Firestore
    // userId: 'parentId1', // En un caso real, se asociaría al usuario
    name: 'Alex Miller',
    birthDate: '2015-07-20',
    monthlyAllowanceGoal: 50,
    avatarUrl: 'https://placehold.co/100x100.png',
    categories: [
      {
        id: 'cat1_1',
        name: 'Responsabilidades Escolares',
        iconName: 'BookOpen', // Usar el nombre del icono como string
        weight: 0.4,
        isActive: true,
        tasks: [
          { id: 'task1_1_1', name: 'Terminar la tarea a tiempo', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_1_2', name: 'Leer durante 20 minutos', completed: true, value: 5, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_1_3', name: 'Preparar la mochila para el día siguiente', completed: false, value: 5, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
      {
        id: 'cat1_2',
        name: 'Tareas Familiares',
        iconName: 'HomeIcon', // Usar el nombre del icono como string
        weight: 0.3,
        isActive: true,
        tasks: [
          { id: 'task1_2_1', name: 'Hacer la cama todas las mañanas', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_2_2', name: 'Ayudar a poner la mesa para la cena', completed: false, value: 8, isActive: true, creadaPorUsuario: false, frequency: 'semanal' },
          { id: 'task1_2_3', name: 'Ordenar los juguetes antes de dormir', completed: true, value: 7, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
      {
        id: 'cat1_3',
        name: 'Habilidades Sociales',
        iconName: 'Users', // Usar el nombre del icono como string
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
        iconName: 'Heart', // Usar el nombre del icono como string
        weight: 0.15,
        isActive: true,
        tasks: [
          { id: 'task1_4_1', name: 'Escuchar a la primera cuando se le pida', completed: false, value: 15, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
          { id: 'task1_4_2', name: 'Manejar la frustración con calma', completed: false, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
        ],
      },
    ],
  },
  {
    id: 'child2',
    // userId: 'parentId1', // En un caso real
    name: 'Jamie Lee',
    birthDate: '2012-03-10',
    monthlyAllowanceGoal: 70,
    avatarUrl: 'https://placehold.co/100x100.png',
    categories: [
      {
        id: 'cat2_1',
        name: 'Logros Académicos',
        iconName: 'BookOpen',
        weight: 0.5,
        isActive: true,
        tasks: [
          { id: 'task2_1_1', name: 'Completar la hoja de trabajo de matemáticas', completed: true, value: 10, isActive: true, creadaPorUsuario: false, frequency: 'diaria' },
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
  },
];

export default function HomePage() {
  // En una aplicación real, aquí se obtendrían los datos de los hijos del usuario autenticado desde Firestore.
  // const [children, setChildren] = React.useState<Child[]>([]);
  // React.useEffect(() => {
  //   // Lógica para cargar datos de Firestore
  // }, []);

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
