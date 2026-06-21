const MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez"
];
function dueDateOrder(due) {
  if (!due) return Number.MAX_SAFE_INTEGER;
  const [day, month] = due.split(" ");
  const m = MONTHS_SHORT.indexOf(month ?? "");
  return (m < 0 ? 12 : m) * 100 + Number(day ?? 0);
}
function formatMonthLabel(year, month) {
  return `${MONTHS_SHORT[month]} ${year}`;
}

export { dueDateOrder as d, formatMonthLabel as f };
//# sourceMappingURL=date-BjMsJr0b.mjs.map
