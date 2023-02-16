import expressPromise from 'express-promise-router';
import { productsController } from '../controllers';
import { uploads } from '../middlewares';

const router = expressPromise();

router.route('/').post(uploads.single('image'), productsController.addNewProduct);

export const productsRoutes = router;
