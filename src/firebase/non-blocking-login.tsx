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

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(firestore: Firestore, authInstance: Auth): void {
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
        console.error("Error during anonymous sign in: ", error);
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(firestore: Firestore, authInstance: Auth, email: string, password: string, displayName: string): void {
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
        console.error("Error during sign up: ", error);
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
