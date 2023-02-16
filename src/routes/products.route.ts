import expressPromise from 'express-promise-router';

import { productsController } from '../controllers';
import { adminAuthMiddleware, uploads } from '../middlewares';

const router = expressPromise();

router
  .route('/')
  .post(adminAuthMiddleware.auth, uploads.single('image'), productsController.addNewProduct)
  .get(productsController.getAllProduct);

router
  .route('/:id')
  .get(productsController.getProduct)
  .patch(adminAuthMiddleware.auth, uploads.single('image'), productsController.updateProduct)
  .delete(adminAuthMiddleware.auth, productsController.deleteProduct);

export const productsRoutes = router;
