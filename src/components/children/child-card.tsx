
"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Child, Category as CategoryType, Task, UnlockedAchievement } from '@/types';
import { calculateAge, formatCurrency, calculateChildLevel, getLevelColor, cn } from '@/lib/utils';
import TaskCategory from '@/components/tasks/task-category';
import ColoredProgress from '@/components/shared/colored-progress';
import AchievementList from '@/components/achievements/achievement-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Medal, Gem, ShieldCheck, Crown, Trophy } from 'lucide-react'; // Icons for levels
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"; // For "Ver Logros" button

interface ChildCardProps {
  child: Child;
}

// Server Action (conceptual - no real implementation here, just for simulation)
async function checkAndAwardAchievements(childId: string, completedTaskId: string): Promise<UnlockedAchievement[]> {
  console.log(`Simulando revisión de logros para el hijo ${childId} tras completar tarea ${completedTaskId}`);
  // En una app real, aquí llamarías a tu Cloud Function o Server Action
  // que revisa las condiciones y devuelve los nuevos logros desbloqueados.

  // Simulación: desbloquear un logro de vez en cuando para prueba
  if (Math.random() < 0.3) { // 30% de probabilidad de desbloquear un logro simulado
    const simulatedNewAchievement: UnlockedAchievement = {
      id: `sim_ach_${Date.now()}`,
      achievementId: 'SIMULATED_ACHIEVEMENT',
      name: '¡Logro Desbloqueado!',
      description: 'Has hecho algo genial (simulado).',
      iconName: 'Award', // Asegúrate que 'Award' esté en iconComponents en page.tsx
      dateUnlocked: new Date().toISOString(),
      type: 'Progreso',
    };
    console.log("Logro simulado:", simulatedNewAchievement);
    return [simulatedNewAchievement];
  }
  return [];
}


const ChildCard: React.FC<ChildCardProps> = ({ child: initialChild }) => {
  const { toast } = useToast();
  const [child, setChild] = React.useState<Child>(initialChild);
  const [showAchievements, setShowAchievements] = React.useState(false);

  React.useEffect(() => {
    // Recalcular nivel si los logros cambian
    const newLevel = calculateChildLevel(child.totalAchievementsUnlocked);
    if (newLevel !== child.level) {
      setChild(prevChild => ({ ...prevChild, level: newLevel }));
    }
  }, [child.totalAchievementsUnlocked, child.level]);


  const age = calculateAge(child.birthDate);

  const handleTaskToggle = async (categoryId: string, taskId: string, completed: boolean) => {
    // Update task completion state locally first for responsiveness
    const updatedCategories = child.categories.map(category =>
      category.id === categoryId
        ? {
            ...category,
            tasks: category.tasks.map(task =>
              task.id === taskId ? { ...task, completed } : task
            ),
          }
        : category
    );
    setChild(prevChild => ({ ...prevChild, categories: updatedCategories }));

    // Simulate calling server to check for achievements
    if (completed) { // Only check for achievements when a task is completed
      const newlyUnlocked = await checkAndAwardAchievements(child.id, taskId);
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach(ach => {
          toast({
            title: `🎉 ¡Logro Desbloqueado: ${ach.name}!`,
            description: ach.description,
            duration: 5000,
          });
        });
        // Update child state with new achievements and total count
        setChild(prevChild => ({
          ...prevChild,
          unlockedAchievements: [...prevChild.unlockedAchievements, ...newlyUnlocked],
          totalAchievementsUnlocked: prevChild.totalAchievementsUnlocked + newlyUnlocked.length,
        }));
      }
    }
  };


  const handleCategoryActivityToggle = (categoryId: string, newIsActiveState: boolean) => {
    setChild(prevChild => ({
      ...prevChild,
      categories: prevChild.categories.map(category =>
        category.id === categoryId
          ? { ...category, isActive: newIsActiveState }
          : category
      )
    }));
  };

  const handleTaskActivityToggle = (categoryId: string, taskId: string, taskIsActive: boolean) => {
     setChild(prevChild => ({
      ...prevChild,
      categories: prevChild.categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.map(task =>
                task.id === taskId ? { ...task, isActive: taskIsActive } : task
              ),
            }
          : category
      )
    }));
  };

  const totalPotentialAllowance = child.monthlyAllowanceGoal;
  let totalEarnedAllowance = 0;

  child.categories.forEach(category => {
    if (category.isActive) {
      const activeTasks = category.tasks.filter(task => task.isActive);
      const completedActiveTasksValue = activeTasks.reduce((sum, task) => sum + (task.completed ? task.value : 0), 0);
      const totalValueFromActiveTasks = activeTasks.reduce((sum, task) => sum + task.value, 0);

      const categoryTaskCompletionProgress = totalValueFromActiveTasks > 0
        ? (completedActiveTasksValue / totalValueFromActiveTasks)
        : 0;

      totalEarnedAllowance += child.monthlyAllowanceGoal * category.weight * categoryTaskCompletionProgress;
    }
  });

  const overallProgressPercentage = totalPotentialAllowance > 0 ? (totalEarnedAllowance / totalPotentialAllowance) * 100 : 0;

  const LevelIcon = () => {
    switch (child.level) {
      case 'Bronce': return <Medal className="h-5 w-5 text-yellow-600" />;
      case 'Plata': return <ShieldCheck className="h-5 w-5 text-gray-400" />;
      case 'Oro': return <Gem className="h-5 w-5 text-yellow-400" />;
      case 'Leyenda': return <Crown className="h-5 w-5 text-purple-500" />;
      default: return <Trophy className="h-5 w-5 text-gray-500" />; // Novato
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-card/50 p-6">
        <div className="flex items-start space-x-4">
          <Image
            src={child.avatarUrl}
            alt={`Avatar de ${child.name}`}
            width={80}
            height={80}
            className="rounded-full border-2 border-primary shadow-sm"
            data-ai-hint="child avatar"
          />
          <div className="flex-grow">
            <CardTitle className="text-3xl font-bold text-primary">{child.name}</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-1">
              {age} años
            </CardDescription>
            <div className="mt-1 flex items-center space-x-2">
              <LevelIcon />
              <span className={cn("font-semibold", getLevelColor(child.level))}>
                Nivel: {child.level}
              </span>
              <span className="text-sm text-muted-foreground">({child.totalAchievementsUnlocked} logros)</span>
            </div>
             <div className="mt-3">
              <p className="text-sm font-medium text-foreground">
                Meta de Asignación Mensual: <span className="font-bold text-accent">{formatCurrency(totalPotentialAllowance, child.currency)}</span>
              </p>
              <p className="text-lg font-semibold text-foreground">
                Ganado Actualmente: <span className="font-bold text-green-600">{formatCurrency(totalEarnedAllowance, child.currency)}</span>
              </p>
              <ColoredProgress value={overallProgressPercentage} className="mt-2" heightClassName="h-3" />
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-6 space-y-6 bg-background">
        {child.categories.map(category => (
          <TaskCategory
            key={category.id}
            category={category}
            childMonthlyAllowanceGoal={child.monthlyAllowanceGoal}
            childCurrency={child.currency}
            onTaskToggle={handleTaskToggle}
            onCategoryActivityToggle={handleCategoryActivityToggle}
            onTaskActivityToggle={handleTaskActivityToggle}
          />
        ))}
      </CardContent>
      <CardFooter className="p-6 flex flex-col items-start">
        <Button onClick={() => setShowAchievements(!showAchievements)} variant="outline" className="mb-4">
          {showAchievements ? 'Ocultar Logros' : 'Mostrar Logros'} ({child.unlockedAchievements.length})
        </Button>
        {showAchievements && (
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-2 text-primary">Logros Desbloqueados</h3>
            {child.unlockedAchievements.length > 0 ? (
              <AchievementList achievements={child.unlockedAchievements} />
            ) : (
              <p className="text-muted-foreground">Aún no hay logros desbloqueados. ¡Sigue esforzándote!</p>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChildCard;
