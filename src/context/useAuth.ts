import { useApp } from './AppContext';

/**
 * Convenience hook that exposes centralized authentication state and functions:
 * user, isAuthenticated, login, signup, enterDemoMode, logout.
 */
export const useAuth = () => {
  const {
    user,
    currentGuardians,
    isAuthenticated,
    demoMode,
    login,
    signup,
    enterDemoMode,
    switchAccount,
    logout,
  } = useApp();
  return {
    user,
    currentGuardians,
    isAuthenticated,
    demoMode,
    login,
    signup,
    enterDemoMode,
    switchAccount,
    logout,
  };
};

