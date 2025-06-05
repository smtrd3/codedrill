export function formatDate(date = new Date()) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  return date.toISOString().split("T")[0];
}
