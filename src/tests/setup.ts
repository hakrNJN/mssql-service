// src/tests/setup.ts

import 'aws-sdk-client-mock-jest';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { WINSTON_LOGGER } from '../utils/logger'; // Adjust path if needed

// --- MANUAL TYPE OVERRIDE ---
// This block explicitly tells TypeScript that these matchers exist on the `expect` object.
// This is a robust way to solve the "Property does not exist" error when automatic
// type resolution fails.
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveReceivedCommandTimes(...args: any[]): R;
      toHaveReceivedCommandWith(...args: any[]): R;
      toHaveReceivedNthCommandWith(...args: any[]): R;
    }
  }
}
// --- END OF OVERRIDE ---


// Mock the logger for all tests
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

// Use the correct `tsyringe` syntax to register a value provider
container.register(WINSTON_LOGGER, { useValue: mockLogger } as any);
