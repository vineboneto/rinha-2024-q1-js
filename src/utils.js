export function safeParseInt(v) {
  if (!v) return 0

  const int = parseInt(v)

  if (isNaN(int)) return 0

  return int
}
