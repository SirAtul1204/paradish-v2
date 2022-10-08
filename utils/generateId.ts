export const generateId = (len: number): string => {
  const digits = "0123456789";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const chars = digits + letters.toUpperCase();
  let id = "";
  for (let i = 0; i < len; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};
