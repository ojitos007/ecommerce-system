import { Product } from '../entities/Product';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(id: number, product: Partial<Product>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
  updateStock(id: number, newStock: number): Promise<void>;
}
