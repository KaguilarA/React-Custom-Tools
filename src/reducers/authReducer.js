import { authTypes } from "./authTypes";

/**
 * Initial state for the authentication reducer.
 *
 * @constant
 * @type {{ logged: boolean; data: any }}
 * @property {boolean} logged - Indicates if the user is authenticated.
 * @property {any} data - Holds user data or null when not authenticated.
 */
export const initialAuthState = {
  logged: false,
  data: null,
};

/**
 * Authentication reducer to handle login and logout actions.
 *
 * @param {{ logged: boolean; data: any }} initialState - Current authentication state.
 * @param {{ type: string; payload?: any }} action - Action object with a type and optional payload.
 * @returns {{ logged: boolean; data: any }} New state after applying the action.
 *
 * @example
 * dispatch({ type: authTypes.login, payload: userData });
 * dispatch({ type: authTypes.logout });
 */
export const authReducer = (initialState = initialAuthState, { type, payload }) => {
  let state;

  switch (type) {
    case authTypes.login:
      state = {
        ...initialState,
        logged: true,
        data: payload,
      };
      break;

    case authTypes.logout:
      state = { ...initialAuthState };
      break;

    default:
      state = { ...initialState };
      break;
  }

  return state;
};
