import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { loginWithGoogle, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/profile');
    } catch {
      alert("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 animate-fadeIn">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to <span className="text-purple-600">Devfolio</span></h1>
          <p className="text-gray-500 mt-2">Create your portfolio in minutes 🚀</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-[1.03] hover:shadow-lg transition duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M44.5 20H24v8.5h11.8c-.7 4.2-4.1 7.5-8.3 7.5-4.8 0-8.8-4-8.8-8.8s4-8.8 8.8-8.8c2.2 0 4.2.8 5.8 2.1l6.1-6.1C35.9 11.5 32.2 10 28 10c-9.9 0-18 8.1-18 18s8.1 18 18 18c8.6 0 16-6.3 17.4-14.5H44.5V20z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          By signing in you agree to our terms and privacy.
        </p>
      </div>
    </div>
  );
}
