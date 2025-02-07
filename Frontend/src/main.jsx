import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createContext } from 'react';

// Server URL
export const server = "https://eventtracker-user.onrender.com/api/v1/users";

// Create a context for authentication
export const Context = createContext({ isAuthenticated: false, setIsAuthenticated: () => {} });

const Main = () => {
  // State to manage authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Context.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <App />
    </Context.Provider>
  );
};

// Render the App
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
