// // src/services/UserService.ts
// import { User } from '../entities/User.entity'; // Adjust path
// import UserProvider from '../providers/UserProvider'; // Adjust path

// // Re-define Filter Types (or move them to a separate types/ folder for reuse)
// type EqualFilter<T> = { equal: T };
// type NotEqualFilter<T> = { notEqual: T };
// type GreaterThanFilter<T> = { greaterThan: T };
// type LessThanFilter<T> = { lessThan: T };
// type BetweenRangeFilter<T> = { betweenRange: [T, T] };
// type BetweenDateFilter = { betweenDate: [Date, Date] };
// type InFilter<T> = { in: T[] };
// type EqualNullFilter = { equalNull: boolean };
// type EqualNotNullFilter = { equalNotNull: boolean };

// export type ColumnFilter<T> = // Exported type
//     | EqualFilter<T>
//     | NotEqualFilter<T>
//     | GreaterThanFilter<T>
//     | LessThanFilter<T>
//     | BetweenRangeFilter<T>
//     | BetweenDateFilter
//     | InFilter<T>
//     | EqualNullFilter
//     | EqualNotNullFilter;

// export type FilterObject<User> = { // Exported type
//     [K in keyof User]?: ColumnFilter<User[K]>;
// };


// class UserService {
//     private userProvider: UserProvider;

//     constructor() {
//         this.userProvider = new UserProvider(); // Inject UserProvider
//     }

//     async getUsersBetweenDates(columnName: keyof User, startDate: Date, endDate: Date): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { betweenDate: [startDate, endDate] } }]);
//     }

//     async getUsersBetweenRange<T extends number | string | Date>(columnName: keyof User, startRange: T, endRange: T): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { betweenRange: [startRange, endRange] } }]);
//     }

//     async getUsersEqual<T extends number | string | boolean | Date>(columnName: keyof User, value: T): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { equal: value } }]);
//     }

//     async getUsersGreaterThan<T extends number | string | Date>(columnName: keyof User, value: T): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { greaterThan: value } }]);
//     }

//     async getUsersLessThan<T extends number | string | Date>(columnName: keyof User, value: T): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { lessThan: value } }]);
//     }

//     async getUsersIn<T extends number | string | boolean | Date>(columnName: keyof User, values: T[]): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { in: values } }]);
//     }

//     async getUsersEqualNull(columnName: keyof User): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { equalNull: true } }]);
//     }

//     async getUsersEqualNotNull(columnName: keyof User): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { equalNotNull: true } }]);
//     }

//     async getUsersNotEqual<T extends number | string | boolean | Date>(columnName: keyof User, value: T): Promise<User[]> {
//         return this.userProvider.findUsers([{ [columnName]: { notEqual: value } }]);
//     }

//     async getUsersByMultipleFilters(filters: FilterObject<User>[]): Promise<User[]> {
//         return this.userProvider.findUsers(filters); // Directly pass filters to provider
//     }

//     async getUserById(id: number): Promise<User | null> {
//         return this.userProvider.getUserById(id); // Delegate to provider
//     }

//     // ... (add other business logic methods as needed, using userProvider) ...
// }

// export default UserService;