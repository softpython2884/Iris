import { Header } from '@/components/dashboard/header';
import { StatusBar } from '@/components/dashboard/status-bar';
import { EnrichmentTool } from '@/components/dashboard/enrichment-tool';

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col font-code bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden p-4">
        <EnrichmentTool />
      </main>
      <StatusBar />
    </div>
  );
}
