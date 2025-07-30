// src/tests/services/cloudWatch.service.test.ts
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { AppConfig } from '../../config/config';
import CloudWatchService from '../../services/cloudWatch.service';

// Mock the AWS SDK clients
const mockCloudWatchClientSend = jest.fn();
const mockCloudWatchLogsClientSend = jest.fn();

// Declare mock functions BEFORE using them in jest.mock()
const mockCreateLogStreamCommand = jest.fn();
const mockPutLogEventsCommand = jest.fn();
const mockPutMetricAlarmCommand = jest.fn();

jest.mock("@aws-sdk/client-cloudwatch", () => ({
  CloudWatchClient: jest.fn(() => ({
    send: mockCloudWatchClientSend,
  })),
  PutMetricAlarmCommand: mockPutMetricAlarmCommand,
}));

jest.mock("@aws-sdk/client-cloudwatch-logs", () => ({
  CloudWatchLogsClient: jest.fn(() => ({
    send: mockCloudWatchLogsClientSend,
  })),
  CreateLogStreamCommand: mockCreateLogStreamCommand,
  PutLogEventsCommand: mockPutLogEventsCommand,
}));

describe('CloudWatchService', () => {
  let service: CloudWatchService;
  const mockLogGroupName = 'test-log-group';
  const mockRegion = 'us-east-1';
  const mockAccessKeyId = 'test-access-key';
  const mockSecretAccessKey = 'test-secret-key';

  beforeAll(() => {
    // Set up AppConfig mocks
    Object.defineProperty(AppConfig, 'AWSCredentials', {
      value: {
        REGION: mockRegion,
        ACCESS_KEY_ID: mockAccessKeyId,
        SECRET_ACCESS_KEY: mockSecretAccessKey,
      },
      writable: true,
    });
    Object.defineProperty(AppConfig, 'APP', {
      value: { NAME: 'test-app' },
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCloudWatchClientSend.mockReset();
    mockCloudWatchLogsClientSend.mockReset();

    // Reset CloudWatch client constructors
    (CloudWatchLogsClient as jest.Mock).mockClear();
    (CloudWatchClient as jest.Mock).mockClear();

    // Reset command mocks
    mockCreateLogStreamCommand.mockClear();
    mockPutLogEventsCommand.mockClear();
    mockPutMetricAlarmCommand.mockClear();

    // Set default mock responses
    mockCloudWatchClientSend.mockResolvedValue({});
    mockCloudWatchLogsClientSend.mockResolvedValue({ nextSequenceToken: 'mock-token' });

    // Configure command mocks to return objects with input property
    mockCreateLogStreamCommand.mockImplementation((params) => ({ input: params }));
    mockPutLogEventsCommand.mockImplementation((params) => ({ input: params }));
    mockPutMetricAlarmCommand.mockImplementation((params) => ({ input: params }));

    // Create a new service instance for each test
    service = new CloudWatchService(mockLogGroupName);
  });

  it('should be defined and initialize clients', () => {
    expect(service).toBeDefined();
    expect(CloudWatchLogsClient).toHaveBeenCalledWith({
      region: mockRegion,
      credentials: {
        accessKeyId: mockAccessKeyId,
        secretAccessKey: mockSecretAccessKey,
      },
    });
    expect(CloudWatchClient).toHaveBeenCalledWith({
      region: mockRegion,
      credentials: {
        accessKeyId: mockAccessKeyId,
        secretAccessKey: mockSecretAccessKey,
      },
    });
  });

  it('should throw an error if logGroupName is not provided', () => {
    expect(() => new CloudWatchService('')).toThrow("Log group name is required to initialize CloudWatchService.");
  });

  describe('createLogStream', () => {
    it('should call CreateLogStreamCommand and send it', async () => {
      await service.createLogStream();

      expect(mockCreateLogStreamCommand).toHaveBeenCalledWith({
        logGroupName: mockLogGroupName,
        logStreamName: expect.stringContaining('test-app-')
      });
      expect(mockCloudWatchLogsClientSend).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during log stream creation', async () => {
      const mockError = new Error('Failed to create log stream');
      mockCloudWatchLogsClientSend.mockRejectedValueOnce(mockError);
      await expect(service.createLogStream()).rejects.toThrow(mockError);
    });
  });

  describe('logError', () => {
    it('should create log stream if sequenceToken is not present and then log error', async () => {
      const testMessage = 'Test error message';

      await service.logError(testMessage);

      expect(mockCloudWatchLogsClientSend).toHaveBeenCalledTimes(2);

      // Verify createLogStream call
      expect(mockCreateLogStreamCommand).toHaveBeenCalledWith({
        logGroupName: mockLogGroupName,
        logStreamName: expect.stringContaining('test-app-')
      });

      // Verify putLogEvents call
      expect(mockPutLogEventsCommand).toHaveBeenCalledWith({
        logEvents: [{
          message: testMessage,
          timestamp: expect.any(Number)
        }],
        logGroupName: mockLogGroupName,
        logStreamName: expect.stringContaining('test-app-'),
        sequenceToken: undefined
      });
    });

    it('should log error directly if sequenceToken is present', async () => {
      // Set sequence token by accessing private property
      (service as any).sequenceToken = 'initial-token';
      const testMessage = 'Another test error message';

      await service.logError(testMessage);

      expect(mockCloudWatchLogsClientSend).toHaveBeenCalledTimes(1);
      expect(mockPutLogEventsCommand).toHaveBeenCalledWith({
        logEvents: [{
          message: testMessage,
          timestamp: expect.any(Number)
        }],
        logGroupName: mockLogGroupName,
        logStreamName: expect.stringContaining('test-app-'),
        sequenceToken: 'initial-token'
      });
    });

    it('should handle errors during log error operation', async () => {
      const mockError = new Error('Failed to put log events');
      mockCloudWatchLogsClientSend.mockRejectedValueOnce(mockError);
      await expect(service.logError('Error')).rejects.toThrow(mockError);
    });
  });

  describe('createAlarm', () => {
    it('should call PutMetricAlarmCommand with correct parameters', async () => {
      const alarmName = 'TestAlarm';
      const metricName = 'TestMetric';
      const threshold = 5;
      const snsTopicArn = 'arn:aws:sns:us-east-1:123456789012:test-topic';

      await service.createAlarm(alarmName, metricName, threshold, snsTopicArn);

      expect(mockPutMetricAlarmCommand).toHaveBeenCalledWith({
        AlarmName: alarmName,
        ComparisonOperator: "GreaterThanThreshold",
        EvaluationPeriods: 1,
        MetricName: metricName,
        Namespace: 'test-app',
        Period: 60,
        Statistic: "Average",
        Threshold: threshold,
        ActionsEnabled: true,
        AlarmActions: [snsTopicArn],
        AlarmDescription: `Alarm when ${metricName} exceeds ${threshold}`,
        Dimensions: []
      });

      expect(mockCloudWatchClientSend).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during alarm creation', async () => {
      const mockError = new Error('Failed to create alarm');
      mockCloudWatchClientSend.mockRejectedValueOnce(mockError);
      await expect(service.createAlarm('Alarm', 'Metric', 1, 'sns-arn')).rejects.toThrow(mockError);
    });
  });
});
