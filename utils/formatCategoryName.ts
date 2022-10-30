export const formatCategoryName = (str: string) => {
  str = str.toLowerCase();
  const t = str.split(" ");
  return t.join("_");
};
