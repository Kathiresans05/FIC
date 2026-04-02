import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/${id}`);
      if (response.ok) {
        const fullUser = await response.json();
        // Normalize MongoDB _id to id for frontend consistency
        const normalizedUser = { ...fullUser, id: fullUser._id };
        setUser(normalizedUser);
        localStorage.setItem('forgeindia_user', JSON.stringify(normalizedUser));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Helper to check if ID is a valid MongoDB ObjectId (24 hex chars)
  const isValidMongoId = (id) => id && /^[a-f\d]{24}$/i.test(id);

  useEffect(() => {
    const storedUser = localStorage.getItem('forgeindia_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const userId = parsed.id || parsed._id;

      if (!isValidMongoId(userId)) {
        // Stale/invalid session — clear it so app shows login
        localStorage.removeItem('forgeindia_user');
        setLoading(false);
        return;
      }

      setUser(parsed);
      // Fetch fresh data from DB to ensure sync
      fetchUserData(userId);
    }
    setLoading(false);
  }, []);

  const login = async (role) => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    try {
      // Try to find a real user with this role in the DB
      const res = await fetch(`${API_BASE}/api/users?role=${encodeURIComponent(role)}`);
      if (res.ok) {
        const users = await res.json();
        if (users.length > 0) {
          const dbUser = users[0];
          const normalizedUser = { ...dbUser, id: dbUser._id };
          setUser(normalizedUser);
          localStorage.setItem('forgeindia_user', JSON.stringify(normalizedUser));
          return;
        }
      }
    } catch (err) {
      console.warn('Could not fetch user from DB, using mock session:', err);
    }

    // Fallback: create a session-only mock (no DB sync)
    const mockUser = {
      id: null,
      name: role === 'Agent' ? 'Rahul Sharma' : role.includes('Consultancy') ? 'Neha Gupta' : 'Admin User',
      role,
      email: `${role.toLowerCase().replace(/ /g, '_')}@forgeindia.pro`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
    };
    setUser(mockUser);
    localStorage.setItem('forgeindia_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forgeindia_user');
  };

  const updateUserSession = (updatedProps) => {
    const updatedUser = { ...user, ...updatedProps };
    setUser(updatedUser);
    localStorage.setItem('forgeindia_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
