export interface ILogger {
    log: (level: string, message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    info: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
    verbose: (message: string, ...args: any[]) => void;
    http: (message: string, ...args: any[]) => void;
    silly: (message: string, ...args: any[]) => void;
}
