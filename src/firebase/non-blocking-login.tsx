'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';
import { Firestore, doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { toast } from '@/hooks/use-toast';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(firestore: Firestore, authInstance: Auth, onError?: () => void): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance)
    .then(userCredential => {
      const user = userCredential.user;
      if (user) {
          const userProfileRef = doc(firestore, 'users', user.uid);
          const userProfileData = {
              id: user.uid,
              firebaseUid: user.uid,
              email: null,
              displayName: 'Anonymous User',
              currencyCode: 'USD',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
          };
          setDocumentNonBlocking(userProfileRef, userProfileData, { merge: false });
      }
    })
    .catch(error => {
        toast({
            variant: "destructive",
            title: "Anonymous Sign In Failed",
            description: "Could not sign in anonymously. Please try again.",
        });
        onError?.();
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(firestore: Firestore, authInstance: Auth, email: string, password: string, displayName: string, onError?: () => void): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
        const user = userCredential.user;
        if (user) {
            updateProfile(user, { displayName });

            const userProfileRef = doc(firestore, 'users', user.uid);
            const userProfileData = {
                id: user.uid,
                firebaseUid: user.uid,
                email: user.email,
                displayName: displayName,
                currencyCode: 'USD',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            setDocumentNonBlocking(userProfileRef, userProfileData, { merge: false });
        }
    }).catch(error => {
        let description = "An unexpected error occurred. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
            description = "This email address is already in use by another account.";
        }
        toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: description,
        });
        onError?.();
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, onError?: () => void): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password)
    .catch(error => {
        let description = "An unexpected error occurred. Please try again.";
        // auth/invalid-credential is for v9+, older SDKs use user-not-found and wrong-password
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            description = "Invalid email or password. Please check your credentials and try again.";
        }
        toast({
            variant: "destructive",
            title: "Sign In Failed",
            description: description,
        });
        onError?.();
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
