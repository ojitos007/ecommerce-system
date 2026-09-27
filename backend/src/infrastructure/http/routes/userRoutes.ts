import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export const createCustomUserRouter = (userController: UserController): Router => {
  const router = Router();

  router.post('/register', (req, res) => userController.register(req, res));
  router.post('/login', (req, res) => userController.login(req, res));
  router.get('/', (req, res) => userController.getAllUsers(req, res));
  router.get('/:id', (req, res) => userController.getUserById(req, res));

  return router;
};
