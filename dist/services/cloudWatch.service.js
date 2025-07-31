"use strict";
// src/services/cloudWatch.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
const client_cloudwatch_1 = require("@aws-sdk/client-cloudwatch");
const client_cloudwatch_logs_1 = require("@aws-sdk/client-cloudwatch-logs");
const config_1 = require("../config/config"); // Adjust path if config.ts is elsewhere
class CloudWatchService {
    constructor(logGroupName, region = config_1.AppConfig.AWSCredentials.REGION, accessKeyId = config_1.AppConfig.AWSCredentials.ACCESS_KEY_ID, secretAccessKey = config_1.AppConfig.AWSCredentials.SECRET_ACCESS_KEY) {
        if (!logGroupName) {
            throw new Error("Log group name is required to initialize CloudWatchService.");
        }
        this.logsClient = new client_cloudwatch_logs_1.CloudWatchLogsClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.cloudWatchClient = new client_cloudwatch_1.CloudWatchClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.logGroupName = logGroupName;
        this.logStreamName = `${config_1.AppConfig.APP.NAME}-${new Date().toISOString()}-log-stream`;
        this.sequenceToken = undefined;
    }
    /**
     * Creates a log stream in the CloudWatch log group.
     */
    async createLogStream() {
        try {
            const params = {
                logGroupName: this.logGroupName,
                logStreamName: this.logStreamName
            };
            const command = new client_cloudwatch_logs_1.CreateLogStreamCommand(params);
            await this.logsClient.send(command); // Use logsClient for log stream operations
        }
        catch (error) {
            console.error("Error creating log stream:", error);
            throw error;
        }
    }
    /**
     * Logs an error message to CloudWatch Logs.
     * @param {string} message - The message to log.
     */
    async logError(message) {
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
            const command = new client_cloudwatch_logs_1.PutLogEventsCommand(params);
            const response = await this.logsClient.send(command); // Use logsClient for log event operations
            this.sequenceToken = response.nextSequenceToken;
        }
        catch (error) {
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
    async createAlarm(alarmName, metricName, threshold, snsTopicArn) {
        try {
            const params = {
                AlarmName: alarmName,
                ComparisonOperator: "GreaterThanThreshold", // Enclose string values in quotes
                EvaluationPeriods: 1, // Set to 1 as a common default for immediate evaluation
                MetricName: metricName,
                Namespace: config_1.AppConfig.APP.NAME, // Using AppConfig for Namespace as suggested
                Period: 60,
                Statistic: "Average", // Enclose string values in quotes
                Threshold: threshold,
                ActionsEnabled: true,
                AlarmActions: [snsTopicArn],
                AlarmDescription: `Alarm when ${metricName} exceeds ${threshold}`,
                Dimensions: [], // Keep Dimensions as an empty array if not needed
                // Add any other required or optional parameters as needed based on documentation
            };
            const command = new client_cloudwatch_1.PutMetricAlarmCommand(params);
            const response = await this.cloudWatchClient.send(command);
            console.log("Alarm created successfully:", response);
        }
        catch (error) {
            console.error("Error creating CloudWatch alarm:", error);
            throw error;
        }
    }
}
exports.default = CloudWatchService;
