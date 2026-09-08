'use client';

import React, { useState } from 'react';
import { ApiClient } from '../lib/api';
import { User } from '../types';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, isSubscribed: boolean) => void;
  initialMode?: 'signin' | 'signup';
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin',
  promptMessage,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!username.trim() || username.trim().length < 2) {
        setError('Username must be at least 2 characters.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    } else {
      const identifier = email.trim();
      if (!identifier) {
        setError('Please enter your email or username.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await ApiClient.register(username.trim(), email.trim(), password);
        onAuthSuccess(res.user, res.isSubscribed);
      } else {
        const res = await ApiClient.login(email.trim(), password);
        onAuthSuccess(res.user, res.isSubscribed);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/50 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-soft-xl border border-zinc-200/90 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-5 px-6 sm:px-8 text-center bg-white border-b border-zinc-100 relative">
          <h2 className="text-2xl font-serif text-zinc-950 font-normal tracking-tight">
            {mode === 'signin' ? 'Sign in to NutriScan' : 'Create an account'}
          </h2>

          <p className="text-xs text-zinc-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            {promptMessage ||
              'Access full catalog search, ingredient breakdowns, and personal nutrition tracking.'}
          </p>

          {/* Mode Selector Tabs */}
          <div className="flex rounded-full bg-zinc-100 p-1 mt-5 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-zinc-950 shadow-soft-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-zinc-950 shadow-soft-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 block">
                Username
              </label>
              <div className="relative flex items-center rounded-xl bg-zinc-50 border border-zinc-200/90 focus-within:border-zinc-950 focus-within:bg-white transition-all">
                <UserIcon className="w-4 h-4 text-zinc-400 ml-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. foodexplorer"
                  className="w-full py-2.5 px-3 text-xs text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 block">
              {mode === 'signup' ? 'Email address' : 'Email or username'}
            </label>
            <div className="relative flex items-center rounded-xl bg-zinc-50 border border-zinc-200/90 focus-within:border-zinc-950 focus-within:bg-white transition-all">
              <Mail className="w-4 h-4 text-zinc-400 ml-3.5" />
              <input
                type={mode === 'signup' ? 'email' : 'text'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'signup' ? 'name@example.com' : 'email or username'}
                className="w-full py-2.5 px-3 text-xs text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 block">
              Password
            </label>
            <div className="relative flex items-center rounded-xl bg-zinc-50 border border-zinc-200/90 focus-within:border-zinc-950 focus-within:bg-white transition-all">
              <Lock className="w-4 h-4 text-zinc-400 ml-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 px-3 text-xs text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 mr-1 text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs shadow-soft-sm transition-all hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
