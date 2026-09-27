import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserUseCases } from '../../../application/use-cases/UserUseCases';

export class UserController {
  constructor(private userUseCases: UserUseCases) {}

  async register(req: Request, res: Response) {
    try {
      const user = await this.userUseCases.register(req.body);
      res.status(201).json({ message: 'Usuario registrado con éxito', user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { user } = await this.userUseCases.login(req.body);
      const secret = process.env.JWT_SECRET || 'secreto_super_seguro_jwt_2026';
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '8h' }
      );

      res.status(200).json({ message: 'Autenticación exitosa', token, user });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await this.userUseCases.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await this.userUseCases.getUserById(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
