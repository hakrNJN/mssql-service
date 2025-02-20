// src/middleware/timeTracker.middleware.ts
import { NextFunction, Request, Response } from 'express';

export const timeTrackerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    (req as any).startTime = startTime; // Attach startTime to the request object (using 'any' to avoid TypeScript errors)

    // Optionally, you can also add a 'on finish' handler to calculate time when response is sent
    res.on('finish', () => {
        const endTime = Date.now();
        const timeTaken = endTime - (req as any).startTime;
        // You could log timeTaken here for each request if needed for debugging or monitoring
        // console.log(`Request to ${req.originalUrl} took ${timeTaken}ms`);
    });

    next(); // Pass control to the next middleware or route handler
};