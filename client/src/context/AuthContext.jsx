import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailLink, sendSignInLinkToEmail, onAuthStateChanged, signOut } from "firebase/auth";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Always sign out on app load to force login every session
    signOut(auth).then(() => setUser(null));
    // No need for onAuthStateChanged since we always sign out
  }, []);


  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    await setPersistence(auth, browserSessionPersistence);
    // Use signInWithPopup for Google login
    await signInWithPopup(auth, provider);
    setUser(auth.currentUser);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
