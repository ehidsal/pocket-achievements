
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
import { Medal, Gem, ShieldCheck, Crown, Trophy, Edit3, Settings, CreditCard, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  linkParentStripeAccount,
  linkChildDestinationAccount,
  toggleMonthlyPayoutAuthorization
} from '@/app/actions/stripe'; // Placeholder Stripe actions

// Server Action (conceptual - no real implementation here, just for simulation)
async function checkAndAwardAchievements(childId: string, completedTaskId: string): Promise<UnlockedAchievement[]> {
  console.log(`Simulando revisión de logros para el hijo ${childId} tras completar tarea ${completedTaskId}`);
  if (Math.random() < 0.3) {
    const simulatedNewAchievement: UnlockedAchievement = {
      id: `sim_ach_${Date.now()}`,
      achievementId: 'SIMULATED_ACHIEVEMENT',
      name: '¡Logro Desbloqueado!',
      description: 'Has hecho algo genial (simulado).',
      iconName: 'Award',
      dateUnlocked: new Date().toISOString(),
      type: 'Progreso',
    };
    return [simulatedNewAchievement];
  }
  return [];
}


const ChildCard: React.FC<ChildCardProps> = ({ child: initialChild }) => {
  const { toast } = useToast();
  const [child, setChild] = React.useState<Child>(initialChild);
  const [showAchievements, setShowAchievements] = React.useState(false);
  const [showStripeSettings, setShowStripeSettings] = React.useState(false);
  const [isStripeLoading, setIsStripeLoading] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(() => {
    setChild(initialChild); // Actualizar estado si initialChild cambia (ej: datos de Stripe)
  }, [initialChild]);

  React.useEffect(() => {
    const newLevel = calculateChildLevel(child.totalAchievementsUnlocked);
    if (newLevel !== child.level) {
      setChild(prevChild => ({ ...prevChild, level: newLevel }));
    }
  }, [child.totalAchievementsUnlocked, child.level]);


  const age = calculateAge(child.birthDate);

  const handleTaskToggle = async (categoryId: string, taskId: string, completed: boolean) => {
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

    if (completed) {
      const newlyUnlocked = await checkAndAwardAchievements(child.id, taskId);
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach(ach => {
          toast({
            title: `🎉 ¡Logro Desbloqueado: ${ach.name}!`,
            description: ach.description,
            duration: 5000,
          });
        });
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setChild(prevChild => ({ ...prevChild, avatarUrl: e.target!.result as string }));
          toast({
            title: "Avatar Actualizado (Temporalmente)",
            description: "El nuevo avatar se muestra. Este cambio es solo local y no se guardará.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  // Placeholder Stripe action handlers
  const handleLinkParentStripe = async () => {
    setIsStripeLoading(true);
    // Asumimos que child.userId es el ID del padre. En una app real, esto vendría del usuario autenticado.
    const parentUserId = child.userId || "parent_placeholder_id";
    const result = await linkParentStripeAccount(parentUserId);
    toast({ title: "Vinculación Stripe (Padre)", description: result.message });
    if (result.success && result.stripeCustomerId) {
      setChild(prev => ({ ...prev, stripeCustomerId: result.stripeCustomerId }));
    }
    setIsStripeLoading(false);
  };

  const handleLinkChildDestination = async () => {
    setIsStripeLoading(true);
    const parentUserId = child.userId || "parent_placeholder_id";
    // Simular recolección de datos bancarios (en una app real sería un formulario seguro de Stripe)
    const mockAccountDetails = { iban: "ES00123412341234567890" };
    const result = await linkChildDestinationAccount(parentUserId, child.id, mockAccountDetails);
    toast({ title: "Vinculación Cuenta Destino (Hijo)", description: result.message });
    if (result.success && result.stripeAccountId) {
      setChild(prev => ({ ...prev, stripeAccountId: result.stripeAccountId }));
    }
    setIsStripeLoading(false);
  };
  
  const handleTogglePayouts = async () => {
    setIsStripeLoading(true);
    const parentUserId = child.userId || "parent_placeholder_id";
    const newAuthState = !child.payoutsAuthorized;
    const result = await toggleMonthlyPayoutAuthorization(parentUserId, child.id, newAuthState);
    toast({ title: "Autorización de Abonos", description: result.message });
    if (result.success && result.payoutsAuthorized !== undefined) {
      setChild(prev => ({ ...prev, payoutsAuthorized: result.payoutsAuthorized }));
    }
    setIsStripeLoading(false);
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
      default: return <Trophy className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-card/50 p-6">
        <div className="flex items-start space-x-4">
          <div className="relative group">
            <Image
              src={child.avatarUrl}
              alt={`Avatar de ${child.name}`}
              width={80}
              height={80}
              className="rounded-full border-2 border-primary shadow-sm"
              data-ai-hint={child.avatarUrl.startsWith('https://placehold.co') ? "child avatar" : undefined}
            />
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background"
              onClick={triggerAvatarUpload}
              title="Cambiar avatar"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
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
      <Separator />
      <CardFooter className="p-6 flex flex-col items-start space-y-4">
        <div className="w-full flex justify-between items-center">
           <Button onClick={() => setShowAchievements(!showAchievements)} variant="outline" size="sm">
            {showAchievements ? 'Ocultar Logros' : 'Mostrar Logros'} ({child.unlockedAchievements.length})
          </Button>
          <Button onClick={() => setShowStripeSettings(!showStripeSettings)} variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            {showStripeSettings ? 'Ocultar Config. Pago' : 'Config. Pago (Stripe)'}
          </Button>
        </div>

        {showAchievements && (
          <div className="w-full pt-4 border-t">
            <h3 className="text-xl font-semibold mb-2 text-primary">Logros Desbloqueados</h3>
            {child.unlockedAchievements.length > 0 ? (
              <AchievementList achievements={child.unlockedAchievements} />
            ) : (
              <p className="text-muted-foreground">Aún no hay logros desbloqueados. ¡Sigue esforzándote!</p>
            )}
          </div>
        )}

        {showStripeSettings && (
          <div className="w-full pt-4 border-t space-y-3">
            <h3 className="text-xl font-semibold mb-2 text-primary">Configuración de Pagos (Stripe)</h3>
            <div className="text-sm space-y-2">
              <p>
                <span className="font-medium">ID Cliente Stripe (Padre):</span>{' '}
                {child.stripeCustomerId ? child.stripeCustomerId : (
                  <span className="text-muted-foreground italic">No vinculado</span>
                )}
              </p>
              <p>
                <span className="font-medium">Cuenta Destino (Hijo):</span>{' '}
                {child.stripeAccountId ? child.stripeAccountId : (
                  <span className="text-muted-foreground italic">No vinculada</span>
                )}
              </p>
              <p className="flex items-center">
                <span className="font-medium">Abonos Mensuales Automáticos:</span>{' '}
                {child.payoutsAuthorized ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 ml-2" />
                )}
                <span className={cn("ml-1", child.payoutsAuthorized ? "text-green-700" : "text-yellow-600")}>
                  {child.payoutsAuthorized ? 'Autorizados' : 'No Autorizados'}
                </span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {!child.stripeCustomerId && (
                <Button onClick={handleLinkParentStripe} disabled={isStripeLoading} variant="outline" size="sm">
                  <CreditCard className="mr-2 h-4 w-4"/>
                  {isStripeLoading ? "Vinculando..." : "Vincular Cuenta Padre (Stripe)"}
                </Button>
              )}
              {child.stripeCustomerId && !child.stripeAccountId && (
                 <Button onClick={handleLinkChildDestination} disabled={isStripeLoading} variant="outline" size="sm">
                  <CreditCard className="mr-2 h-4 w-4"/>
                  {isStripeLoading ? "Vinculando..." : "Vincular Cuenta Hijo (Stripe)"}
                </Button>
              )}
              {child.stripeCustomerId && child.stripeAccountId && (
                <Button onClick={handleTogglePayouts} disabled={isStripeLoading} variant="outline" size="sm">
                  <Zap className="mr-2 h-4 w-4"/>
                  {isStripeLoading ? "Actualizando..." : (child.payoutsAuthorized ? 'Desautorizar Abonos' : 'Autorizar Abonos')}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Nota: Estas son acciones simuladas. La integración real con Stripe requiere configuración de backend.
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChildCard;
