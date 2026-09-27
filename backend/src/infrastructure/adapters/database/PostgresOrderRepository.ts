import { Order, OrderItem } from '../../../domain/entities/Order';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { pool } from '../../config/database';

export class PostgresOrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderQuery = `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, total_amount, status, created_at;
      `;
      const orderValues = [order.userId, order.totalAmount, order.status];
      const { rows: orderRows } = await client.query(orderQuery, orderValues);
      const savedOrderRow = orderRows[0];

      const savedItems: OrderItem[] = [];

      for (const item of order.items) {
        const itemQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
          RETURNING id, order_id, product_id, quantity, unit_price;
        `;
        const itemValues = [savedOrderRow.id, item.productId, item.quantity, item.unitPrice];
        const { rows: itemRows } = await client.query(itemQuery, itemValues);
        const itemRow = itemRows[0];

        savedItems.push(
          new OrderItem({
            id: itemRow.id,
            orderId: itemRow.order_id,
            productId: itemRow.product_id,
            quantity: itemRow.quantity,
            unitPrice: Number(itemRow.unit_price),
          })
        );
      }

      await client.query('COMMIT');

      return new Order({
        id: savedOrderRow.id,
        userId: savedOrderRow.user_id,
        items: savedItems,
        totalAmount: Number(savedOrderRow.total_amount),
        status: savedOrderRow.status,
        createdAt: savedOrderRow.created_at,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: number): Promise<Order | null> {
    const orderQuery = 'SELECT * FROM orders WHERE id = $1';
    const { rows: orderRows } = await pool.query(orderQuery, [id]);
    if (orderRows.length === 0) return null;
    const orderRow = orderRows[0];

    const itemsQuery = 'SELECT * FROM order_items WHERE order_id = $1';
    const { rows: itemRows } = await pool.query(itemsQuery, [id]);

    const items = itemRows.map(
      (r) =>
        new OrderItem({
          id: r.id,
          orderId: r.order_id,
          productId: r.product_id,
          quantity: r.quantity,
          unitPrice: Number(r.unit_price),
        })
    );

    return new Order({
      id: orderRow.id,
      userId: orderRow.user_id,
      items: items,
      totalAmount: Number(orderRow.total_amount),
      status: orderRow.status,
      createdAt: orderRow.created_at,
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const query = 'SELECT id FROM orders WHERE user_id = $1 ORDER BY id DESC';
    const { rows } = await pool.query(query, [userId]);

    const orders: Order[] = [];
    for (const row of rows) {
      const order = await this.findById(row.id);
      if (order) orders.push(order);
    }
    return orders;
  }

  async findAll(): Promise<Order[]> {
    const query = 'SELECT id FROM orders ORDER BY id DESC';
    const { rows } = await pool.query(query);

    const orders: Order[] = [];
    for (const row of rows) {
      const order = await this.findById(row.id);
      if (order) orders.push(order);
    }
    return orders;
  }
}
