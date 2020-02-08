const utils2 = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export default utils2;
