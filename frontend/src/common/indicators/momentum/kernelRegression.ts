import { KernelRegressionParams } from "./type";

export const defaultKRParams: KernelRegressionParams = {
  bandwidth: 5,
  kernelType: "gaussian",
};

const gaussian = (x_i: number, x: number, h: number) => {
  const A = 1 / (h * Math.sqrt(2 * Math.PI));
  const B = -0.5 * ((x - x_i) / h) ** 2;
  const K = A * Math.exp(B);
  return K;
};

const kernelY = (
  x_i: number,
  data: number[],
  kernel: (x_i: number, x: number, h: number) => number,
  h: number
) => {
  return data.reduce((acc, point) => {
    const w_i = kernel(x_i, point, h);
    return acc + w_i * point;
  }, 0);
};

const kernels = {
  gaussian: gaussian,
};

export function calculateKernelRegression(
  data: number[],
  params: KernelRegressionParams
): number[][] {
  const h = params.bandwidth ?? defaultKRParams.bandwidth;
  const kernel = params.kernelType ?? defaultKRParams.kernelType;
  const result = data.map((pt) =>
    kernelY(pt, data, kernels[kernel as keyof typeof kernels], h!)
  );

  return [result];
}
