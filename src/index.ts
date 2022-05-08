import Routes from '@routes/_routes';
import express from 'express';
import cors from 'cors';

const app = express();
const router = express.Router();

app.use(cors());
app.use(router);

const PORT = process.env.PORT || 8899;

// Initial Router
Routes.init(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server Started at PORT ${PORT}`);
});
