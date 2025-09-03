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
import { BotIcon, Settings2, PlusCircle, Power } from 'lucide-react';
import { Button } from '../ui/button';

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
  {
    id: 'BOT-003',
    status: 'Error',
    targetDomain: 'unstable-source.com',
    trustScore: 34.7,
    lastActivity: '1h ago',
  },
  {
    id: 'BOT-004',
    status: 'Offline',
    targetDomain: 'data-archive.io',
    trustScore: 99.9,
    lastActivity: '2d ago',
  },
];

const StatusIndicator = ({ status }: { status: Bot['status'] }) => {
  const color = {
    Crawling: 'bg-green-500 animate-pulse',
    Idle: 'bg-yellow-500',
    Error: 'bg-red-500',
    Offline: 'bg-gray-500',
  }[status];
  return <div className={`h-2.5 w-2.5 rounded-full ${color}`}></div>;
};

export function BotManager() {
  return (
    <Card className="flex-1 flex flex-col border-primary/50 bg-primary/10">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <BotIcon className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg text-accent">BOT MANAGER</CardTitle>
        </div>
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-accent/80 hover:bg-accent/20 hover:text-accent">
                <PlusCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-accent/80 hover:bg-accent/20 hover:text-accent">
                <Settings2 className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <Table>
          <TableHeader>
            <TableRow className="text-accent/80 hover:bg-transparent">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="text-right">Trust</TableHead>
              <TableHead className="text-right">Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id} className="hover:bg-primary/50">
                <TableCell className="font-medium">{bot.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={bot.status} />
                    {bot.status}
                  </div>
                </TableCell>
                <TableCell>{bot.targetDomain}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={bot.trustScore > 90 ? 'default' : bot.trustScore > 50 ? 'secondary' : 'destructive'} 
                         className="bg-transparent border-current">
                    {bot.trustScore.toFixed(1)}%
                  </Badge>
                </TableCell>
                 <TableCell className="text-right text-muted-foreground">{bot.lastActivity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
