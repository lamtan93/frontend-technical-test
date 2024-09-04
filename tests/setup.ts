import "@testing-library/jest-dom/vitest";
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());


//Mock IntersectionOserver for the test
class IntersectionObserverMock {
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe() {
    // No-op
  }

  unobserve() {
    // No-op
  }

  disconnect() {
    // No-op
  }
}

global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;
