import { KernelRegressionParams } from "./type";

export const defaultKRParams: KernelRegressionParams = {
  bandwidth: 5,
  kernelType: "gaussian",
};

/**
 * @param x_i the observed data point, we create one distribution per data pt, so this should be static
 * @param x the gaussian x
 * @param h bandwidth
 * @returns 
 */
const gaussian = (x_i: number, x: number, h: number) => {
  const A = 1 / (h * Math.sqrt(2 * Math.PI));
  const B = -0.5 * (((x - x_i) / h) ** 2);
  const K = A * Math.exp(B);
  return K;
};

const kernels = {
  gaussian: gaussian,
};

const calculateKernelPoint = (
  x_i: number,
  data: number[],
  kernel: Function,
  h: number
) => {
  const density: number[] = data.map((_, i) => kernel(x_i, i + 1, h))
  const sumDensity = density.reduce((a, b) => a + b, 0)
  return density.map((d, i) => data[i] * (d / sumDensity)).reduce((a, b) => a + b, 0)
}

export function calculateKernelRegression(
  data: number[],
  params: KernelRegressionParams
): number[][] {
  const h: number = params.bandwidth ?? defaultKRParams.bandwidth!;
  const kernel = kernels[params.kernelType ?? defaultKRParams.kernelType as keyof typeof kernels];
  return [data.map((d, i) => calculateKernelPoint(i, data, kernel, h))];  
}
