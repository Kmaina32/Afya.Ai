'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogIn, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function UserButton() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-2">
            <Avatar className="h-8 w-8">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <span className="ml-2 group-data-[collapsible=icon]:hidden">{user.displayName || user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild variant="ghost" className="w-full justify-start p-2">
      <Link href="/signin">
         <LogIn className="h-5 w-5" />
         <span className="ml-2 group-data-[collapsible=icon]:hidden">Sign In</span>
      </Link>
    </Button>
  );
}
