import { Order, OrderItem } from '../../domain/entities/Order';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateOrderDTO } from '../dtos/OrderDTOs';

export class OrderUseCases {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private userRepository: IUserRepository
  ) {}

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('El usuario especificado no existe.');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new Error('El pedido debe contener al menos un producto.');
    }

    const orderItems: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const product = await this.productRepository.findById(itemDto.productId);
      if (!product) {
        throw new Error(`Producto con ID ${itemDto.productId} no encontrado.`);
      }

      if (!product.hasEnoughStock(itemDto.quantity)) {
        throw new Error(
          `Stock insuficiente para el producto "${product.name}". Disponible: ${product.stock}, Solicitado: ${itemDto.quantity}`
        );
      }

      const orderItem = new OrderItem({
        productId: product.id!,
        quantity: itemDto.quantity,
        unitPrice: Number(product.price),
      });

      orderItems.push(orderItem);
    }

    const totalAmount = Order.calculateTotal(orderItems);

    const newOrder = new Order({
      userId: dto.userId,
      items: orderItems,
      totalAmount: totalAmount,
      status: 'PENDING',
    });

    const savedOrder = await this.orderRepository.create(newOrder);

    for (const itemDto of dto.items) {
      const product = await this.productRepository.findById(itemDto.productId);
      if (product) {
        const updatedStock = product.stock - itemDto.quantity;
        await this.productRepository.updateStock(product.id!, updatedStock);
      }
    }

    return savedOrder;
  }

  async getOrderById(id: number): Promise<Order | null> {
    return await this.orderRepository.findById(id);
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await this.orderRepository.findByUserId(userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
}
