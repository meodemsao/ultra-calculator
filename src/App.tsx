import { ThemeProvider } from './contexts/ThemeContext';
import { CalculatorProvider } from './contexts/CalculatorContext';
import { Calculator } from './components/Calculator/Calculator';

function App() {
  return (
    <ThemeProvider>
      <CalculatorProvider>
        <Calculator />
      </CalculatorProvider>
    </ThemeProvider>
  );
}

export default App;
