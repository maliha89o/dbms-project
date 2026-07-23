import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import { API_URL } from '../lib/api';

const googleProvider = new GoogleAuthProvider();

// Fire-and-forget: keeps the MongoDB `users` list in sync with whoever is
// currently authenticated, so "All Students" never needs a manual add form.
const syncUserProfile = (user) => {
    fetch(`${API_URL}/users/sync`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            imageUrl: user.photoURL,
        }),
    }).catch(() => {});
};



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Email/password sign in. Callers pass an email (built from the roll
    // number client-side); this provider never sees the raw roll number.
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Same roll-number-to-email convention as sign in; the raw roll number
    // is built into an email client-side and never stored here.
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile).then(() => {
            syncUserProfile(auth.currentUser);
        });
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // observe user state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                syncUserProfile(currentUser);
            }
        })
        return () => {
            unSubscribe();
        }
    }, [])

    const authInfo = {
        user,
        loading,
        signIn,
        createUser,
        googleSignIn,
        updateUserProfile,
        logOut,
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;