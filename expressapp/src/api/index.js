import { Router } from 'express';
import films from './routes/films';

const app = Router();

export default () => {
  films(app);

  return app;
};
