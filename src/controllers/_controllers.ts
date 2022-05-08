import CryptoController from '@controllers/crypto';
import { IControllers } from '@custom-types/_types';

class Controllers {
  static getControllers(): IControllers {
    const cryptoController = new CryptoController();

    return {
      cryptoController,
    };
  }
}

export default Controllers;
