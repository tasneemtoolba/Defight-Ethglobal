export function truncateMiddle(s: string, left = 6, right = 4): string {
  if (s.length <= left + right + 2) return s;
  return `${s.slice(0, left)}…${s.slice(-right)}`;
}

export function explorerTxUrl(txHash: string): string {
  return `https://explorer.0g.ai/mainnet/tx/${txHash}`;
}
