import { api } from "./api";

// ======================
// Interfaces
// ======================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

// ======================
// Auth Service
// ======================

export const authService = {
  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    return response.data;
  },

  // Register
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/register", data);

    return response.data;
  },

  // Get Profile
  async profile(): Promise<User> {
    const response = await api.get<ProfileResponse>("/auth/profile");

    return response.data.user;
  },

  // Logout
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Save Auth
  saveAuth(token: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Get Token
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  // Get Current User
  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  },

  // Check Login
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};