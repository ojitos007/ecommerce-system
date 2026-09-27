import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../../domain/repositories/IPasswordHasher';
import { RegisterUserDTO, LoginUserDTO, UserResponseDTO } from '../dtos/UserDTOs';

export class UserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async register(dto: RegisterUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const newUser = new User({
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
      role: dto.role || 'CLIENT',
    });

    const savedUser = await this.userRepository.create(newUser);
    return {
      id: savedUser.id!,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    };
  }

  async login(dto: LoginUserDTO): Promise<{ user: UserResponseDTO; rawUser: User }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Credenciales inválidas.');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas.');
    }

    return {
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      rawUser: user,
    };
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map((u) => ({
      id: u.id!,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
  }

  async getUserById(id: number): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
