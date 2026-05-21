// src/services/authService.js
// Wraps Firebase Auth calls so components never import firebase directly.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase/config'

/** Create a new account and optionally set a display name */
export async function signUp(email, password, displayName = '') {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(credential.user, { displayName })
  }
  return credential.user
}

/** Sign in with email + password */
export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/** Sign the current user out */
export async function logOut() {
  await signOut(auth)
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function — call it in a useEffect cleanup.
 *
 * @param {(user: import('firebase/auth').User | null) => void} callback
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback)
}
