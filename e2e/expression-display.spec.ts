import { test, expect } from '@playwright/test';

// Helper: click a button by its accessible label text
async function clickButton(page: import('@playwright/test').Page, label: string) {
  await page.getByRole('button', { name: label, exact: true }).click();
}

// Helper: get the expression display text
async function getExpression(page: import('@playwright/test').Page) {
  return page.locator('.font-mono.text-right.text-lg').textContent();
}

// Helper: get the result display text
async function getResult(page: import('@playwright/test').Page) {
  return page.locator('.text-3xl.font-bold').textContent();
}

// Helper: switch to Scientific mode
async function switchToScientific(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Scientific' }).click();
}

test.describe('Expression Display Formatting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await switchToScientific(page);
  });

  // --- √ as prefix operator (no parentheses needed) ---

  test('√ inserts without parentheses', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '2');
    await clickButton(page, '5');

    const expr = await getExpression(page);
    expect(expr).toBe('√25');
  });

  test('√25 evaluates to 5', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '2');
    await clickButton(page, '5');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('5');
  });

  test('√ with explicit parentheses works', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '(');
    await clickButton(page, '2');
    await clickButton(page, '5');
    await clickButton(page, ')');

    const expr = await getExpression(page);
    expect(expr).toBe('√(25)');
  });

  test('√(25) evaluates to 5', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '(');
    await clickButton(page, '2');
    await clickButton(page, '5');
    await clickButton(page, ')');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('5');
  });

  test('√25+3 evaluates to 8 (root applies to next term only)', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '2');
    await clickButton(page, '5');
    await clickButton(page, '+');
    await clickButton(page, '3');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('8');
  });

  // --- ∛ as prefix operator ---

  test('∛ inserts without parentheses (via 2nd)', async ({ page }) => {
    await clickButton(page, '2nd');
    await clickButton(page, '∛');
    await clickButton(page, '8');

    const expr = await getExpression(page);
    expect(expr).toBe('∛8');
  });

  test('∛8 evaluates to 2', async ({ page }) => {
    await clickButton(page, '2nd');
    await clickButton(page, '∛');
    await clickButton(page, '8');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('2');
  });

  // --- Implicit multiplication ---

  test('2√9 inserts implicit multiplication', async ({ page }) => {
    await clickButton(page, '2');
    await clickButton(page, '√');
    await clickButton(page, '9');

    const expr = await getExpression(page);
    expect(expr).toBe('2*√9');
  });

  test('2*√9 evaluates to 6', async ({ page }) => {
    await clickButton(page, '2');
    await clickButton(page, '√');
    await clickButton(page, '9');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('6');
  });

  // --- log functions (still use parentheses) ---

  test('log10 displays as log₁₀', async ({ page }) => {
    await clickButton(page, 'log');
    await clickButton(page, '1');
    await clickButton(page, '0');
    await clickButton(page, '0');
    await clickButton(page, ')');

    const expr = await getExpression(page);
    expect(expr).toBe('log₁₀(100)');
  });

  test('log₁₀(100) evaluates to 2', async ({ page }) => {
    await clickButton(page, 'log');
    await clickButton(page, '1');
    await clickButton(page, '0');
    await clickButton(page, '0');
    await clickButton(page, ')');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('2');
  });

  test('ln displays as ln', async ({ page }) => {
    await clickButton(page, 'ln');
    await clickButton(page, '1');
    await clickButton(page, ')');

    const expr = await getExpression(page);
    expect(expr).toBe('ln(1)');
  });

  test('ln(1) evaluates to 0', async ({ page }) => {
    await clickButton(page, 'ln');
    await clickButton(page, '1');
    await clickButton(page, ')');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('0');
  });

  // --- Combined expressions ---

  test('√4+log₁₀(100) combined expression', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '4');
    await clickButton(page, '+');
    await clickButton(page, 'log');
    await clickButton(page, '1');
    await clickButton(page, '0');
    await clickButton(page, '0');
    await clickButton(page, ')');

    const expr = await getExpression(page);
    expect(expr).toBe('√4+log₁₀(100)');
  });

  test('√4+log₁₀(100) evaluates to 4', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '4');
    await clickButton(page, '+');
    await clickButton(page, 'log');
    await clickButton(page, '1');
    await clickButton(page, '0');
    await clickButton(page, '0');
    await clickButton(page, ')');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('4');
  });

  // --- Clear and backspace ---

  test('clear resets display', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '4');

    let expr = await getExpression(page);
    expect(expr).toContain('√');

    await clickButton(page, 'C');
    expr = await getExpression(page);
    expect(expr?.trim()).toBe('');
  });

  test('backspace removes characters', async ({ page }) => {
    await clickButton(page, '√');
    await clickButton(page, '4');
    await clickButton(page, '5');

    let expr = await getExpression(page);
    expect(expr).toBe('√45');

    await clickButton(page, '⌫');
    expr = await getExpression(page);
    expect(expr).toBe('√4');
  });

  // --- ⁿ√ as Casio-style infix operator ---

  test('ⁿ√ inserts as infix operator after digit', async ({ page }) => {
    await clickButton(page, '3');
    await clickButton(page, '2nd');
    await clickButton(page, 'ⁿ√');
    await clickButton(page, '2');
    await clickButton(page, '7');

    const expr = await getExpression(page);
    expect(expr).toBe('3ⁿ√27');
  });

  // --- ! as postfix operator ---

  test('! inserts as postfix after digit', async ({ page }) => {
    await clickButton(page, '5');
    await clickButton(page, 'n!');

    const expr = await getExpression(page);
    expect(expr).toBe('5!');
  });

  test('5! evaluates to 120', async ({ page }) => {
    await clickButton(page, '5');
    await clickButton(page, 'n!');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('120');
  });

  test('! works after parenthesized expression', async ({ page }) => {
    await clickButton(page, '(');
    await clickButton(page, '3');
    await clickButton(page, '+');
    await clickButton(page, '2');
    await clickButton(page, ')');
    await clickButton(page, 'n!');

    const expr = await getExpression(page);
    expect(expr).toBe('(3+2)!');
  });

  test('(3+2)! evaluates to 120', async ({ page }) => {
    await clickButton(page, '(');
    await clickButton(page, '3');
    await clickButton(page, '+');
    await clickButton(page, '2');
    await clickButton(page, ')');
    await clickButton(page, 'n!');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('120');
  });

  test('3!+4! evaluates to 30', async ({ page }) => {
    await clickButton(page, '3');
    await clickButton(page, 'n!');
    await clickButton(page, '+');
    await clickButton(page, '4');
    await clickButton(page, 'n!');
    await clickButton(page, '=');

    const result = await getResult(page);
    expect(result).toBe('30');
  });
});
