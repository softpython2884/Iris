import { BotManager } from '@/components/dashboard/bot-manager';
import { EntityDatabase } from '@/components/dashboard/entity-database';
import { Header } from '@/components/dashboard/header';
import { StatusBar } from '@/components/dashboard/status-bar';
import { SystemLog } from '@/components/dashboard/system-log';
import { TerminalOutput } from '@/components/dashboard/terminal-output';

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col font-code bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden p-4 grid grid-cols-12 grid-rows-3 gap-4">
        {/* Top-left panel */}
        <div className="col-span-3 row-span-1">
          <BotManager />
        </div>

        {/* Center big area */}
        <div className="col-span-6 row-span-3">
          <TerminalOutput />
        </div>

        {/* Right multi-zone */}
        <div className="col-span-3 row-span-3 flex flex-col gap-4">
           <EntityDatabase />
           <SystemLog />
        </div>
        
        {/* Bottom-left panel */}
         <div className="col-span-3 row-span-2">
          {/* Future component for chat/mail/notes will go here */}
        </div>

      </main>
      <StatusBar />
    </div>
  );
}
