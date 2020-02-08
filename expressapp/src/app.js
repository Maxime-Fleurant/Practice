import express from 'express';
import loader from './loader';

const startApp = async () => {
  const app = express();

  await loader(app);

  await app.listen(3000);
};

startApp().catch(err => {
  console.log('StartupErr', err);
});
