// Define a simpler Logger Interface
export interface ILogger {
    log: (level: string, message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) =>  void; // Allow Promise or void
    warn: (message: string, ...args: any[]) =>  void;  // Allow Promise or void
    info: (message: string, ...args: any[]) =>  void;   // Allow Promise or void
    debug: (message: string, ...args: any[]) => void;
    verbose: (message: string, ...args: any[]) => void;
    http: (message: string, ...args: any[]) => void;
    silly: (message: string, ...args: any[]) => void;
}