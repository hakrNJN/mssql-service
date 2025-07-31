"use strict";
// // src/providers/UserProvider.ts
// import { Repository } from 'typeorm';
// import { User } from '../entities/User.entity'; // Adjust path
// import { FilterObject } from '../services/UserService'; // If you keep FilterObject type in UserService
// import AppDataSource from './AppDataSource.provider'; // Adjust path
// class UserProvider {
//     private userRepository: Repository<User>;
//     constructor() {
//         this.userRepository = AppDataSource.getRepository(User);
//     }
//     async initialize(): Promise<void> {
//         if (!AppDataSource.isInitialized) {
//             await AppDataSource.initialize();
//         }
//     }
//     async destroy(): Promise<void> {
//         if (AppDataSource.isInitialized) {
//             await AppDataSource.destroy();
//         }
//     }
//     async findUsers(whereFilters: FilterObject<User>[] = []): Promise<User[]> {
//         await this.initialize(); // Initialize connection if needed
//         const queryBuilder = this.userRepository.createQueryBuilder('user');
//         if (whereFilters && whereFilters.length > 0) {
//             // ... (Filtering logic from your original UserService.findUsers method) ...
//             for (const filterObj of whereFilters) {
//                 for (const columnName in filterObj) {
//                     if (filterObj.hasOwnProperty(columnName)) {
//                         const filter = filterObj[columnName]; // No need to cast again if FilterObject is correctly typed
//                         if (filter && typeof filter === 'object') { // Basic check for filter object
//                             if ((filter as any).equal !== undefined) {
//                                 queryBuilder.andWhere(`user.${columnName} = :${columnName}_equal`, { [`${columnName}_equal`]: (filter as any).equal });
//                             } // ... (rest of your filter conditions) ...
//                         }
//                     }
//                 }
//             }
//         }
//         try {
//             const users = await queryBuilder.getMany();
//             return users;
//         } finally {
//             await this.destroy(); // Destroy connection after query
//         }
//     }
//     // --- Basic CRUD operations (Example - add more as needed) ---
//     async getUserById(id: number): Promise<User | null> {
//         await this.initialize();
//         try {
//             return await this.userRepository.findOneBy({ id });
//         } finally {
//             await this.destroy();
//         }
//     }
//     async createUser(userData: Partial<User>): Promise<User> {
//         await this.initialize();
//         try {
//             const user = this.userRepository.create(userData);
//             return await this.userRepository.save(user);
//         } finally {
//             await this.destroy();
//         }
//     }
//     // ... (add update, delete, etc. as needed) ...
// }
// export default UserProvider;
