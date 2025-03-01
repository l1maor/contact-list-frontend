import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend matchers
expect.extend(matchers);

// Mock react-router-dom
vi.mock('react-router-dom');

// Cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
