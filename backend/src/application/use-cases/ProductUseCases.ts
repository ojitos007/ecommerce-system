import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/ProductDTOs';

export class ProductUseCases {
  constructor(private productRepository: IProductRepository) {}

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    const product = new Product({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
    });
    return await this.productRepository.create(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async updateProduct(id: number, dto: UpdateProductDTO): Promise<Product | null> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new Error('Producto no encontrado.');

    return await this.productRepository.update(id, dto);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new Error('Producto no encontrado.');

    return await this.productRepository.delete(id);
  }
}
