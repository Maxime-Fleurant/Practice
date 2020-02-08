import bodyParser from 'body-parser';
import routes from '../api';
import { asyncHandler } from '../utils';

export default async app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(routes());

  app.use(
    '/',
    asyncHandler(async (req, res) => {
      console.log('fdlk');
      throw new Error('fldk');
    })
  );

  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        status: err.status || 500
      }
    });
  });
};
