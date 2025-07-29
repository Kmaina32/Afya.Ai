
'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const adminEmails = ['gmaina424@gmail.com'];

export function useAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAdmin(!!currentUser && adminEmails.includes(currentUser.email || ''));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, isLoading };
}
