// Authentication Context
import React, { createContext, useReducer, useEffect } from 'react';
import { authAPI, handleApiError } from '../services/api';

const AuthContext = createContext();

// Initial state
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      return {
        user,
        token,
        isAuthenticated: true,
        isLoading: true, // Still loading to verify token
        error: null,
      };
    } catch {
      // If parsing fails, use default initial state
    }
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };
};

const initialState = getInitialState();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          // Parse stored user data
          const parsedUser = JSON.parse(userData);
          
          // Set authentication state immediately with stored data
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: parsedUser,
              token: token,
            },
          });

          // Verify token is still valid in background
          try {
            const response = await authAPI.getProfile();
            
            // Update with fresh user data from API if different
            if (JSON.stringify(response.data.user) !== JSON.stringify(parsedUser)) {
              localStorage.setItem('user', JSON.stringify(response.data.user));
              dispatch({
                type: 'UPDATE_USER',
                payload: response.data.user,
              });
            }
            
            // Token is valid, set loading to false
            dispatch({ type: 'SET_LOADING', payload: false });
          } catch (verifyError) {
            console.log('Background token verification failed:', verifyError);
            // Only logout if it's a 401/403 error (unauthorized)
            if (verifyError.response?.status === 401 || verifyError.response?.status === 403) {
              console.log('Token is invalid, logging out');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              dispatch({ type: 'AUTH_FAILURE', payload: null });
            } else {
              // For other errors (network, server), keep user logged in but stop loading
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          }
        } catch (parseError) {
          console.log('Error parsing stored user data:', parseError);
          // If we can't parse stored data, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_FAILURE', payload: null });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
        
        return { success: true, user };
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register Candidate
  const registerCandidate = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.registerCandidate(userData);
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
        
        return { success: true, user };
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register Company
  const registerCompany = async (companyData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.registerCompany(companyData);
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
        
        return { success: true, user };
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value = {
    ...state,
    login,
    registerCandidate,
    registerCompany,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
