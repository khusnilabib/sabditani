const numberFormatter = new Intl.NumberFormat('id-ID');
const decimalFormatter = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '0';
  return decimals > 0
    ? new Intl.NumberFormat('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)
    : numberFormatter.format(Math.round(value));
}

export function formatDecimal(value: number): string {
  return decimalFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatCurrency(value: number): string {
  return `Rp ${formatNumber(value)}`;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value + 'T00:00:00') : value;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
