import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { loginWithGoogle, user, logout } = useAuth();
  const navigate = useNavigate();

  // Handler for Google sign-in with error handling and redirect
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      // Navigate to profile page after successful login
      navigate('/profile');
    } catch (e) {
      alert("Google sign-in failed. Please try again.");
    }
  };

  // If already logged in, redirect to profile (prevents seeing login page when authenticated)
  React.useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Welcome to Devfolio</h1>
        <p className="text-center mb-6 text-gray-500">
          {user ? `Logged in as ${user.email}` : "Sign in to start building your portfolio"}
        </p>
        {!user ? (
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow hover:scale-[1.03] transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 32.9 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12a12 12 0 018.1 3.1l6.2-6.2A20 20 0 0024 4C12.9 4 4 12.9 4 24c0 11.1 8.9 20 20 20s20-8.9 20-20c0-1.3-.1-2.7-.3-4z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8A12 12 0 0124 12c3.3 0 6.4 1.2 8.7 3.2l6.5-6.5A20 20 0 004 24c0-3.1.7-6.1 2.3-8.7z"/>
              <path fill="#FBBC05" d="M24 44c5.6 0 10.7-1.9 14.7-5.2l-7-5.7A12 12 0 0124 36a12 12 0 01-10.4-6.1l-6.6 5.1A20 20 0 0024 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.3-4.3 5.6-7.7 5.6a12 12 0 01-8.8-3.7l-6.6 5.1A20 20 0 0044 24c0-1.3-.1-2.7-.3-4z"/>
            </svg>
            Sign in with Google
          </button>
        ) : (
          <button
            onClick={logout}
            className="w-full px-4 py-2 mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:scale-[1.03] transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
      <footer className="text-xs text-white opacity-80 mt-8 text-center">
        © 2025 Devfolio. Crafted for modern developers 🚀
      </footer>
    </div>
  );
}