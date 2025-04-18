import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { authReducer, initialAuthState } from './authReducer';
import { authTypes } from './authTypes';

/**
 * React context that holds authentication state and actions.
 * Can be used throughout the app via the `useContext` hook.
 *
 * @constant
 * @type {React.Context<{
 *   logged: boolean,
 *   data: any,
 *   onLogIn?: (data: any) => void,
 *   onLogOut?: () => void
 * }>}
 */
export const AuthContext = createContext({ ...initialAuthState });

/**
 * Initializes the authentication state from sessionStorage.
 *
 * @function
 * @param {string} name - Key used to retrieve the data from sessionStorage.
 * @returns {{ logged: boolean, data: any }} Initial authentication state.
 */
const initializeAuthState = (name) => {
  try {
    const raw = sessionStorage.getItem(name);
    const data = raw ? JSON.parse(raw) : null;

    return {
      ...initialAuthState,
      logged: !!data,
      data,
    };
  } catch (error) {
    console.warn('[AuthProvider] Failed to parse sessionStorage:', error);
    return { ...initialAuthState };
  }
};

/**
 * Context provider component that supplies authentication state and actions
 * (`onLogIn`, `onLogOut`) to its children using the AuthContext.
 * It also synchronizes auth data with sessionStorage using a provided key name.
 *
 * @component
 * @param {{ children: React.ReactNode, name: string }} props - React children nodes and the sessionStorage key name.
 * @returns {JSX.Element} Context provider with auth state and actions.
 *
 * @example
 * <AuthProvider name="auth-session">
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children, name }) => {
  const [authState, authDispatch] = useReducer(
    authReducer,
    initialAuthState,
    initializeAuthState(name)
  );

  /**
   * Dispatches the login action with user data,
   * and stores the data in sessionStorage under the provided name key.
   *
   * @param {any} data - User data to be stored on login.
   */
  const onLogIn = (data) => {
    authDispatch({ type: authTypes.login, payload: data });
    sessionStorage.setItem(name, JSON.stringify(data));
  };

  /**
   * Dispatches the logout action, clears auth state,
   * and removes the data from sessionStorage under the provided name key.
   */
  const onLogOut = () => {
    authDispatch({ type: authTypes.logout });
    sessionStorage.removeItem(name);
  };

  return (
    <AuthContext.Provider value={{ ...authState, onLogIn, onLogOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};
