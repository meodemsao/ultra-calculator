export interface TVMInputs {
  n?: number;     // number of periods
  rate?: number;  // interest rate per period (as decimal, e.g., 0.05 for 5%)
  pv?: number;    // present value
  pmt?: number;   // payment per period
  fv?: number;    // future value
}

export interface TVMResult {
  n: number;
  rate: number;
  pv: number;
  pmt: number;
  fv: number;
  solvedFor: string;
}

export interface AmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function solveTVM(inputs: TVMInputs, solveFor: keyof TVMInputs): TVMResult {
  const { n, rate, pv, pmt, fv } = inputs;

  switch (solveFor) {
    case 'n': {
      if (rate === undefined || pv === undefined || pmt === undefined || fv === undefined)
        throw new Error('Missing inputs');
      if (rate === 0) {
        const solved = -(pv + fv) / pmt;
        return { n: round(solved), rate, pv, pmt, fv, solvedFor: 'N' };
      }
      const num = Math.log((pmt - fv * rate) / (pmt + pv * rate));
      const den = Math.log(1 + rate);
      return { n: round(num / den), rate, pv, pmt, fv, solvedFor: 'N' };
    }

    case 'rate': {
      if (n === undefined || pv === undefined || pmt === undefined || fv === undefined)
        throw new Error('Missing inputs');
      // Newton's method to solve for rate
      let r = 0.1;
      for (let i = 0; i < 100; i++) {
        const f = tvmEquation(n, r, pv, pmt, fv);
        const df = tvmDerivative(n, r, pv, pmt);
        if (Math.abs(df) < 1e-15) break;
        const newR = r - f / df;
        if (Math.abs(newR - r) < 1e-12) { r = newR; break; }
        r = newR;
      }
      return { n, rate: round(r), pv, pmt, fv, solvedFor: 'I%' };
    }

    case 'pv': {
      if (n === undefined || rate === undefined || pmt === undefined || fv === undefined)
        throw new Error('Missing inputs');
      if (rate === 0) {
        return { n, rate, pv: round(-(pmt * n + fv)), pmt, fv, solvedFor: 'PV' };
      }
      const factor = Math.pow(1 + rate, n);
      const pvCalc = -(pmt * (factor - 1) / (rate * factor) + fv / factor);
      return { n, rate, pv: round(pvCalc), pmt, fv, solvedFor: 'PV' };
    }

    case 'pmt': {
      if (n === undefined || rate === undefined || pv === undefined || fv === undefined)
        throw new Error('Missing inputs');
      if (rate === 0) {
        return { n, rate, pv, pmt: round(-(pv + fv) / n), fv, solvedFor: 'PMT' };
      }
      const factor = Math.pow(1 + rate, n);
      const pmtCalc = -(pv * rate * factor + fv * rate) / (factor - 1);
      return { n, rate, pv, pmt: round(pmtCalc), fv, solvedFor: 'PMT' };
    }

    case 'fv': {
      if (n === undefined || rate === undefined || pv === undefined || pmt === undefined)
        throw new Error('Missing inputs');
      if (rate === 0) {
        return { n, rate, pv, pmt, fv: round(-(pv + pmt * n)), solvedFor: 'FV' };
      }
      const factor = Math.pow(1 + rate, n);
      const fvCalc = -(pv * factor + pmt * (factor - 1) / rate);
      return { n, rate, pv, pmt, fv: round(fvCalc), solvedFor: 'FV' };
    }

    default:
      throw new Error('Invalid solveFor parameter');
  }
}

function tvmEquation(n: number, r: number, pv: number, pmt: number, fv: number): number {
  if (Math.abs(r) < 1e-15) return pv + pmt * n + fv;
  const factor = Math.pow(1 + r, n);
  return pv * factor + pmt * (factor - 1) / r + fv;
}

function tvmDerivative(n: number, r: number, pv: number, pmt: number): number {
  const factor = Math.pow(1 + r, n);
  const dfactor = n * Math.pow(1 + r, n - 1);
  return pv * dfactor + pmt * ((dfactor * r - (factor - 1)) / (r * r));
}

export function compoundInterest(
  principal: number,
  annualRate: number,
  compoundsPerYear: number,
  years: number
): number {
  const amount = principal * Math.pow(1 + annualRate / compoundsPerYear, compoundsPerYear * years);
  return round(amount);
}

export function generateAmortization(
  principal: number,
  annualRate: number,
  totalPayments: number
): AmortizationRow[] {
  const monthlyRate = annualRate / 12;
  let payment: number;
  if (monthlyRate === 0) {
    payment = principal / totalPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalPayments);
    payment = principal * (monthlyRate * factor) / (factor - 1);
  }

  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let i = 1; i <= totalPayments; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = payment - interest;
    balance -= principalPaid;
    rows.push({
      period: i,
      payment: round(payment),
      principal: round(principalPaid),
      interest: round(interest),
      balance: round(Math.max(0, balance)),
    });
  }

  return rows;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
