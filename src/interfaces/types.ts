export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Flight {
  id: number;
  airlineName: string;
  flightNumber: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: number;
}

export interface SearchResponse {
  items: Flight[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Flight {
  id: number;
  airlineName: string;
  flightNumber: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: number;
}

export interface SearchResponse {
  items: Flight[];
}

export interface BookingResponse {
  id: string | number; 
  flightNumber: string;
}
