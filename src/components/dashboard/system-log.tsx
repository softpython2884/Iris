"use client";

import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import { format } from 'date-fns';
import { useInterval } from '@/hooks/use-interval';
import { SystemLogEntry } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MAX_LOGS = 20;

const initialLog: SystemLogEntry = {
  id: 0,
  timestamp: new Date().toISOString(),
  level: 'SYSTEM',
  message: 'ORWELL OS v1.0 ONLINE.',
};

const randomMessages = [
  'Authenticated session for Operator-7.',
  'Bot-001 crawling target: approved-domain-alpha.net',
  'New entity profile created: E-004.',
  'Security check passed on module: BotManager.',
  'WARN: High latency detected on node EU-WEST-3.',
  'Enrichment pipeline initiated for raw data chunk.',
  'ERROR: Bot-003 failed to parse target robots.txt.',
  'Lockdown state changed to NONE.',
];

const getRandomLevel = (): SystemLogEntry['level'] => {
  const rand = Math.random();
  if (rand < 0.05) return 'ERROR';
  if (rand < 0.2) return 'WARN';
  return 'INFO';
};

export function SystemLog() {
  const [logs, setLogs] = useState<SystemLogEntry[]>([initialLog]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useInterval(() => {
    const level = getRandomLevel();
    const message = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    const newLog: SystemLogEntry = {
      id: logs.length,
      timestamp: new Date().toISOString(),
      level: message.includes('ERROR') ? 'ERROR' : message.includes('WARN') ? 'WARN' : 'INFO',
      message,
    };
    setLogs((prev) => [...prev, newLog].slice(-MAX_LOGS));
  }, 4500);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  const levelColor = {
    INFO: 'text-foreground/60',
    WARN: 'text-yellow-400/80',
    ERROR: 'text-red-500/80',
    SYSTEM: 'text-accent/80',
  };

  return (
    <Card className="flex-1 flex flex-col border-primary/50 bg-primary/10">
      <CardHeader className="py-2 px-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-accent" />
          <CardTitle className="text-base text-accent">SYSTEM LOG</CardTitle>
        </div>
      </CardHeader>
      <CardContent
        ref={scrollAreaRef}
        className="flex-1 space-y-1 overflow-y-auto p-2 text-xs"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2">
            <span className="text-muted-foreground/50">
              [{format(new Date(log.timestamp), 'HH:mm:ss')}]
            </span>
            <span
              className={cn(
                'font-semibold',
                levelColor[log.level]
              )}
            >
              {`[${log.level}]`}
            </span>
            <p className={cn('flex-1', levelColor[log.level])}>
              {log.message}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
