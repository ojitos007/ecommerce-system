import { Order } from '../entities/Order';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: number): Promise<Order[]>;
  findAll(): Promise<Order[]>;
}
