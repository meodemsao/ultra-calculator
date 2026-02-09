import { describe, it, expect } from 'vitest';
import {
    magnitude,
    normalize,
    dotProduct,
    crossProduct,
    vectorAdd,
    vectorSubtract,
    scalarMultiply,
    angleBetween,
    projection,
    parseVector,
    formatVector,
    areParallel,
    arePerpendicular,
    distance,
} from './vectors';

describe('magnitude', () => {
    it('computes magnitude of 3D vector', () => {
        expect(magnitude([3, 4, 0])).toBe(5);
    });

    it('computes magnitude of 2D vector', () => {
        expect(magnitude([3, 4])).toBe(5);
    });

    it('returns 0 for zero vector', () => {
        expect(magnitude([0, 0, 0])).toBe(0);
    });
});

describe('normalize', () => {
    it('normalizes a vector to unit length', () => {
        const result = normalize([3, 4, 0]);
        expect(magnitude(result)).toBeCloseTo(1, 10);
    });

    it('throws for zero vector', () => {
        expect(() => normalize([0, 0, 0])).toThrow();
    });
});

describe('dotProduct', () => {
    it('computes dot product of two vectors', () => {
        expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(32);
    });

    it('returns 0 for perpendicular vectors', () => {
        expect(dotProduct([1, 0, 0], [0, 1, 0])).toBe(0);
    });

    it('throws for vectors of different dimensions', () => {
        expect(() => dotProduct([1, 2], [1, 2, 3])).toThrow();
    });
});

describe('crossProduct', () => {
    it('computes cross product of two 3D vectors', () => {
        const result = crossProduct([1, 0, 0], [0, 1, 0]);
        expect(result).toEqual([0, 0, 1]);
    });

    it('cross product of parallel vectors is zero', () => {
        const result = crossProduct([1, 2, 3], [2, 4, 6]);
        expect(magnitude(result)).toBeCloseTo(0, 10);
    });
});

describe('vectorAdd', () => {
    it('adds two vectors', () => {
        expect(vectorAdd([1, 2, 3], [4, 5, 6])).toEqual([5, 7, 9]);
    });

    it('throws for vectors of different dimensions', () => {
        expect(() => vectorAdd([1, 2], [1, 2, 3])).toThrow();
    });
});

describe('vectorSubtract', () => {
    it('subtracts two vectors', () => {
        expect(vectorSubtract([4, 5, 6], [1, 2, 3])).toEqual([3, 3, 3]);
    });
});

describe('scalarMultiply', () => {
    it('multiplies vector by scalar', () => {
        expect(scalarMultiply([1, 2, 3], 2)).toEqual([2, 4, 6]);
    });

    it('handles negative scalar', () => {
        expect(scalarMultiply([1, 2, 3], -1)).toEqual([-1, -2, -3]);
    });
});

describe('angleBetween', () => {
    it('returns 0 for same direction', () => {
        const angle = angleBetween([1, 0, 0], [2, 0, 0]);
        expect(angle).toBeCloseTo(0, 10);
    });

    it('returns PI/2 for perpendicular vectors', () => {
        const angle = angleBetween([1, 0, 0], [0, 1, 0]);
        expect(angle).toBeCloseTo(Math.PI / 2, 10);
    });

    it('returns PI for opposite direction', () => {
        const angle = angleBetween([1, 0, 0], [-1, 0, 0]);
        expect(angle).toBeCloseTo(Math.PI, 10);
    });
});

describe('projection', () => {
    it('projects vector onto another', () => {
        const result = projection([3, 4], [1, 0]);
        expect(result).toEqual([3, 0]);
    });
});

describe('parseVector', () => {
    it('parses comma-separated values', () => {
        expect(parseVector('1, 2, 3')).toEqual([1, 2, 3]);
    });

    it('parses with brackets', () => {
        expect(parseVector('[1, 2, 3]')).toEqual([1, 2, 3]);
    });

    it('handles spaces', () => {
        expect(parseVector('1,   2,3')).toEqual([1, 2, 3]);
    });

    it('throws for invalid format', () => {
        expect(() => parseVector('a, b, c')).toThrow();
    });
});

describe('formatVector', () => {
    it('formats vector with brackets', () => {
        expect(formatVector([1, 2, 3])).toBe('[1, 2, 3]');
    });

    it('respects precision', () => {
        const result = formatVector([1.23456789], 2);
        expect(result).toBe('[1.23]');
    });
});

describe('areParallel', () => {
    it('detects parallel vectors', () => {
        expect(areParallel([1, 2, 3], [2, 4, 6])).toBe(true);
    });

    it('detects anti-parallel vectors', () => {
        expect(areParallel([1, 2, 3], [-1, -2, -3])).toBe(true);
    });

    it('returns false for non-parallel vectors', () => {
        expect(areParallel([1, 0, 0], [0, 1, 0])).toBe(false);
    });
});

describe('arePerpendicular', () => {
    it('detects perpendicular vectors', () => {
        expect(arePerpendicular([1, 0, 0], [0, 1, 0])).toBe(true);
    });

    it('returns false for non-perpendicular vectors', () => {
        expect(arePerpendicular([1, 1, 0], [1, 0, 0])).toBe(false);
    });
});

describe('distance', () => {
    it('computes distance between two points', () => {
        expect(distance([0, 0, 0], [3, 4, 0])).toBe(5);
    });
});
