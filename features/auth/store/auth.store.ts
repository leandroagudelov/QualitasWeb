import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
  fullName: string;
  role: string;
  tenant: string;
  imageUrl?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

// Helper para decodificar el token y extraer usuario
const decodeUser = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.jti || '',
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
      name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      fullName: decoded.fullName || '',
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '',
      tenant: decoded.tenant || 'root',
      imageUrl: decoded.image_url
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (accessToken: string, refreshToken: string) => {
        const user = decodeUser(accessToken);
        
        set({ 
          accessToken, 
          refreshToken, 
          user,
          isAuthenticated: true 
        });
      },

      logout: () => {
        set({ 
          accessToken: null, 
          refreshToken: null, 
          user: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage', // nombre en localStorage
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
