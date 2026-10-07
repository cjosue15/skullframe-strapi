/** Converts a catalog price in soles to an exact, safe integer in cents. */
export const solesToCents = (amount: number | string): number => {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(amount.toString());
  const fraction = match?.[2] ?? '';

  if (!match || /[1-9]/.test(fraction.slice(2))) {
    throw new Error('El precio debe ser un importe no negativo con hasta dos decimales.');
  }

  // Parse decimal digits instead of multiplying a floating-point price by 100.
  const cents = BigInt(match[1]) * BigInt(100) + BigInt(fraction.slice(0, 2).padEnd(2, '0'));
  const result = Number(cents);

  if (!Number.isSafeInteger(result)) {
    throw new Error('El precio supera el importe máximo permitido.');
  }

  return result;
};

/** Formats stored integer cents as the decimal string expected by Mercado Pago. */
export const centsToSoles = (amount: number | string): string => {
  if ((typeof amount === 'number' && !Number.isSafeInteger(amount)) || !/^\d+$/.test(amount.toString())) {
    throw new Error('El importe en céntimos debe ser un entero no negativo.');
  }

  const digits = BigInt(amount).toString().padStart(3, '0');
  return `${digits.slice(0, -2)}.${digits.slice(-2)}`;
};
