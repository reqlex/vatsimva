// VATSIM User data from OAuth
export interface VatsimUser {
  cid: string
  personal: {
    name_first: string
    name_last: string
    name_full: string
    email: string
    country: {
      id: string
      name: string
    }
  }
  vatsim: {
    rating: {
      id: number
      long: string
      short: string
    }
    pilotrating: {
      id: number
      long: string
      short: string
    }
    division: {
      id: string
      name: string
    }
    region: {
      id: string
      name: string
    }
    subdivision: {
      id: string | null
      name: string | null
    }
  }
  oauth: {
    token_valid: string
  }
}

// Simplified user for client-side
export interface User {
  cid: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  country: string
  rating: string
  pilotRating: string
  division: string
}

// OAuth token response from VATSIM
export interface VatsimTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scopes: string[]
}

// Session data stored in cookie
export interface SessionData {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: number
}

// Auth state for client
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// VATSIM Pilot Statistics from ratings API
export interface VatsimPilotStatistics {
  id: string // CID
  rating: number
  pilotrating: number
  susp_date: string | null
  reg_date: string
  region: string
  division: string
  subdivision: string | null
  lastratingchange: string

  // Statistics data
  atc?: {
    hours: number
    s1: number
    s2: number
    s3: number
    c1: number
    c3: number
    i1: number
    i3: number
    sup: number
    adm: number
  }
  pilot?: {
    hours: number
    p1?: number
    p2?: number
    p3?: number
    p4?: number
  }
}
