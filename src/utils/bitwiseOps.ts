export type WordSize = 8 | 16 | 32 | 64;
export type NumberBase = 'DEC' | 'HEX' | 'OCT' | 'BIN';

export function mask(value: bigint, wordSize: WordSize): bigint {
  if (wordSize === 64) return BigInt.asUintN(64, value);
  return value & ((1n << BigInt(wordSize)) - 1n);
}

export function toSigned(value: bigint, wordSize: WordSize): bigint {
  const masked = mask(value, wordSize);
  const signBit = 1n << (BigInt(wordSize) - 1n);
  if (masked & signBit) {
    return masked - (1n << BigInt(wordSize));
  }
  return masked;
}

export function bitwiseAnd(a: bigint, b: bigint, ws: WordSize): bigint {
  return mask(a & b, ws);
}

export function bitwiseOr(a: bigint, b: bigint, ws: WordSize): bigint {
  return mask(a | b, ws);
}

export function bitwiseXor(a: bigint, b: bigint, ws: WordSize): bigint {
  return mask(a ^ b, ws);
}

export function bitwiseNot(a: bigint, ws: WordSize): bigint {
  return mask(~a, ws);
}

export function leftShift(a: bigint, n: bigint, ws: WordSize): bigint {
  return mask(a << n, ws);
}

export function rightShift(a: bigint, n: bigint, ws: WordSize): bigint {
  return mask(a >> n, ws);
}

export function parseInput(input: string): bigint {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.startsWith('0x')) return BigInt(trimmed);
  if (trimmed.startsWith('0b')) return BigInt(trimmed);
  if (trimmed.startsWith('0o')) return BigInt(trimmed);
  return BigInt(trimmed);
}

export function toBase(value: bigint, base: NumberBase, wordSize: WordSize): string {
  const masked = mask(value, wordSize);
  switch (base) {
    case 'DEC': return toSigned(masked, wordSize).toString(10);
    case 'HEX': return masked.toString(16).toUpperCase();
    case 'OCT': return masked.toString(8);
    case 'BIN': return masked.toString(2).padStart(wordSize, '0');
  }
}

export function formatBinary(value: bigint, wordSize: WordSize): string {
  const bits = mask(value, wordSize).toString(2).padStart(wordSize, '0');
  // Group by 4 bits
  const groups: string[] = [];
  for (let i = 0; i < bits.length; i += 4) {
    groups.push(bits.slice(i, i + 4));
  }
  return groups.join(' ');
}
