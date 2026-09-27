import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { PostgresUserRepository } from './infrastructure/adapters/database/PostgresUserRepository';
import { PostgresProductRepository } from './infrastructure/adapters/database/PostgresProductRepository';
import { PostgresOrderRepository } from './infrastructure/adapters/database/PostgresOrderRepository';
import { BcryptPasswordHasher } from './infrastructure/adapters/security/BcryptPasswordHasher';

import { UserUseCases } from './application/use-cases/UserUseCases';
import { ProductUseCases } from './application/use-cases/ProductUseCases';
import { OrderUseCases } from './application/use-cases/OrderUseCases';

import { UserController } from './infrastructure/http/controllers/UserController';
import { ProductController } from './infrastructure/http/controllers/ProductController';
import { OrderController } from './infrastructure/http/controllers/OrderController';

import { createCustomUserRouter } from './infrastructure/http/routes/userRoutes';
import { createCustomProductRouter } from './infrastructure/http/routes/productRoutes';
import { createCustomOrderRouter } from './infrastructure/http/routes/orderRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const userRepository = new PostgresUserRepository();
const productRepository = new PostgresProductRepository();
const orderRepository = new PostgresOrderRepository();
const passwordHasher = new BcryptPasswordHasher();

const userUseCases = new UserUseCases(userRepository, passwordHasher);
const productUseCases = new ProductUseCases(productRepository);
const orderUseCases = new OrderUseCases(orderRepository, productRepository, userRepository);

const userController = new UserController(userUseCases);
const productController = new ProductController(productUseCases);
const orderController = new OrderController(orderUseCases);

app.use('/api/users', createCustomUserRouter(userController));
app.use('/api/products', createCustomProductRouter(productController));
app.use('/api/orders', createCustomOrderRouter(orderController));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log('==================================================');
  console.log(` Servidor Backend ejecutándose en el puerto: ${PORT}`);
  console.log(' Arquitectura Hexagonal activa - PostgreSQL conectado');
  console.log('==================================================');
});
