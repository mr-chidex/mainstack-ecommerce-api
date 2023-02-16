import expressPromise from 'express-promise-router';
import { productsController } from '../controllers';

const router = expressPromise();

router.route('/').post(productsController.addNewProduct);

export const productsRoutes = router;
