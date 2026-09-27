export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role?: 'CLIENT' | 'ADMIN';
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
}
