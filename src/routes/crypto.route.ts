import { IControllers } from '@custom-types/controllers.type';
import { Request, Router, Response } from 'express';

class CryptoRoute {
  static create(router: Router, controllers: IControllers) {
    router.get('/api/crypto', async (req: Request, res: Response) => {
      const result = await controllers.cryptoController.getCrypto(
        // Force 1 currency change only
        (req.query.currency as string)?.slice(0, 3),
      );
      res.json(result);
    });
  }
}

export default CryptoRoute;
