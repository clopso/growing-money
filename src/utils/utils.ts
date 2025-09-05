// --- Utility Functions ---

// Formats a number into a BRL currency string for display in results.
export const formatToBRL = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
    .format(value)
    .replace(/\s/g, "");
};

// Formats a raw string of digits into a BRL format for the input field.
export const formatBRLInput = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  const number = parseInt(numericValue, 10) / 100;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

// Parses a BRL-formatted string from an input into a number.
export const parseBRLInput = (value: string): number => {
  const numericValue = value.replace(/\D/g, "");
  if (numericValue === "") return 0;
  return parseInt(numericValue, 10) / 100;
};

// Sanitizes and formats a string for a percentage input (allows one comma).
export const formatPercentInput = (value: string): string => {
  let sanitized = value.replace(/[^0-9,]/g, "");
  const parts = sanitized.split(",");
  if (parts.length > 2) {
    sanitized = parts[0] + "," + parts.slice(1).join("");
  }
  return sanitized;
};

// Parses a percentage string (with a comma) into a number.
export const parsePercentInput = (value: string): number => {
  const parsed = parseFloat(value.replace(",", "."));
  return isNaN(parsed) ? 0 : parsed;
};
