import { Response } from 'express';
import { OrderUseCases } from '../../../application/use-cases/OrderUseCases';
import { AuthRequest } from '../middlewares/authMiddleware';

export class OrderController {
  constructor(private orderUseCases: OrderUseCases) {}

  async createOrder(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Usuario no identificado' });

      const orderData = { userId, items: req.body.items };
      const order = await this.orderUseCases.createOrder(orderData);

      res.status(201).json({ message: 'Pedido creado exitosamente', order });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrderById(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const order = await this.orderUseCases.getOrderById(id);
      if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Usuario no identificado' });

      const orders = await this.orderUseCases.getOrdersByUserId(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllOrders(_req: AuthRequest, res: Response) {
    try {
      const orders = await this.orderUseCases.getAllOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
