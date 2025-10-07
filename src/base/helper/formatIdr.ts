export function formatIdr(
  value: number | string | null | undefined,
  opts?: Intl.NumberFormatOptions
): string {
  const number = typeof value === "string" ? Number(value) : value ?? 0;
  const safeNumber = Number.isFinite(number as number) ? (number as number) : 0;
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...opts,
  });
  return formatter.format(safeNumber);
}

export default formatIdr;
