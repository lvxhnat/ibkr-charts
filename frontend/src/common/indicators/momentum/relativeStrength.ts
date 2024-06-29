import { RSIParams } from "./type";

export const defaultRSIParams = { window: 14 };
export function calculateRSI(
  closingPrices: number[],
  params: RSIParams = defaultRSIParams
): number[][] {
  const rsi: number[] = new Array(closingPrices.length).fill(null);
  const window = params.window;
  let gains = 0;
  let losses = 0;
  let avgGain = 0;
  let avgLoss = 0;

  // Calculate initial average gains and losses from the first 'window' days
  for (let i = 1; i < window; i++) {
    const change = closingPrices[i] - closingPrices[i - 1];
    if (change > 0) gains += change;
    else if (change < 0) losses -= change;
  }

  // Initialize averages
  avgGain = gains / (window - 1);
  avgLoss = losses / (window - 1);

  // Ensure RSI starts being calculated from the correct point
  for (let i = window; i < closingPrices.length; i++) {
    const change = closingPrices[i] - closingPrices[i - 1];
    let gain = 0;
    let loss = 0;

    if (change > 0) gain = change;
    else if (change < 0) loss = -change;

    // Calculate smoothed averages
    avgGain = (avgGain * (window - 1) + gain) / window;
    avgLoss = (avgLoss * (window - 1) + loss) / window;

    if (avgLoss !== 0) {
      const rs = avgGain / avgLoss;
      rsi[i] = 100 - 100 / (1 + rs);
    } else {
      rsi[i] = 100; // If avgLoss is 0, RSI becomes 100 because price gains are unopposed.
    }
  }

  return [rsi];
}
