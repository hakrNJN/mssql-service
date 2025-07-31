declare class CloudWatchService {
    private logsClient;
    private cloudWatchClient;
    private logGroupName;
    private logStreamName;
    private sequenceToken;
    constructor(logGroupName: string, region?: string, accessKeyId?: string, secretAccessKey?: string);
    /**
     * Creates a log stream in the CloudWatch log group.
     */
    createLogStream(): Promise<void>;
    /**
     * Logs an error message to CloudWatch Logs.
     * @param {string} message - The message to log.
     */
    logError(message: string): Promise<void>;
    /**
     * Creates a CloudWatch alarm.
     * @param {string} alarmName - The name of the alarm.
     * @param {string} metricName - The metric to monitor.
     * @param {number} threshold - The threshold value for the alarm.
     * @param {string} snsTopicArn - The ARN of the SNS topic for notifications.
     */
    createAlarm(alarmName: string, metricName: string, threshold: number, snsTopicArn: string): Promise<void>;
}
export default CloudWatchService;
