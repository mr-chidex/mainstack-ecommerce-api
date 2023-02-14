import expressPromise from 'express-promise-router';

import { authController } from '../controllers';

const router = expressPromise();

router.route('/register').post(authController.register);

export const authRoutes = router;
