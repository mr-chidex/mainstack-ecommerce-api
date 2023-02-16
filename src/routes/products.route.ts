import expressPromise from 'express-promise-router';

import { productsController } from '../controllers';
import { uploads } from '../middlewares';

const router = expressPromise();

router.route('/').post(uploads.single('image'), productsController.addNewProduct).get(productsController.getAllProduct);

router
  .route('/:id')
  .get(productsController.getProduct)
  .patch(uploads.single('image'), productsController.updateProduct)
  .delete(productsController.deleteProduct);

export const productsRoutes = router;
