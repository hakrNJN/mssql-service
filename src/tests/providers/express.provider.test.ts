// src/tests/express.provider.test.ts
import ExpressApp from '../../providers/express.provider';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

// Mock the middleware
jest.mock('express', () => {
  const mockExpress = jest.fn(() => ({
    use: jest.fn(),
  }));
  mockExpress.json = jest.fn();
  mockExpress.urlencoded = jest.fn().mockReturnValue(jest.fn());
  return mockExpress;
});
jest.mock('helmet', () => jest.fn());
jest.mock('cors', () => jest.fn());

describe('ExpressApp', () => {
  let expressApp: ExpressApp;
  let mockApp: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    // We need to get the instance of the app created inside ExpressApp
    expressApp = new ExpressApp();
    mockApp = expressApp.app;
  });

  it('should be defined', () => {
    expect(expressApp).toBeDefined();
  });

  it('should initialize middleware', () => {
    expect(helmet).toHaveBeenCalled();
    expect(cors).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledWith(helmet());
    expect(mockApp.use).toHaveBeenCalledWith(cors());
    expect(mockApp.use).toHaveBeenCalledWith(express.json());
    expect(mockApp.use).toHaveBeenCalledWith(express.urlencoded({ extended: true }));
  });
});