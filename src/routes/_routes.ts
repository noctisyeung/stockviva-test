import Controllers from '@controllers/_controllers';
import CryptoRoute from '@routes/crypto.route';
import { Router } from 'express';

class Routes {
  static init(router: Router) {
    CryptoRoute.create(router, Controllers.getControllers());
  }
}

export default Routes;
