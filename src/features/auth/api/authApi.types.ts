export interface RegisterRequest {
  username: string
  email: string
  password: string
  passwordConfirmation: string
  isTermsAccepted: boolean
}

export interface ApiError {
  status: number
  data: {
    message?: string
    errors?: Record<string, string[]>
  }
}
