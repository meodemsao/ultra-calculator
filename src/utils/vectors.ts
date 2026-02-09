export type Vector2D = [number, number];
export type Vector3D = [number, number, number];
export type VectorND = number[];

/**
 * Compute the magnitude (length) of a vector
 */
export function magnitude(v: VectorND): number {
    return Math.sqrt(v.reduce((sum, component) => sum + component * component, 0));
}

/**
 * Normalize a vector to unit length
 */
export function normalize(v: VectorND): VectorND {
    const mag = magnitude(v);
    if (mag === 0) {
        throw new Error('Cannot normalize zero vector');
    }
    return v.map(component => component / mag);
}

/**
 * Compute the dot product of two vectors
 */
export function dotProduct(a: VectorND, b: VectorND): number {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same dimension');
    }
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Compute the cross product of two 3D vectors
 * Returns a vector perpendicular to both input vectors
 */
export function crossProduct(a: Vector3D, b: Vector3D): Vector3D {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}

/**
 * Vector addition
 */
export function vectorAdd(a: VectorND, b: VectorND): VectorND {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same dimension');
    }
    return a.map((val, i) => val + b[i]);
}

/**
 * Vector subtraction
 */
export function vectorSubtract(a: VectorND, b: VectorND): VectorND {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same dimension');
    }
    return a.map((val, i) => val - b[i]);
}

/**
 * Scalar multiplication
 */
export function scalarMultiply(v: VectorND, scalar: number): VectorND {
    return v.map(component => component * scalar);
}

/**
 * Compute the angle between two vectors in radians
 */
export function angleBetween(a: VectorND, b: VectorND): number {
    const dot = dotProduct(a, b);
    const magA = magnitude(a);
    const magB = magnitude(b);

    if (magA === 0 || magB === 0) {
        throw new Error('Cannot compute angle with zero vector');
    }

    // Clamp to [-1, 1] to handle floating point errors
    const cosAngle = Math.max(-1, Math.min(1, dot / (magA * magB)));
    return Math.acos(cosAngle);
}

/**
 * Compute the projection of vector a onto vector b
 */
export function projection(a: VectorND, b: VectorND): VectorND {
    const dot = dotProduct(a, b);
    const magBSquared = dotProduct(b, b);

    if (magBSquared === 0) {
        throw new Error('Cannot project onto zero vector');
    }

    const scalar = dot / magBSquared;
    return scalarMultiply(b, scalar);
}

/**
 * Compute the scalar projection (component) of a onto b
 */
export function scalarProjection(a: VectorND, b: VectorND): number {
    const magB = magnitude(b);
    if (magB === 0) {
        throw new Error('Cannot project onto zero vector');
    }
    return dotProduct(a, b) / magB;
}

/**
 * Check if two vectors are parallel
 */
export function areParallel(a: VectorND, b: VectorND, tolerance: number = 1e-10): boolean {
    const angle = angleBetween(a, b);
    return Math.abs(angle) < tolerance || Math.abs(angle - Math.PI) < tolerance;
}

/**
 * Check if two vectors are perpendicular
 */
export function arePerpendicular(a: VectorND, b: VectorND, tolerance: number = 1e-10): boolean {
    const dot = dotProduct(a, b);
    return Math.abs(dot) < tolerance;
}

/**
 * Compute the distance between two points (as vectors)
 */
export function distance(a: VectorND, b: VectorND): number {
    return magnitude(vectorSubtract(a, b));
}

/**
 * Parse a vector string like "[1, 2, 3]" or "1, 2, 3" into an array
 */
export function parseVector(str: string): VectorND {
    // Remove brackets if present
    const cleaned = str.replace(/[\[\]\(\)]/g, '').trim();
    const parts = cleaned.split(/[,\s]+/).filter(s => s.length > 0);
    const numbers = parts.map(s => parseFloat(s.trim()));

    if (numbers.some(n => isNaN(n))) {
        throw new Error('Invalid vector format');
    }

    return numbers;
}

/**
 * Format a vector for display
 */
export function formatVector(v: VectorND, precision: number = 4): string {
    const formatted = v.map(n => {
        const rounded = Math.round(n * Math.pow(10, precision)) / Math.pow(10, precision);
        return rounded.toString();
    });
    return `[${formatted.join(', ')}]`;
}
