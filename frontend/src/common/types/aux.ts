type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

// Usage: type T = IntRange<20, 300>.
export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export type Modify<T, R> = Omit<T, keyof R> & R;
