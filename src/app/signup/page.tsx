
"use client";

import Link from 'next/link';
import { HardDrive, KeyRound, User, ChevronRight, Shield } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SignupPage() {
  // In a real app, you'd handle form state and submission here.
  // For now, it's a visual placeholder.

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-code">
      <Card className="w-full max-w-md border-accent/20 bg-primary/20 shadow-[0_0_30px_theme(colors.accent/0.15)]">
        <CardHeader className="items-center text-center">
          <OrwellLogo className="h-20 w-20 text-accent" />
          <CardTitle className="mt-4 text-3xl font-bold tracking-widest text-accent font-headline">
            IRIS REGISTRATION
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            CREATE NEW OPERATOR PROFILE
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-accent/80">Operator ID</Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-accent/70" />
              <Input
                id="username"
                placeholder="e.g. Operator-9"
                className="pl-10 bg-background/50 border-accent/50 focus:border-accent placeholder:text-accent/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="access-key" className="text-accent/80">Access Key</Label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3 h-5 w-5 text-accent/70" />
              <Input
                id="access-key"
                type="password"
                placeholder="DEFINE ACCESS KEY"
                className="pl-10 bg-background/50 border-accent/50 focus:border-accent placeholder:text-accent/50"
              />
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="security-level" className="text-accent/80">Security Level</Label>
              <div className="flex gap-2">
                <div className="relative flex items-center flex-grow">
                 <Shield className="absolute left-3 h-5 w-5 text-accent/70" />
                  <Select>
                    <SelectTrigger className="pl-10 bg-background/50 border-accent/50 focus:border-accent">
                      <SelectValue placeholder="Select Level..." />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(8)].map((_, i) => (
                        <SelectItem key={i} value={String(i)}>Level {i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex items-center">
                  <Select>
                    <SelectTrigger className="bg-background/50 border-accent/50 focus:border-accent">
                      <SelectValue placeholder="Sub-level..." />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i} value={`3.${i + 1}`}>{`3.${i + 1}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
          </div>
          
          <Button asChild className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/80 text-lg font-bold">
            <Link href="/login">
                [ CREATE PROFILE ]
            </Link>
          </Button>

        </CardContent>
        <CardFooter className="flex justify-center text-xs text-muted-foreground">
          <Button variant="link" asChild className="text-accent/70 hover:text-accent">
              <Link href="/login">
                Return to Access Terminal
              </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
