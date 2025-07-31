// src/tests/services/cloudwatch.test.ts

import "../setup"; // Import the setup file
import { CloudWatchClient, PutMetricAlarmCommand } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient, CreateLogStreamCommand, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import CloudWatchService from "../../services/cloudWatch.service"; // Adjust path as needed

// Mock the AppConfig before importing the service
jest.mock("../../config/config", () => ({
    AppConfig: {
        AWSCredentials: {
            REGION: "us-east-1",
            ACCESS_KEY_ID: "test-access-key",
            SECRET_ACCESS_KEY: "test-secret-key",
        },
        APP: {
            NAME: "test-app",
        },
    },
}));

const logsMock = mockClient(CloudWatchLogsClient);
const cloudWatchMock = mockClient(CloudWatchClient);

describe("CloudWatchService", () => {
    let service: CloudWatchService;
    const logGroupName = "test-log-group";

    beforeEach(() => {
        logsMock.reset();
        cloudWatchMock.reset();
        service = new CloudWatchService(logGroupName);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should throw an error if log group name is not provided", () => {
        expect(() => new CloudWatchService("")).toThrow("Log group name is required to initialize CloudWatchService.");
    });

    describe("createLogStream", () => {
        it("should create a log stream successfully", async () => {
            logsMock.on(CreateLogStreamCommand).resolves({});
            await service.createLogStream();
            expect(logsMock).toHaveReceivedCommand(CreateLogStreamCommand);
        });

        it("should handle errors when creating a log stream", async () => {
            const error = new Error("Failed to create log stream");
            logsMock.on(CreateLogStreamCommand).rejects(error);
            await expect(service.createLogStream()).rejects.toThrow(error);
        });
    });

    describe("logError", () => {
        it("should create a log stream and then log a message if no sequence token exists", async () => {
            logsMock.on(CreateLogStreamCommand).resolves({});
            logsMock.on(PutLogEventsCommand).resolves({ nextSequenceToken: "a-token" });

            await service.logError("test message");

            // Check that CreateLogStreamCommand was called first
            expect(logsMock).toHaveReceivedNthCommandWith(1, CreateLogStreamCommand, {
                logGroupName,
                logStreamName: expect.any(String) // The stream name is dynamic
            });

            // Check that PutLogEventsCommand was called second
            expect(logsMock).toHaveReceivedNthCommandWith(2, PutLogEventsCommand, {
                logGroupName,
                logStreamName: expect.any(String),
                logEvents: [{ message: "test message", timestamp: expect.any(Number) }],
                sequenceToken: undefined, // The first log event has no sequence token
            });
        });

        it("should only log a message if a sequence token already exists", async () => {
            // First call to establish the sequence token
            logsMock.on(CreateLogStreamCommand).resolves({});
            logsMock.on(PutLogEventsCommand).resolves({ nextSequenceToken: "first-token" });
            await service.logError("first message");

            // Second call
            logsMock.on(PutLogEventsCommand).resolves({ nextSequenceToken: "second-token" });
            await service.logError("second message");

            // Check that CreateLogStreamCommand was only called once for the two logError calls
            expect(logsMock).toHaveReceivedCommandTimes(CreateLogStreamCommand, 1);
            // Check that PutLogEventsCommand was called twice
            expect(logsMock).toHaveReceivedCommandTimes(PutLogEventsCommand, 2);

            // Check that the second call to PutLogEventsCommand used the correct sequence token
            expect(logsMock).toHaveReceivedNthCommandWith(3, PutLogEventsCommand, {
                sequenceToken: "first-token",
            });
        });

        it("should handle errors when logging an error message", async () => {
            const error = new Error("Failed to log message");
            logsMock.on(CreateLogStreamCommand).resolves({});
            logsMock.on(PutLogEventsCommand).rejects(error);

            await expect(service.logError("Test error message")).rejects.toThrow(error);
        });
    });

    describe("createAlarm", () => {
        it("should create a CloudWatch alarm successfully", async () => {
            cloudWatchMock.on(PutMetricAlarmCommand).resolves({});
            const alarmName = "TestAlarm";
            const metricName = "TestMetric";
            const threshold = 100;
            const snsTopicArn = "arn:aws:sns:us-east-1:123456789012:TestTopic";

            await service.createAlarm(alarmName, metricName, threshold, snsTopicArn);

            expect(cloudWatchMock).toHaveReceivedCommandWith(PutMetricAlarmCommand, {
                AlarmName: alarmName,
                MetricName: metricName,
                Threshold: threshold,
                AlarmActions: [snsTopicArn],
            });
        });

        it("should handle errors when creating a CloudWatch alarm", async () => {
            const error = new Error("Failed to create alarm");
            cloudWatchMock.on(PutMetricAlarmCommand).rejects(error);
            const alarmName = "TestAlarm";
            const metricName = "TestMetric";
            const threshold = 100;
            const snsTopicArn = "arn:aws:sns:us-east-1:123456789012:TestTopic";

            await expect(service.createAlarm(alarmName, metricName, threshold, snsTopicArn)).rejects.toThrow(error);
        });
    });
});