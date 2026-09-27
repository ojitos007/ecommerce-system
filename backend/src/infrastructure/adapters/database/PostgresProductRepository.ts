import { Product } from '../../../domain/entities/Product';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { pool } from '../../config/database';

export class PostgresProductRepository implements IProductRepository {
  async create(product: Product): Promise<Product> {
    const query = `
      INSERT INTO products (name, description, price, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, price, stock, created_at;
    `;
    const values = [product.name, product.description, product.price, product.stock];
    const { rows } = await pool.query(query, values);
    const row = rows[0];

    return new Product({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: row.stock,
      createdAt: row.created_at,
    });
  }

  async findById(id: number): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    const row = rows[0];

    return new Product({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: row.stock,
      createdAt: row.created_at,
    });
  }

  async findAll(): Promise<Product[]> {
    const query = 'SELECT * FROM products ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows.map(
      (row) =>
        new Product({
          id: row.id,
          name: row.name,
          description: row.description,
          price: Number(row.price),
          stock: row.stock,
          createdAt: row.created_at,
        })
    );
  }

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const name = product.name ?? existing.name;
    const description = product.description ?? existing.description;
    const price = product.price ?? existing.price;
    const stock = product.stock ?? existing.stock;

    const query = `
      UPDATE products
      SET name = $1, description = $2, price = $3, stock = $4
      WHERE id = $5
      RETURNING id, name, description, price, stock, created_at;
    `;
    const { rows } = await pool.query(query, [name, description, price, stock, id]);
    const row = rows[0];

    return new Product({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: row.stock,
      createdAt: row.created_at,
    });
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async updateStock(id: number, newStock: number): Promise<void> {
    const query = 'UPDATE products SET stock = $1 WHERE id = $2';
    await pool.query(query, [newStock, id]);
  }
}
