function priceParser(priceString) {
  if (!priceString || priceString === 'all') return null;

    const parsed = JSON.parse(priceString);
    if (Array.isArray(parsed)) {
      const [min, max] = parsed;
      return [Number(min), max === null ? Infinity : Number(max)];
    }
    if (typeof parsed === 'number') {
      return [parsed, parsed];
    }

  // formats like "0-70"
  if (priceString.includes('-')) {
    const [minStr, maxStr] = priceString.split('-');
    const min = Number(minStr);
    const max = Number(maxStr);
    if (!Number.isNaN(min) && !Number.isNaN(max)) return [min, max];
  }

  // formats like "71+"
  if (priceString.endsWith('+')) {
    const min = parseInt(priceString.slice(0, -1), 10);
    if (!Number.isNaN(min)) return [min, Infinity];
  }

  // last fallback: try numeric equality
  const num = Number(priceString);
  if (!Number.isNaN(num)) return [num, num];

  return null;
}
export default priceParser;