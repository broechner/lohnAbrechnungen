export const toRappen = (amount: number): number => Math.round(amount * 100);

export const fromRappen = (rappen: number): number => rappen / 100;

export const roundToIncrement = (rappen: number, increment: number): number => {
  if (increment <= 0) return rappen;
  const remainder = rappen % increment;
  if (remainder === 0) return rappen;
  return rappen + (increment - remainder);
};

export const formatChf = (rappen: number, locale: string = "de-CH"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(fromRappen(rappen));
};
