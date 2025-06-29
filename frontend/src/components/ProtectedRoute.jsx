// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute ensures that only authenticated users can access certain routes.
 * If the user is not authenticated, they are redirected to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
