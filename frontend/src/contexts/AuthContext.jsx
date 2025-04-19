import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log(`Making request to: ${API_BASE_URL}/api/v1/auth/login`);
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.status === 403) {
        let errorData;
        try {
          errorData = await response.json();
          console.log("Received 403 error data:", errorData); // Log the parsed data
        } catch (jsonError) {
          console.error("Failed to parse JSON for 403 error:", jsonError);
          throw new Error('Received 403 status, but failed to parse error details.');
        }

        // Access the nested detail object
        const detail = errorData?.detail; 

        if (detail && detail.require_verification === true) { // Check inside detail object
          console.log("Throwing requireVerification error object");
          throw {
            requireVerification: true,
            email: detail.email, // Get email from detail
            message: detail.message || 'User not verified' // Get message from detail
          };
        } else {
          console.log("403 error data did not meet require_verification criteria, throwing generic error.");
          throw new Error(detail?.message || errorData?.message || 'Forbidden access'); // Use optional chaining
        }
      } else if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
           console.error("Failed to parse JSON for non-403 error:", jsonError);
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData?.detail?.message || errorData?.message || `HTTP error! status: ${response.status}`); // Check detail first
      }
      
      const data = await response.json();
      
      if (!data.User || !data.User.role) {
        throw new Error('Invalid user data received from server');
      }

      const user = {
        id: data.User.id,
        name: data.User.name,
        email: data.User.email,
        role: data.User.role.toLowerCase(), // Ensure consistent case
        token: data.access_token
      };
      
      // Update state and storage synchronously
      localStorage.setItem('user', JSON.stringify(user));
      await new Promise(resolve => {
        setCurrentUser(user);
        resolve();
      });
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      return { success: true, email: data.email, userId: data.id };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'OTP verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    verifyOTP,
    resendOTP, // Add resendOTP function
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// Resend OTP function
const resendOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to resend OTP');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Resend OTP error:', error);
    throw error;
  }
};
