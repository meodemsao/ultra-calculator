import { describe, it, expect } from 'vitest';
import {
  mask,
  toSigned,
  bitwiseAnd,
  bitwiseOr,
  bitwiseXor,
  bitwiseNot,
  leftShift,
  rightShift,
  parseInput,
  toBase,
  formatBinary,
} from './bitwiseOps';

describe('mask', () => {
  it('masks to 8 bits', () => {
    expect(mask(0xFFn, 8)).toBe(255n);
    expect(mask(0x100n, 8)).toBe(0n);
  });

  it('masks to 16 bits', () => {
    expect(mask(0xFFFFn, 16)).toBe(65535n);
    expect(mask(0x10000n, 16)).toBe(0n);
  });

  it('masks to 32 bits', () => {
    expect(mask(0xFFFFFFFFn, 32)).toBe(4294967295n);
  });
});

describe('toSigned', () => {
  it('converts unsigned 8-bit to signed', () => {
    expect(toSigned(255n, 8)).toBe(-1n);
    expect(toSigned(128n, 8)).toBe(-128n);
    expect(toSigned(127n, 8)).toBe(127n);
  });

  it('converts unsigned 16-bit to signed', () => {
    expect(toSigned(0xFFFFn, 16)).toBe(-1n);
  });
});

describe('bitwise operations', () => {
  it('AND', () => {
    expect(bitwiseAnd(0b1100n, 0b1010n, 8)).toBe(0b1000n);
  });

  it('OR', () => {
    expect(bitwiseOr(0b1100n, 0b1010n, 8)).toBe(0b1110n);
  });

  it('XOR', () => {
    expect(bitwiseXor(0b1100n, 0b1010n, 8)).toBe(0b0110n);
  });

  it('NOT 8-bit', () => {
    expect(bitwiseNot(0n, 8)).toBe(255n);
    expect(bitwiseNot(0xFFn, 8)).toBe(0n);
  });

  it('left shift', () => {
    expect(leftShift(1n, 3n, 8)).toBe(8n);
    expect(leftShift(128n, 1n, 8)).toBe(0n); // overflow
  });

  it('right shift', () => {
    expect(rightShift(8n, 2n, 8)).toBe(2n);
  });
});

describe('parseInput', () => {
  it('parses decimal', () => {
    expect(parseInput('42')).toBe(42n);
  });

  it('parses hex', () => {
    expect(parseInput('0xFF')).toBe(255n);
  });

  it('parses binary', () => {
    expect(parseInput('0b1010')).toBe(10n);
  });

  it('parses octal', () => {
    expect(parseInput('0o77')).toBe(63n);
  });
});

describe('toBase', () => {
  it('converts to hex', () => {
    expect(toBase(255n, 'HEX', 8)).toBe('FF');
  });

  it('converts to binary', () => {
    expect(toBase(10n, 'BIN', 8)).toBe('00001010');
  });

  it('converts to octal', () => {
    expect(toBase(63n, 'OCT', 8)).toBe('77');
  });

  it('converts to decimal (signed)', () => {
    expect(toBase(255n, 'DEC', 8)).toBe('-1');
    expect(toBase(127n, 'DEC', 8)).toBe('127');
  });
});

describe('formatBinary', () => {
  it('formats 8-bit with groups of 4', () => {
    expect(formatBinary(0xABn, 8)).toBe('1010 1011');
  });

  it('formats 16-bit', () => {
    expect(formatBinary(0n, 16)).toBe('0000 0000 0000 0000');
  });
});
