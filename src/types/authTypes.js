/**
 * Action types for authentication.
 *
 * These constants are typically used in a reducer or state management context
 * (e.g., useReducer or Redux) to represent the different actions that can
 * be dispatched related to authentication state.
 *
 * @constant
 * @type {{ login: string; logout: string }}
 * @property {string} login - Action type for user login.
 * @property {string} logout - Action type for user logout.
 */
export const authTypes = {
  login: "[Auth] Log in",
  logout: "[Auth] Log out",
};
