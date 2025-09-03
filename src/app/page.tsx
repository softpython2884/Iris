import { BotManager } from '@/components/dashboard/bot-manager';
import { EntityDatabase } from '@/components/dashboard/entity-database';
import { EnrichmentTool } from '@/components/dashboard/enrichment-tool';
import { Header } from '@/components/dashboard/header';
import { StatusBar } from '@/components/dashboard/status-bar';
import { SystemLog } from '@/components/dashboard/system-log';

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col font-code">
      <Header />
      <main className="flex-1 overflow-auto p-4">
        <div className="grid h-full grid-cols-12 grid-rows-2 gap-4 lg:grid-rows-1">
          <div className="col-span-12 row-span-1 flex flex-col gap-4 overflow-y-auto lg:col-span-4">
            <BotManager />
            <EntityDatabase />
          </div>
          <div className="col-span-12 row-span-1 flex flex-col gap-4 overflow-y-auto lg:col-span-8">
            <EnrichmentTool />
            <SystemLog />
          </div>
        </div>
      </main>
      <StatusBar />
    </div>
  );
}
