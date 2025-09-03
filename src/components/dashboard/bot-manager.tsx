import { Bot } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BotIcon, Settings2, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { BotJobDialog } from './bot-job-dialog';

const bots: Bot[] = [
  {
    id: 'BOT-001',
    status: 'Crawling',
    targetDomain: 'approved-domain-alpha.net',
    trustScore: 92.5,
    lastActivity: '2s ago',
  },
  {
    id: 'BOT-002',
    status: 'Idle',
    targetDomain: 'approved-domain-beta.org',
    trustScore: 88.1,
    lastActivity: '5m ago',
  },
];

const StatusIndicator = ({ status }: { status: Bot['status'] }) => {
  const color = {
    Crawling: 'bg-green-500 animate-pulse',
    Idle: 'bg-yellow-500',
    Error: 'bg-red-500',
    Offline: 'bg-gray-500',
  }[status];
  return <div className={`h-2 w-2.5 rounded-full ${color}`}></div>;
};

export function BotManager() {
  return (
    <Card className="flex-1 flex flex-col border-primary/50 bg-primary/10">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-3">
        <div className="flex items-center gap-2">
          <BotIcon className="h-4 w-4 text-accent" />
          <CardTitle className="text-base text-accent">BOTS</CardTitle>
        </div>
        <div className="flex items-center gap-1">
            <BotJobDialog>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-accent/80 hover:bg-accent/20 hover:text-accent">
                  <PlusCircle className="h-4 w-4" />
              </Button>
            </BotJobDialog>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-accent/80 hover:bg-accent/20 hover:text-accent">
                <Settings2 className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0 text-xs">
        <Table>
          <TableHeader>
            <TableRow className="text-accent/80 hover:bg-transparent">
              <TableHead className="w-[80px] h-8">ID</TableHead>
              <TableHead  className="h-8">Status</TableHead>
              <TableHead  className="h-8">Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id} className="hover:bg-primary/50">
                <TableCell className="font-medium py-1">{bot.id}</TableCell>
                <TableCell className="py-1">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={bot.status} />
                    {bot.status}
                  </div>
                </TableCell>
                <TableCell className="py-1">{bot.targetDomain}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
