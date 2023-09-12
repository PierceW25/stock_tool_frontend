export function formatLargeNumber(num: number): string {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixIndex = Math.floor(Math.log10(Math.abs(num)) / 3);
  const roundedValue = num / Math.pow(10, suffixIndex * 3);
  const formattedValue = roundedValue.toFixed(2);

  return `${formattedValue}${suffixes[suffixIndex]}`;
}