
"use client";

import * as React from 'react';
import type { UnlockedAchievement } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { iconComponents } from '@/app/page'; // Import shared icon map
import { HelpCircle, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AchievementListProps {
  achievements: UnlockedAchievement[];
}

const AchievementItem: React.FC<{ achievement: UnlockedAchievement }> = ({ achievement }) => {
  const IconComponent = iconComponents[achievement.iconName] || HelpCircle;
  let achievementTypeColor = "text-gray-500";
  switch (achievement.type) {
    case 'Constancia': achievementTypeColor = "text-blue-500"; break;
    case 'Dedicación': achievementTypeColor = "text-green-500"; break;
    case 'Progreso': achievementTypeColor = "text-purple-500"; break;
    case 'Completista': achievementTypeColor = "text-orange-500"; break;
  }

  return (
    <Card className="mb-3 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start space-x-3 p-4">
        <IconComponent className={cn("h-8 w-8 mt-1", achievementTypeColor)} />
        <div>
          <CardTitle className="text-lg font-semibold text-primary">{achievement.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{achievement.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span className={cn("font-medium", achievementTypeColor)}>Tipo: {achievement.type}</span>
          <div className="flex items-center space-x-1">
            <CalendarDays className="h-3 w-3" />
            <span>Desbloqueado: {format(new Date(achievement.dateUnlocked), "dd MMM yyyy", { locale: es })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return <p className="text-muted-foreground">No hay logros desbloqueados todavía.</p>;
  }

  return (
    <div className="space-y-3">
      {achievements.map((ach) => (
        <AchievementItem key={ach.id} achievement={ach} />
      ))}
    </div>
  );
};

export default AchievementList;
