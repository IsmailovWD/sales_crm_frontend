export const formatCurrency = (
  value: number | null | string,
  minimumFractionDigits?: number
): string => {
  if (value == null || value === "") return "";

  if (typeof value === "string") {
    value = parseCurrency(value);
  }

  let txt = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minimumFractionDigits ?? 1,
    maximumFractionDigits: 3,
  })
    .format(value ?? 0)
    .replace(/,/g, " ");

  return txt;
};
export const parseCurrency = (input: string | number) => {
  let num = "0";
  if (typeof input === "string") num = input.replace(/(,|\$|\s)/g, "").trim();
  if (typeof input === "number") num = input.toString();
  if (/^\d+(\.(\d+)?)?$/.test(num)) return parseFloat(num);
  return num === "" ? null : Number.NaN;
};
