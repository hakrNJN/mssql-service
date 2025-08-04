import "reflect-metadata";
import ExpressApp from '../../src/providers/express.provider';

// Mock the express module
jest.mock('express', () => {
  const use = jest.fn();
  const mockApp = () => ({
    use: use,
  });
  mockApp.json = jest.fn(() => 'jsonMiddleware');
  mockApp.urlencoded = jest.fn(() => 'urlencodedMiddleware');
  return mockApp;
});

describe('ExpressApp', () => {
  let expressApp: ExpressApp;
  let mockApp: any; // Use any to avoid strict type checking for the mocked app

  beforeEach(() => {
    jest.clearAllMocks();
    expressApp = new ExpressApp();
    mockApp = expressApp.app;
  });

  it('should be defined', () => {
    expect(expressApp).toBeDefined();
  });

  it('should initialize and use middleware', () => {
    // Check that the use function was called for each middleware
    expect(mockApp.use).toHaveBeenCalledTimes(4);
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function)); // helmet
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function)); // cors
    expect(mockApp.use).toHaveBeenCalledWith('jsonMiddleware');
    expect(mockApp.use).toHaveBeenCalledWith('urlencodedMiddleware');
  });
});