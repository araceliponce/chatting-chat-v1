import { createContext, useContext, useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { CREATE_USER, LOGIN_USER } from "@/graphql_utils/mutations";
import { jwtDecode } from 'jwt-decode';
import { STORAGE_KEY } from "@/utils/constants";
import { Navigate } from "react-router-dom";


interface AuthContextType {
  user: { _id: string; username: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  // isAuthenticated: boolean;
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ _id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  // console.log('loading?', loading)
  const client = useApolloClient();

  // Check if there's a token in localStorage, decode it
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      try {

        const decoded = jwtDecode<{ _id: string; username: string }>(token);
        // console.log('DECODED', { decoded }) //_id, email, etc
        // setUser(decoded); since the info of user is in decoded.data
        setUser((decoded as any).data);

      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem(STORAGE_KEY); // Clean up if the token is invalid
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes reemplazar esto con un spinner o cualquier otro indicador
  }

  // Si no hay usuario (o token), redirigimos al login


  // Login function
  const login = async (email: string, password: string) => {
    const { data } = await client.mutate({
      mutation: LOGIN_USER,
      variables: { email, password },
    });

    const token = data?.login?.token;
    if (token) {
      localStorage.setItem(STORAGE_KEY, token); // Store token in localStorage
      try {
        const decoded = jwtDecode<{ _id: string; username: string }>(token);
        // setUser(decoded);
        setUser((decoded as any).data);

      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error('no token att context')
    }
  };

  // Signup function
  const signup = async (username: string, email: string, password: string) => {
    const { data } = await client.mutate({
      mutation: CREATE_USER,
      variables: { username, email, password },
    });

    const token = data?.createUser?.token;
    if (token) {
      localStorage.setItem(STORAGE_KEY, token); // Store token in localStorage
      try {
        const decoded = jwtDecode<{ _id: string; username: string }>(token); // Typecast the decoded token
        // setUser(decoded); // Set the user state with the decoded valuesng the token
        setUser((decoded as any).data);

      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY); // Remove token from localStorage
    setUser(null); // Clear the user state
    // window.location.href = "/login"; // Redirect to login page
    return <Navigate to="/login" replace />;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
