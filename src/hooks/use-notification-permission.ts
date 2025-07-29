
'use client';

import { useState } from 'react';
import { messaging, db, auth } from '@/lib/firebase';
import { getToken } from 'firebase/messaging';
import { useToast } from './use-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;

export function useNotificationPermission() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [isPermissionLoading, setIsPermissionLoading] = useState(false);

  const handleRequestPermission = async () => {
    if (!messaging) {
        toast({
            title: 'Messaging not supported',
            description: 'This browser does not support Firebase Messaging.',
            variant: 'destructive',
        });
        return;
    }
    if (!VAPID_KEY) {
        toast({
            title: 'VAPID Key Missing',
            description: 'The VAPID key for push notifications is not configured.',
            variant: 'destructive',
        });
        return;
    }
    if (!user) {
         toast({
            title: 'Not Signed In',
            description: 'You must be signed in to enable notifications.',
            variant: 'destructive',
        });
        return;
    }

    setIsPermissionLoading(true);

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        toast({
          title: 'Notifications Enabled!',
          description: 'You will now receive alerts from Afya.Ai.',
        });

        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (currentToken) {
          // Save the token to Firestore
          const tokenRef = doc(db, 'fcmTokens', currentToken);
          await setDoc(tokenRef, {
            uid: user.uid,
            token: currentToken,
            createdAt: serverTimestamp(),
          });
          console.log('FCM Token saved to Firestore.');
        } else {
          toast({
            title: 'Could Not Get Token',
            description: 'Failed to retrieve the notification token. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Permission Denied',
          description: 'You have not enabled notifications.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('An error occurred while getting token. ', error);
      toast({
        title: 'Notification Error',
        description: 'An error occurred while setting up notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsPermissionLoading(false);
    }
  };

  return { handleRequestPermission, isPermissionLoading };
}
