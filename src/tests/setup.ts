// src/tests/setup.ts
import 'reflect-metadata';
import { container } from 'tsyringe';
import { WINSTON_LOGGER } from '../utils/logger';

// Mock the logger for all tests
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

container.register(WINSTON_LOGGER, { useValue: mockLogger } as any);
