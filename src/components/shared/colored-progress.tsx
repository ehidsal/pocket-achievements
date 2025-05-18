"use client";

import * as React from 'react';
import { cn, getProgressColorStyle } from '@/lib/utils';

interface ColoredProgressProps {
  value: number; // Percentage from 0 to 100
  className?: string;
  heightClassName?: string;
}

const ColoredProgress: React.FC<ColoredProgressProps> = ({ value, className, heightClassName = 'h-2.5' }) => {
  const percentage = Math.max(0, Math.min(100, value));
  const colorStyle = getProgressColorStyle(percentage);

  return (
    <div className={cn("w-full bg-muted rounded-full", heightClassName, className)}>
      <div
        className={cn("rounded-full", heightClassName)}
        style={{ width: `${percentage}%`, ...colorStyle }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      ></div>
    </div>
  );
};

export default ColoredProgress;
