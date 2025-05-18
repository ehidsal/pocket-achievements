"use client"; // This page uses client-side state for task interactions

import ChildCard from '@/components/children/child-card';
import type { Child } from '@/types';
import { BookOpen, Home as HomeIcon, Users, Heart, Coins } from 'lucide-react'; // Using Heart as a placeholder for behavioral

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
        name: 'School Responsibilities',
        icon: BookOpen,
        weight: 0.4,
        tasks: [
          { id: 'task1_1_1', name: 'Finish homework on time', completed: false, value: 10 },
          { id: 'task1_1_2', name: 'Read for 20 minutes', completed: true, value: 5 },
          { id: 'task1_1_3', name: 'Prepare school bag for next day', completed: false, value: 5 },
        ],
      },
      {
        id: 'cat1_2',
        name: 'Family Chores',
        icon: HomeIcon,
        weight: 0.3,
        tasks: [
          { id: 'task1_2_1', name: 'Make bed every morning', completed: false, value: 10 },
          { id: 'task1_2_2', name: 'Help set the table for dinner', completed: false, value: 8 },
          { id: 'task1_2_3', name: 'Tidy up toys before bed', completed: true, value: 7 },
        ],
      },
      {
        id: 'cat1_3',
        name: 'Social Skills',
        icon: Users,
        weight: 0.15,
        tasks: [
          { id: 'task1_3_1', name: 'Share toys with sibling/friend', completed: false, value: 10 },
          { id: 'task1_3_2', name: 'Say "please" and "thank you"', completed: true, value: 5 },
        ],
      },
      {
        id: 'cat1_4',
        name: 'Behavioral Goals',
        icon: Heart, // Changed from SmileHeart
        weight: 0.15,
        tasks: [
          { id: 'task1_4_1', name: 'Listen the first time when asked', completed: false, value: 15 },
          { id: 'task1_4_2', name: 'Handle frustration calmly', completed: false, value: 10 },
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
        name: 'Academic Achievements',
        icon: BookOpen,
        weight: 0.5,
        tasks: [
          { id: 'task2_1_1', name: 'Complete math worksheet', completed: true, value: 10 },
          { id: 'task2_1_2', name: 'Study for science test', completed: false, value: 15 },
          { id: 'task2_1_3', name: 'Practice musical instrument for 30 mins', completed: false, value: 10 },
        ],
      },
      {
        id: 'cat2_2',
        name: 'Household Contributions',
        icon: HomeIcon,
        weight: 0.3,
        tasks: [
          { id: 'task2_2_1', name: 'Walk the dog', completed: false, value: 10 },
          { id: 'task2_2_2', name: 'Help with grocery unpacking', completed: true, value: 5 },
          { id: 'task2_2_3', name: 'Keep room clean', completed: false, value: 15 },
        ],
      },
      {
        id: 'cat2_3',
        name: 'Personal Development',
        icon: Users, // Re-using icon, can be changed
        weight: 0.2,
        tasks: [
          { id: 'task2_3_1', name: 'Practice a new skill for 15 mins', completed: false, value: 10 },
          { id: 'task2_3_2', name: 'Help a family member without being asked', completed: false, value: 10 },
        ],
      },
    ],
  },
];

export default function HomePage() { // Renamed from Home to HomePage to avoid conflict if another Home component is needed later
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center space-x-3">
          <Coins className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight text-gray-800">
            Pocket <span className="text-primary">Achievements</span>
          </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">
          Empowering kids with responsibility, one task at a time.
        </p>
      </header>

      <div className="space-y-12">
        {childrenData.map(child => (
          <ChildCard key={child.id} child={child} />
        ))}
      </div>
      
      <footer className="mt-16 py-8 text-center text-muted-foreground text-sm border-t">
        <p>&copy; {new Date().getFullYear()} Pocket Achievements. All rights reserved.</p>
        <p>Designed to make chores fun and rewarding!</p>
      </footer>
    </div>
  );
}
