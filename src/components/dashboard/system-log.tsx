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

const MAX_LOGS = 50;

const initialLog: SystemLogEntry = {
  id: 0,
  timestamp: new Date().toISOString(),
  level: 'SYSTEM',
  message: 'SYSTEM BOOT SEQUENCE COMPLETE. ORWELL OS v1.0 ONLINE.',
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
  'DB connection health: optimal.',
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
  }, 3000);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  const levelColor = {
    INFO: 'text-foreground/80',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-500',
    SYSTEM: 'text-accent',
  };

  return (
    <Card className="flex-1 flex flex-col border-primary/50 bg-primary/10">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg text-accent">SYSTEM LOG</CardTitle>
        </div>
      </CardHeader>
      <CardContent
        ref={scrollAreaRef}
        className="flex-1 space-y-2 overflow-y-auto p-4 text-sm"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2">
            <span className="text-muted-foreground">
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
