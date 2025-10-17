// src/features/dashboard/layout/AdminGuard.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'; 

/**
 * A wrapper component to protect routes, allowing access only to users 
 * who have the role of 'admin'.
 */
export default function AdminGuard({ children }) {
  
  // Destructure the necessary states from our modified useAuth hook
  const { initializing, profileLoading, isAdmin } = useAuth();

  // 1. Loading State Check
  // If the app is still initializing (checking Firebase auth) OR 
  // still fetching the user's profile/role from Firestore, show a loading message.
  if (initializing || profileLoading) {
    return (
        <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
            Checking security permissions... ⏳
        </div>
    );
  }

  // 2. Authorization Check
  // If loading is complete and the user is NOT an admin, block access.
  if (!isAdmin) {
    // Redirect non-admin users to the home page (or a designated unauthorized page).
    // The 'replace' prop ensures they cannot simply click 'back' to access the restricted page.
    return <Navigate to="/" replace />; 
  }

  // 3. Authorized Access
  // If the user is authenticated and confirmed as an admin, render the requested content.
  return children;
}