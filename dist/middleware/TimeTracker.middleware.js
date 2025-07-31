"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeTrackerMiddleware = void 0;
const timeTrackerMiddleware = (req, res, next) => {
    const startTime = Date.now();
    req.startTime = startTime; // Attach startTime to the request object (using 'any' to avoid TypeScript errors)
    // Optionally, you can also add a 'on finish' handler to calculate time when response is sent
    res.on('finish', () => {
        const endTime = Date.now();
        const timeTaken = endTime - req.startTime;
        // You could log timeTaken here for each request if needed for debugging or monitoring
        // console.log(`Request to ${req.originalUrl} took ${timeTaken}ms`);
    });
    next(); // Pass control to the next middleware or route handler
};
exports.timeTrackerMiddleware = timeTrackerMiddleware;
