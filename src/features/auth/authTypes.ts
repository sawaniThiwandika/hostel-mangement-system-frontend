export interface UserSignUpRequest {
  username: string
  password: string
}

export interface OwnerCreateRequest {
  user: UserSignUpRequest
  ownerName: string
  nic: string
  tel: string
  address: string
  workplace: string
  jobTitle: string
  email: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  id: string
  username: string
  email: string
  role: string
  message: string
}
