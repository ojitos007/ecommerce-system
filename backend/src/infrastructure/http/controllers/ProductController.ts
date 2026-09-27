import { Request, Response } from 'express';
import { ProductUseCases } from '../../../application/use-cases/ProductUseCases';

export class ProductController {
  constructor(private productUseCases: ProductUseCases) {}

  async createProduct(req: Request, res: Response) {
    try {
      const product = await this.productUseCases.createProduct(req.body);
      res.status(201).json({ message: 'Producto creado correctamente', product });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProducts(_req: Request, res: Response) {
    try {
      const products = await this.productUseCases.getAllProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await this.productUseCases.getProductById(id);
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await this.productUseCases.updateProduct(id, req.body);
      res.status(200).json({ message: 'Producto actualizado', product: updated });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await this.productUseCases.deleteProduct(id);
      res.status(200).json({ message: 'Producto eliminado' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
