import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { OperationsProvider } from './contexts/OperationsContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { AppShell } from './components/layout/AppShell';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Live } from './pages/Live';
import { MapPage } from './pages/MapPage';

interface AppProps {
  initialTheme?: 'dark' | 'light';
  signalCondition?: 'nominal' | 'degraded' | 'offline';
}

export function App({ initialTheme = 'dark', signalCondition = 'nominal' }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider initialTheme={initialTheme}>
        <AuthProvider>
          <OperationsProvider signalCondition={signalCondition}>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  element={
                  <RequireAuth>
                      <AppShell>
                        <Outlet />
                      </AppShell>
                    </RequireAuth>
                  }>
                  
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/live" element={<Live />} />
                  <Route path="/map" element={<MapPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </OperationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </MotionConfig>);

}
