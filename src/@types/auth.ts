import { User } from './user'

export interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  logout: () => void
}
