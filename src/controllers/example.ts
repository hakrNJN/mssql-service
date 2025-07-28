// // src/controllers/UserController.ts
// import { Request, Response } from 'express'; // Or your chosen framework's Request/Response types
// import UserService from '../services/UserService'; // Adjust path

// class UserController {
//     private userService: UserService;

//     constructor() {
//         this.userService = new UserService();
//     }

//     async getUsersBetweenDatesHandler(req: Request, res: Response): Promise<void> {
//         try {
//             const columnName = req.query.columnName as keyof User; // Get column from query params
//             const startDate = new Date(req.query.startDate as string);
//             const endDate = new Date(req.query.endDate as string);

//             const users = await this.userService.getUsersBetweenDates(columnName, startDate, endDate);
//             res.status(200).json(users);
//         } catch (error) {
//             console.error("Error fetching users between dates:", error);
//             res.status(500).json({ error: "Failed to fetch users" }); // Handle errors gracefully
//         }
//     }

//     async getUsersGreaterThanIdHandler(req: Request, res: Response): Promise<void> {
//         try {
//             const id = Number(req.query.id); // Get ID from query params
//             const users = await this.userService.getUsersGreaterThan('id', id);
//             res.status(200).json(users);
//         } catch (error) {
//             console.error("Error fetching users greater than ID:", error);
//             res.status(500).json({ error: "Failed to fetch users" });
//         }
//     }

//     async getUsersWithFiltersHandler(req: Request, res: Response): Promise<void> {
//         try {
//             // In a real application, you'd parse the request body or query parameters
//             // to construct the `filters` array based on user input.
//             // For simplicity, let's assume filters are passed in the request body as JSON.
//             const filters = req.body as FilterObject<User>[]; // Assuming request body is FilterObject array

//             const users = await this.userService.getUsersByMultipleFilters(filters);
//             res.status(200).json(users);
//         } catch (error) {
//             console.error("Error fetching users with filters:", error);
//             res.status(500).json({ error: "Failed to fetch users" });
//         }
//     }

//     // ... (add handlers for other service methods, mapping routes to service calls) ...
// }

// export default UserController;