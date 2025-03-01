import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

// Custom renderer that includes providers
function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return rtlRender(
    <BrowserRouter>
      <PrimeReactProvider>
        {ui}
      </PrimeReactProvider>
    </BrowserRouter>
  );
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
