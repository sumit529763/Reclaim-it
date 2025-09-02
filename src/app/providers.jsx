// src/app/providers.jsx
import React from "react";
import { AuthProvider } from "../hooks/useAuth";

export default function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
