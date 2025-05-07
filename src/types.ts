
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  points?: number; // Added points for reward system
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  nextDose?: string;
  createdAt: number; // timestamp
  image?: string; // base64 encoded image
  completed?: boolean; // Track if medication has been taken
  lastCompleted?: number; // timestamp of last completion
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPoints?: (points: number) => void; // Method to update user points
}
