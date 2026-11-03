/** Convierte un Date a "yyyy-MM-dd" (LocalDate del backend) sin desfase de zona horaria. */
export function toIsoDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value.substring(0, 10);
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, '0');
  const d = String(value.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Convierte "yyyy-MM-dd" a Date local para el datepicker. */
export function fromIsoDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [y, m, d] = value.substring(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}
