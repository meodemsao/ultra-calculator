export interface UserFunction {
    name: string;
    expression: string;
    variables: string[];
    createdAt: number;
}

const STORAGE_KEY = 'calculator-user-functions';

/**
 * Load user-defined functions from localStorage
 */
export function loadUserFunctions(): UserFunction[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

/**
 * Save user-defined functions to localStorage
 */
export function saveUserFunctions(functions: UserFunction[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(functions));
}

/**
 * Add a new user-defined function
 */
export function addUserFunction(
    name: string,
    expression: string,
    variables: string[]
): UserFunction[] {
    // Validate name (must be a valid identifier)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        throw new Error('Invalid function name. Use letters, numbers, and underscores only.');
    }

    // Check for reserved names
    const reserved = [
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
        'log', 'ln', 'exp', 'sqrt', 'abs', 'floor', 'ceil', 'round',
        'pi', 'e', 'i', 'true', 'false'
    ];
    if (reserved.includes(name.toLowerCase())) {
        throw new Error(`"${name}" is a reserved function name.`);
    }

    const functions = loadUserFunctions();

    // Check if function already exists
    const existingIndex = functions.findIndex(f => f.name === name);

    const newFunc: UserFunction = {
        name,
        expression,
        variables,
        createdAt: Date.now()
    };

    if (existingIndex >= 0) {
        // Update existing
        functions[existingIndex] = newFunc;
    } else {
        // Add new
        functions.push(newFunc);
    }

    saveUserFunctions(functions);
    return functions;
}

/**
 * Remove a user-defined function
 */
export function removeUserFunction(name: string): UserFunction[] {
    const functions = loadUserFunctions();
    const filtered = functions.filter(f => f.name !== name);
    saveUserFunctions(filtered);
    return filtered;
}

/**
 * Get a user-defined function by name
 */
export function getUserFunction(name: string): UserFunction | undefined {
    const functions = loadUserFunctions();
    return functions.find(f => f.name === name);
}

/**
 * Clear all user-defined functions
 */
export function clearUserFunctions(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Parse variable names from a function definition like "f(x, y)"
 */
export function parseVariables(definition: string): { name: string; variables: string[] } | null {
    const match = definition.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)$/);
    if (!match) return null;

    const name = match[1];
    const varsStr = match[2].trim();
    const variables = varsStr ? varsStr.split(',').map(v => v.trim()).filter(v => v) : [];

    return { name, variables };
}

/**
 * Format a user function for display
 */
export function formatUserFunction(func: UserFunction): string {
    if (func.variables.length === 0) {
        return `${func.name} = ${func.expression}`;
    }
    return `${func.name}(${func.variables.join(', ')}) = ${func.expression}`;
}
