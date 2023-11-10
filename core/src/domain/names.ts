export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ");
}
