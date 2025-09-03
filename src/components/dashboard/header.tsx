import Link from 'next/link';
import { OrwellLogo } from '@/components/orwell-logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-accent/20 bg-primary/20 px-4 shrink-0">
      <div className="flex items-center gap-3">
        <OrwellLogo className="h-8 w-8 text-accent" />
        <h1 className="text-xl font-bold tracking-widest text-accent font-headline">
          IRIS
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-green-400">CONNECTION: SECURE</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-accent/50">
                <AvatarImage src="https://picsum.photos/100/100" alt="@operator" data-ai-hint="hacker avatar" />
                <AvatarFallback>OP</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Operator-7</p>
                <p className="text-xs leading-none text-muted-foreground">
                  clearance_level: 3
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
