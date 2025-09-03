"use client";

import { useState } from 'react';
import Link from 'next/link';
import { HardDrive, KeyRound, UserPlus, LoaderCircle } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const userData = await response.json();
      // In a real app, you'd store the token in sessionStorage/localStorage
      // and use a state management library.
      console.log("Login successful:", userData);
      router.push('/');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-code">
      <Card className="w-full max-w-md border-accent/20 bg-primary/20 shadow-[0_0_30px_theme(colors.accent/0.15)]">
        <CardHeader className="items-center text-center">
          <OrwellLogo className="h-20 w-20 text-accent" />
          <CardTitle className="mt-4 text-3xl font-bold tracking-widest text-accent font-headline">
            IRIS
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            SYSTEM ACCESS TERMINAL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative flex items-center">
            <KeyRound className="absolute left-3 h-5 w-5 text-accent/70" />
            <Input
              id="access-key"
              type="password"
              placeholder="ACCESS KEY"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              disabled={isLoading}
              className="pl-10 pr-4 h-12 text-center text-lg text-accent tracking-[0.3em] bg-background/50 border-accent/50 focus:border-accent placeholder:text-accent/50"
            />
          </div>
          <Button onClick={handleLogin} disabled={isLoading} className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/80 text-lg font-bold">
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              '[ INITIATE SESSION ]'
            )}
          </Button>
          <Button variant="outline" asChild className="w-full h-12 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent">
            <Link href="/signup">
              <UserPlus className="mr-2"/>
              Register New Operator
            </Link>
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
