const validateName = (name: string): boolean => {
  if (name.length > 10) return false;
  const re = new RegExp(/^[0-9a-zA-Z]+$/);
  return re.test(name);
};

const randomId = (n: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTVWZYX123456789';
  let id = '';
  for (let i = 0; i < n; i++) {
    id += chars[Math.trunc(Math.random() * chars.length)];
  }
  return id;
};

export { validateName, randomId };
