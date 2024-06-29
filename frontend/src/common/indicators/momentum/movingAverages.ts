import { EMAParams, SMAParams } from "./type";

export const defaultSMAParams = { window: 20 };
export const defaultEMAParams = { window: 20 };

export function calculateEMA(
  data: number[],
  params: EMAParams = defaultEMAParams
): number[][] {
  // i=0 is the most recent data
  const window = Number(params.window);
  const multiplier = params.multiplier ?? 2 / (window + 1);
  const emaValues: number[] = Array(data.length).fill(undefined);
  let ema = 0;

  for (let i = 0; i < window; i++) ema += data[i];
  ema /= window;
  emaValues[window - 1] = ema;

  for (let i = window; i < data.length; i++) {
    ema = (data[i] - ema) * multiplier + ema;
    emaValues[i] = ema;
  }
  return [emaValues];
}

export function calculateSMA(
  data: number[],
  params: SMAParams = defaultSMAParams
): number[][] {
  const smaValues: number[] = Array(data.length).fill(undefined);
  let { window } = params;
  window = Number(window);

  // Ensure the window is not larger than the dataset
  if (data.length < window) {
    throw new Error("Data length is shorter than the moving window size.");
  }

  // Calculate the SMA for each point in the dataset
  for (let i = 0; i <= data.length - window; i++) {
    let sum = 0;
    for (let j = i; j < i + window; j++) {
      sum += data[j];
    }
    const average = sum / window;
    smaValues[i + window - 1] = average; // Store the SMA value
  }

  return [smaValues];
}
