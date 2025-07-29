
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogIn, LogOut, Settings } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
import { Skeleton } from './ui/skeleton';

export function UserButton() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch profile name from Firestore
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const docSnap = await getDoc(profileRef);
        if (docSnap.exists() && docSnap.data().name) {
          setProfileName(docSnap.data().name);
        } else {
            setProfileName(null);
        }
      } else {
        setProfileName(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
      </div>
    );
  }

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
            <span className="ml-2 group-data-[collapsible=icon]:hidden">{profileName || user.displayName || user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuItem asChild>
            <Link href="/profile">
              <Settings className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>
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
