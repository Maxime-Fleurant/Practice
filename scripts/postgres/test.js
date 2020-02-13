const x = { a: 1, b: 2, c: 3 };
const y = { a: 1, b: 2, c: 3 };

const f1 = obj => {
  delete obj.a;
  return obj;
};

const f2 = obj => {
  const { a, ...rest } = obj;
  return rest;
};
console.time('f2');
f2(x);
console.timeEnd('f2');
