export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value: string | null) {
  if (!value) {
    return "No sync yet";
  }

  return new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
