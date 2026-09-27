import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { pool } from '../../config/database';

export class PostgresUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, password_hash, role, created_at;
    `;
    const values = [user.name, user.email, user.passwordHash, user.role];
    const { rows } = await pool.query(query, values);
    const row = rows[0];

    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
    });
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    const row = rows[0];

    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    if (rows.length === 0) return null;
    const row = rows[0];

    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
    });
  }

  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows.map(
      (row) =>
        new User({
          id: row.id,
          name: row.name,
          email: row.email,
          passwordHash: row.password_hash,
          role: row.role,
          createdAt: row.created_at,
        })
    );
  }
}
