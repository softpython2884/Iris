import Link from 'next/link';
import { HardDrive, KeyRound } from 'lucide-react';
import { OrwellLogo } from '@/components/orwell-logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-code">
      <Card className="w-full max-w-md border-accent/20 bg-primary/20 shadow-[0_0_30px_theme(colors.accent/0.15)]">
        <CardHeader className="items-center text-center">
          <OrwellLogo className="h-20 w-20 text-accent" />
          <CardTitle className="mt-4 text-3xl font-bold tracking-widest text-accent font-headline">
            ORWELL OS
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            SYSTEM ACCESS TERMINAL v1.0
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative flex items-center">
            <KeyRound className="absolute left-3 h-5 w-5 text-accent/70" />
            <Input
              id="access-key"
              type="password"
              placeholder="ACCESS KEY"
              className="pl-10 pr-4 h-14 text-center text-lg text-accent tracking-[0.3em] bg-background/50 border-accent/50 focus:border-accent placeholder:text-accent/50"
            />
          </div>
          <Button asChild className="w-full h-14 bg-accent text-accent-foreground hover:bg-accent/80 text-lg font-bold">
            <Link href="/">[ INITIATE SESSION ]</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
           <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span>SECURE_NODE_7</span>
           </div>
           <span>STATUS: OPERATIONAL</span>
        </CardFooter>
      </Card>
    </div>
  );
}
