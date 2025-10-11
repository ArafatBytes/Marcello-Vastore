// Utility functions for authentication
import jwt from 'jsonwebtoken';

// Decode JWT token to get user information
export function decodeToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Get current user from localStorage/sessionStorage
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
  if (!token) return null;
  
  return decodeToken(token);
}

// Check if user is logged in
export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
  if (!token) return false;
  
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return false;
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}

// Get user ID from token
export function getUserId() {
  const user = getCurrentUser();
  return user ? user._id : null;
}
