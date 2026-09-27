import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateJWT } from '../middlewares/authMiddleware';

export const createCustomOrderRouter = (orderController: OrderController): Router => {
  const router = Router();

  router.use(authenticateJWT);
  router.post('/', (req, res) => orderController.createOrder(req, res));
  router.get('/my-orders', (req, res) => orderController.getMyOrders(req, res));
  router.get('/all', (req, res) => orderController.getAllOrders(req, res));
  router.get('/:id', (req, res) => orderController.getOrderById(req, res));

  return router;
};
