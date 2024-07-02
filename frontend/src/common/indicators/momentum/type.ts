interface MAParams {
  window: number;
}

export interface EMAParams extends MAParams {
  multiplier?: number;
}
export interface SMAParams extends MAParams {}
export interface RSIParams extends MAParams {}
