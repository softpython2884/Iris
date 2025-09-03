"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Shield, Signal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInterval } from '@/hooks/use-interval';
import { cn } from '@/lib/utils';

type LockdownLevel = 'LV1' | 'LV2' | 'LV3' | 'NONE';

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  const [lockdown, setLockdown] = useState<LockdownLevel>('NONE');

  useInterval(() => {
    setTime(new Date());
  }, 1000);

  const lockdownLevels: LockdownLevel[] = ['NONE', 'LV1', 'LV2', 'LV3'];

  return (
    <footer className="flex h-10 items-center justify-between border-t border-accent/20 bg-primary/20 px-4 text-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-accent" />
          <span>LOCKDOWN:</span>
        </div>
        <div className="flex items-center rounded-md border border-accent/20 p-0.5">
          {lockdownLevels.map((level) => (
            <Button
              key={level}
              onClick={() => setLockdown(level)}
              className={cn(
                "h-6 px-3 text-xs",
                lockdown === level
                  ? level === 'NONE' ? 'bg-green-500/80 text-white' : level === 'LV1' ? 'bg-yellow-500/80 text-black' : level === 'LV2' ? 'bg-orange-500/80 text-white' : 'bg-red-500/80 text-white'
                  : 'bg-transparent text-accent/70 hover:bg-accent/10'
              )}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-accent">
          <Signal className="h-4 w-4" />
          <span>SYS_TIME</span>
        </div>
        <span className="font-semibold text-foreground">
          {format(time, 'yyyy-MM-dd HH:mm:ss')}
        </span>
      </div>
    </footer>
  );
}
