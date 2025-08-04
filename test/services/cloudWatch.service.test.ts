import { CloudWatchClient, PutMetricAlarmCommand } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient, CreateLogStreamCommand, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import CloudWatchService from '../../src/services/cloudWatch.service';
import { AppConfig } from '../../src/config/config';

// Mock AWS SDK clients
jest.mock("@aws-sdk/client-cloudwatch", () => ({
  CloudWatchClient: jest.fn(() => ({
    send: jest.fn(),
  })),
  PutMetricAlarmCommand: jest.fn(),
}));

jest.mock("@aws-sdk/client-cloudwatch-logs", () => ({
  CloudWatchLogsClient: jest.fn(() => ({
    send: jest.fn(),
  })),
  CreateLogStreamCommand: jest.fn(),
  PutLogEventsCommand: jest.fn(),
}));

// Mock AppConfig
jest.mock('../../src/config/config', () => ({
  AppConfig: {
    AWSCredentials: {
      REGION: 'mock-region',
      ACCESS_KEY_ID: 'mock-access-key-id',
      SECRET_ACCESS_KEY: 'mock-secret-access-key',
    },
    APP: {
      NAME: 'mock-app-name',
    },
  },
}));

describe('CloudWatchService', () => {
  let service: CloudWatchService;
  let mockCloudWatchClientSend: jest.Mock;
  let mockCloudWatchLogsClientSend: jest.Mock;

  const mockLogGroupName = 'test-log-group';
  const mockRegion = AppConfig.AWSCredentials.REGION;
  const mockAccessKeyId = AppConfig.AWSCredentials.ACCESS_KEY_ID;
  const mockSecretAccessKey = AppConfig.AWSCredentials.SECRET_ACCESS_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CloudWatchService(mockLogGroupName, mockRegion, mockAccessKeyId, mockSecretAccessKey);
    mockCloudWatchClientSend = (CloudWatchClient as jest.Mock).mock.results[0].value.send;
    mockCloudWatchLogsClientSend = (CloudWatchLogsClient as jest.Mock).mock.results[0].value.send;
  });

  it('should initialize CloudWatchLogsClient and CloudWatchClient with correct credentials', () => {
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

  describe('createLogStream', () => {
    it('should create a log stream successfully', async () => {
      mockCloudWatchLogsClientSend.mockResolvedValue({});

      await service.createLogStream();

      expect(CreateLogStreamCommand).toHaveBeenCalledWith({
        logGroupName: mockLogGroupName,
        logStreamName: expect.stringContaining(AppConfig.APP.NAME),
      });
      expect(mockCloudWatchLogsClientSend).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if log stream creation fails', async () => {
      const mockError = new Error('Failed to create log stream');
      mockCloudWatchLogsClientSend.mockRejectedValue(mockError);

      await expect(service.createLogStream()).rejects.toThrow(mockError);
    });
  });

  describe('logError', () => {
    it('should create a log stream and log the error message', async () => {
      mockCloudWatchLogsClientSend.mockResolvedValueOnce({ nextSequenceToken: 'token123' }); // For createLogStream
      mockCloudWatchLogsClientSend.mockResolvedValueOnce({}); // For PutLogEventsCommand

      const errorMessage = 'Test error message';
      await service.logError(errorMessage);

      expect(CreateLogStreamCommand).toHaveBeenCalledTimes(1);
      expect(PutLogEventsCommand).toHaveBeenCalledWith({
        logEvents: [
          {
            message: errorMessage,
            timestamp: expect.any(Number),
          },
        ],
        logGroupName: mockLogGroupName,
        logStreamName: expect.stringContaining(AppConfig.APP.NAME),
        sequenceToken: 'token123',
      });
      expect(mockCloudWatchLogsClientSend).toHaveBeenCalledTimes(2);
    });

    it('should log the error message without creating a new stream if sequenceToken exists', async () => {
      // Simulate sequenceToken already existing
      (service as any).sequenceToken = 'existing-token';
      mockCloudWatchLogsClientSend.mockResolvedValueOnce({}); // For PutLogEventsCommand

      const errorMessage = 'Another test error';
      await service.logError(errorMessage);

      expect(CreateLogStreamCommand).not.toHaveBeenCalled();
      expect(PutLogEventsCommand).toHaveBeenCalledWith({
        logEvents: [
          {
            message: errorMessage,
            timestamp: expect.any(Number),
          },
        ],
        logGroupName: mockLogGroupName,
        logStreamName: expect.stringContaining(AppConfig.APP.NAME),
        sequenceToken: 'existing-token',
      });
      expect(mockCloudWatchLogsClientSend).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if logging fails', async () => {
      const mockError = new Error('Failed to log');
      mockCloudWatchLogsClientSend.mockRejectedValue(mockError);

      await expect(service.logError('Error')).rejects.toThrow(mockError);
    });
  });

  describe('createAlarm', () => {
    it('should create a CloudWatch alarm successfully', async () => {
      mockCloudWatchClientSend.mockResolvedValue({});

      const alarmName = 'test-alarm';
      const metricName = 'test-metric';
      const threshold = 100;
      const snsTopicArn = 'arn:aws:sns:mock-region:123456789012:test-topic';

      await service.createAlarm(alarmName, metricName, threshold, snsTopicArn);

      expect(PutMetricAlarmCommand).toHaveBeenCalledWith({
        AlarmName: alarmName,
        ComparisonOperator: "GreaterThanThreshold",
        EvaluationPeriods: 1,
        MetricName: metricName,
        Namespace: AppConfig.APP.NAME,
        Period: 60,
        Statistic: "Average",
        Threshold: threshold,
        ActionsEnabled: true,
        AlarmActions: [snsTopicArn],
        AlarmDescription: `Alarm when ${metricName} exceeds ${threshold}`,
        Dimensions: [],
      });
      expect(mockCloudWatchClientSend).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if alarm creation fails', async () => {
      const mockError = new Error('Failed to create alarm');
      mockCloudWatchClientSend.mockRejectedValue(mockError);

      await expect(service.createAlarm('alarm', 'metric', 10, 'sns-arn')).rejects.toThrow(mockError);
    });
  });
});
