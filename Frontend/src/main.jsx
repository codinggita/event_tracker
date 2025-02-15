"use client";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "../src/Context/AuthContext.jsx"; // ✅ Fixed import

// Server URL
export const server = "https://zero1-eventtracker-userauth.onrender.com/api/v1/users";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
