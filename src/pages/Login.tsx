import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePhtClock } from '../hooks/usePhtClock';

const inputClass =
'mt-2 h-11 w-full rounded-[2px] border border-line-strong bg-surface-0/60 px-3 text-[14px] text-ink-primary placeholder:text-ink-tertiary transition-colors duration-150 focus:border-ink-secondary focus:outline-none focus-visible:ring-1 focus-visible:ring-ink-secondary/40';

export function Login() {
  const { user, login, signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const time = usePhtClock();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const from = (location.state as {from?: string;} | null)?.from ?? '/';
  if (user) return <Navigate to={from === '/login' ? '/' : from} replace />;

  const resetForm = () => {
    setError(null);
    setPending(false);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setPending(true);
      const result = await signup(identifier, password, name);
      setPending(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      return;
    }

    setPending(true);
    const result = await login(identifier, password);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
    }
  };

  return (
    <main className="atmosphere flex min-h-screen w-full flex-col text-ink-primary">
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-[400px] rounded-[3px] border border-line-strong bg-surface-1/80">

          <div className="border-b border-line px-7 pb-7 pt-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] tracking-widest2 text-ink-primary">DRMS</span>
              <time className="font-mono text-[10px] tracking-widest2 tabular-nums text-ink-tertiary">{time} PHT</time>
            </div>
            <h1 className="mt-10 font-display text-[32px] font-semibold leading-none tracking-[-0.03em] text-tonal">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </h1>
            <p className="mt-3 font-mono text-[10px] tracking-widest2 text-ink-tertiary">
              DISASTER RESPONSE MANAGEMENT SYSTEM
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-7 py-7">
            {mode === 'signup' && (
              <label className="block">
                <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">FULL NAME</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={pending}
                  className={inputClass} />
              </label>
            )}

            <label className={mode === 'signup' ? 'mt-5 block' : 'block'}>
              <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">USERNAME</span>
              <input
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={pending}
                className={inputClass} />
            </label>

            <label className="mt-5 block">
              <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">PASSWORD</span>
              <span className="relative block">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={pending}
                  className={`${inputClass} pr-11`} />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-[calc(50%+4px)] flex h-9 w-9 -translate-y-1/2 items-center justify-center text-ink-tertiary transition-colors duration-150 hover:text-ink-primary">
                  {showPassword ? <EyeOffIcon size={15} strokeWidth={1.5} /> : <EyeIcon size={15} strokeWidth={1.5} />}
                </button>
              </span>
            </label>

            {mode === 'signup' && (
              <label className="mt-5 block">
                <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">CONFIRM PASSWORD</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={pending}
                  className={inputClass} />
              </label>
            )}

            {error &&
            <p role="alert" className="mt-5 border-l-2 border-accent-critical pl-3 text-[13px] leading-snug text-ink-primary">
                {error}
              </p>
            }

            <button
              type="submit"
              disabled={pending}
              className="mt-7 flex h-11 w-full items-center justify-center rounded-[2px] bg-ink-primary font-mono text-[10px] tracking-widest2 text-surface-0 transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.99] disabled:opacity-60">
              {pending ? (mode === 'signin' ? 'AUTHENTICATING…' : 'CREATING ACCOUNT…') : (mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT')}
            </button>
          </form>

          <div className="border-t border-line px-7 pb-7 pt-5">
            <button
              type="button"
              onClick={() => {
                setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
                resetForm();
              }}
              className="w-full font-mono text-[10px] tracking-widest2 text-ink-secondary transition-colors duration-150 hover:text-ink-primary">
              {mode === 'signin' ? 'CREATE ACCOUNT' : 'BACK TO SIGN IN'}
            </button>
          </div>
        </motion.div>
      </div>

      <footer className="flex items-center justify-between gap-4 px-5 pb-6 md:px-10">
        <span className="font-mono text-[9px] tracking-widest2 text-ink-tertiary">SIMULATED DEMO ENVIRONMENT</span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="flex items-center gap-2 font-mono text-[9px] tracking-widest2 text-ink-tertiary transition-colors duration-150 hover:text-ink-primary">
          {theme === 'dark' ? <SunIcon size={13} strokeWidth={1.5} /> : <MoonIcon size={13} strokeWidth={1.5} />}
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>
      </footer>
    </main>);

}