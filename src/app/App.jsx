// src/app/App.jsx
import React from "react";
import PageShell from "../components/composite/PageShell";
import AppRoutes from "./routes";

export default function App() {
  return (
    <PageShell>
      <AppRoutes />
    </PageShell>
  );
}
