import Sequelize from 'sequelize';

export default async () => {
  const sequelize = new Sequelize('dvdrental', 'Excel', 'Galaktika89', { host: 'localhost' });

  try {
    const isAuth = await sequelize.authenticate();
    console.log(isAuth);
  } catch (error) {
    console.log(error);
  }
  console.log('done');
  return sequelize;
};
