const durationPattern = /^(\d+)([smhd])$/;

const durationMap = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
} as const;

export const durationToMilliseconds = (value: string): number => {
  const match = durationPattern.exec(value);

  if (!match) {
    throw new Error(`Unsupported duration format: ${value}`);
  }

  const [, amount, unit] = match;
  return Number(amount) * durationMap[unit as keyof typeof durationMap];
};
