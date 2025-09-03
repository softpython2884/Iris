import { Header } from '@/components/dashboard/header';
import { StatusBar } from '@/components/dashboard/status-bar';
import { EntityDatabase } from '@/components/dashboard/entity-database';
import { SystemLog } from '@/components/dashboard/system-log';
import { BotManager } from '@/components/dashboard/bot-manager';
import { TerminalOutput } from '@/components/dashboard/terminal-output';

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col font-code bg-background text-foreground">
      <Header />
      <main className="flex-1 grid grid-cols-4 grid-rows-2 gap-4 p-4 overflow-hidden">
        <div className="col-span-1 row-span-2 flex flex-col gap-4">
            <EntityDatabase />
            <BotManager />
        </div>
        <div className="col-span-3 row-span-1">
            <TerminalOutput />
        </div>
        <div className="col-span-3 row-span-1">
            <SystemLog />
        </div>
      </main>
      <StatusBar />
    </div>
  );
}
