import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitorPage } from './pages/LiveMonitorPage';
import { CallHistoryPage } from './pages/CallHistoryPage';
import { CallDetailsPage } from './pages/CallDetailsPage';
import { TrustedContactsPage } from './pages/TrustedContactsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicLayout>
                <SignupPage />
              </PublicLayout>
            }
          />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-monitor"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LiveMonitorPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/call-history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CallHistoryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/call-details/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CallDetailsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trusted-contacts"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TrustedContactsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalyticsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HowItWorksPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Wildcard fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
