
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { toast } from '../components/ui/use-toast';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing user session
    const storedUser = localStorage.getItem('pill-pal-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('pill-pal-user');
      }
    }
    setLoading(false);
  }, []);

  // Mock login function for demo
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      // In a real app, validate credentials against a backend
      if (email && password) {
        // Mock successful login
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          name: email.split('@')[0],
        };
        setUser(newUser);
        localStorage.setItem('pill-pal-user', JSON.stringify(newUser));
        toast({
          title: "Login successful",
          description: "Welcome back to PillPal!",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock Google login
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      // Mock successful Google login
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
        name: `Test User ${Math.floor(Math.random() * 100)}`,
        avatar: `https://ui-avatars.com/api/?name=Test+User&background=9b87f5&color=fff`,
      };
      setUser(newUser);
      localStorage.setItem('pill-pal-user', JSON.stringify(newUser));
      toast({
        title: "Google login successful",
        description: `Welcome, ${newUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Could not log in with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      // In a real app, send registration to backend
      if (email && password && name) {
        // Mock successful registration
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          name,
        };
        setUser(newUser);
        localStorage.setItem('pill-pal-user', JSON.stringify(newUser));
        toast({
          title: "Registration successful",
          description: "Welcome to PillPal!",
        });
      } else {
        throw new Error("Please fill all required fields");
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('pill-pal-user');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
