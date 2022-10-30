export const deFormatCategoryName = (str: string) => {
  console.log(str);
  const t = str.split("_");
  console.log(t);
  const t2 = t.map((s) => s[0].toUpperCase() + s.slice(1));
  console.log(t2);
  return t2.join(" ");
};
