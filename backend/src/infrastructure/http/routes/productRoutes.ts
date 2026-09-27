import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateJWT } from '../middlewares/authMiddleware';

export const createCustomProductRouter = (productController: ProductController): Router => {
  const router = Router();

  router.get('/', (req, res) => productController.getAllProducts(req, res));
  router.get('/:id', (req, res) => productController.getProductById(req, res));
  router.post('/', authenticateJWT, (req, res) => productController.createProduct(req, res));
  router.put('/:id', authenticateJWT, (req, res) => productController.updateProduct(req, res));
  router.delete('/:id', authenticateJWT, (req, res) => productController.deleteProduct(req, res));

  return router;
};
