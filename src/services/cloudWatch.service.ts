// src/services/cloudWatch.service.ts

import { CloudWatchClient, PutMetricAlarmCommand, PutMetricAlarmCommandInput } from "@aws-sdk/client-cloudwatch";
import { CloudWatchLogsClient, CreateLogStreamCommand, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { AppConfig } from '../config/config'; // Adjust path if config.ts is elsewhere

class CloudWatchService {
    private logsClient: CloudWatchLogsClient; // Use logsClient for CloudWatchLogs operations
    private cloudWatchClient: CloudWatchClient; // Use cloudWatchClient for core CloudWatch operations (alarms, metrics)
    private logGroupName: string;
    private logStreamName: string;
    private sequenceToken: string | undefined;

    constructor(
        logGroupName: string,
        region: string = AppConfig.AWSCredentials.REGION!,
        accessKeyId: string = AppConfig.AWSCredentials.ACCESS_KEY_ID!,
        secretAccessKey: string = AppConfig.AWSCredentials.SECRET_ACCESS_KEY!
    ) {
        if (!logGroupName) {
            throw new Error("Log group name is required to initialize CloudWatchService.");
        }
        this.logsClient = new CloudWatchLogsClient({ // Initialize CloudWatchLogsClient
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.cloudWatchClient = new CloudWatchClient({ // Initialize CloudWatchClient for alarms
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.logGroupName = logGroupName;
        this.logStreamName = `${AppConfig.APP.NAME}-${new Date().toISOString()}-log-stream`;
        this.sequenceToken = undefined;
    }

    /**
     * Creates a log stream in the CloudWatch log group.
     */
    async createLogStream(): Promise<void> {
        try {
            const params = {
                logGroupName: this.logGroupName,
                logStreamName: this.logStreamName
            };
            const command = new CreateLogStreamCommand(params);
            await this.logsClient.send(command); // Use logsClient for log stream operations
        } catch (error) {
            console.error("Error creating log stream:", error);
            throw error;
        }
    }

    /**
     * Logs an error message to CloudWatch Logs.
     * @param {string} message - The message to log.
     */
    async logError(message: string): Promise<void> {
        try {
            if (!this.sequenceToken) {
                await this.createLogStream();
            }

            const params = {
                logEvents: [{ message, timestamp: Date.now() }],
                logGroupName: this.logGroupName,
                logStreamName: this.logStreamName,
                sequenceToken: this.sequenceToken
            };

            const command = new PutLogEventsCommand(params);
            const response = await this.logsClient.send(command); // Use logsClient for log event operations
            this.sequenceToken = response.nextSequenceToken;
        } catch (error) {
            console.error("Error logging message to CloudWatch:", error);
            throw error;
        }
    }

    /**
     * Creates a CloudWatch alarm.
     * @param {string} alarmName - The name of the alarm.
     * @param {string} metricName - The metric to monitor.
     * @param {number} threshold - The threshold value for the alarm.
     * @param {string} snsTopicArn - The ARN of the SNS topic for notifications.
     */
    async createAlarm(alarmName: string, metricName: string, threshold: number, snsTopicArn: string): Promise<void> {
        try {
            const params: PutMetricAlarmCommandInput = { // Explicitly type params
                AlarmName: alarmName,
                ComparisonOperator: "GreaterThanThreshold", // Enclose string values in quotes
                EvaluationPeriods: threshold, // Changed to use threshold as EvaluationPeriods - review logic
                MetricName: metricName,
                Namespace: AppConfig.APP.NAME, // Using AppConfig for Namespace as suggested
                Period: 60,
                Statistic: "Average", // Enclose string values in quotes
                Threshold: threshold,
                ActionsEnabled: true,
                AlarmActions: [snsTopicArn],
                AlarmDescription: `Alarm when ${metricName} exceeds ${threshold}`,
                Dimensions: [], // Keep Dimensions as an empty array if not needed
                // Add any other required or optional parameters as needed based on documentation
            };

            const command = new PutMetricAlarmCommand(params);
            const response = await this.cloudWatchClient.send(command);
            console.log("Alarm created successfully:", response);
        } catch (error) {
            console.error("Error creating CloudWatch alarm:", error);
            throw error;
        }
    }
}

export default CloudWatchService;