export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  isTermsAccepted: boolean;
};

export type RegisterResponse = {
  success: boolean;
  email?: string;
  message?: string;
};
