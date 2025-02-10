// src/services/UserService.ts
import { User } from '../entities/User.entity'; // Adjust path if needed
import AppDataSource from '../providers/AppDataSourse.provider'; // Adjust path if needed



class UserService {
    private userRepository = AppDataSource.getRepository(User); // Get User repository

    async findUsers(whereFilters: FilterObject<User>[] = []): Promise<User[]> {
        await AppDataSource.initialize(); // Ensure DataSource is initialized (if needed)

        const queryBuilder = this.userRepository.createQueryBuilder('user'); // 'user' is alias

        if (whereFilters && whereFilters.length > 0) {
            for (const filterObj of whereFilters) {
                for (const columnName in filterObj) {
                    if (filterObj.hasOwnProperty(columnName)) {
                        const filter = filterObj[columnName] as ColumnFilter<any>; // We know column name is keyof User

                        if (filter) {
                            if ((filter as EqualFilter<any>).equal !== undefined) {
                                queryBuilder.andWhere(`user.${columnName} = :${columnName}_equal`, { [`${columnName}_equal`]: (filter as EqualFilter<any>).equal });
                            } else if ((filter as NotEqualFilter<any>).notEqual !== undefined) {
                                queryBuilder.andWhere(`user.${columnName} != :${columnName}_notEqual`, { [`${columnName}_notEqual`]: (filter as NotEqualFilter<any>).notEqual });
                            } else if ((filter as GreaterThanFilter<any>).greaterThan !== undefined) {
                                queryBuilder.andWhere(`user.${columnName} > :${columnName}_greaterThan`, { [`${columnName}_greaterThan`]: (filter as GreaterThanFilter<any>).greaterThan });
                            } else if ((filter as LessThanFilter<any>).lessThan !== undefined) {
                                queryBuilder.andWhere(`user.${columnName} < :${columnName}_lessThan`, { [`${columnName}_lessThan`]: (filter as LessThanFilter<any>).lessThan });
                            } else if ((filter as BetweenRangeFilter<any>).betweenRange !== undefined) {
                                const [start, end] = (filter as BetweenRangeFilter<any>).betweenRange.sort((a, b) => a - b); // Ensure ascending order
                                queryBuilder.andWhere(`user.${columnName} BETWEEN :${columnName}_start AND :${columnName}_end`, { [`${columnName}_start`]: start, [`${columnName}_end`]: end });
                            } else if ((filter as BetweenDateFilter).betweenDate !== undefined) {
                                const [startDate, endDate] = (filter as BetweenDateFilter).betweenDate.sort((a, b) => a.getTime() - b.getTime()); // Ensure older to newer
                                queryBuilder.andWhere(`user.${columnName} BETWEEN :${columnName}_startDate AND :${columnName}_endDate`, { [`${columnName}_startDate`]: startDate, [`${columnName}_endDate`]: endDate });
                            } else if ((filter as InFilter<any>).in !== undefined) {
                                queryBuilder.andWhere(`user.${columnName} IN (:...${columnName}_in)`, { [`${columnName}_in`]: (filter as InFilter<any>).in });
                            } else if ((filter as EqualNullFilter).equalNull === true) {
                                queryBuilder.andWhere(`user.${columnName} IS NULL`);
                            } else if ((filter as EqualNotNullFilter).equalNotNull === true) {
                                queryBuilder.andWhere(`user.${columnName} IS NOT NULL`);
                            }
                        }
                    }
                }
            }
        }

        try {
            const users = await queryBuilder.getMany();
            return users;
        } finally {
            if (AppDataSource.isInitialized) {
               await AppDataSource.destroy(); // Close connection after query (important for serverless/short-lived contexts)
            }
        }
    }

    // --- Specific Filter Methods (Optional - For more granular control if needed) ---

    async findUsersBetweenDate(columnName: keyof User, startDate: Date, endDate: Date): Promise<User[]> {
        return this.findUsers([{ [columnName]: { betweenDate: [startDate, endDate] } }]);
    }

    async findUsersBetweenRange<T extends number | string | Date>(columnName: keyof User, startRange: T, endRange: T): Promise<User[]> {
        return this.findUsers([{ [columnName]: { betweenRange: [startRange, endRange] } }]);
    }

    async findUsersEqual<T extends number | string | boolean | Date>(columnName: keyof User, value: T): Promise<User[]> {
        return this.findUsers([{ [columnName]: { equal: value } }]);
    }

    async findUsersGreaterThan<T extends number | string | Date>(columnName: keyof User, value: T): Promise<User[]> {
        return this.findUsers([{ [columnName]: { greaterThan: value } }]);
    }

    async findUsersLessThan<T extends number | string | Date>(columnName: keyof User, value: T): Promise<User[]> {
        return this.findUsers([{ [columnName]: { lessThan: value } }]);
    }

    async findUsersIn<T extends number | string | boolean | Date>(columnName: keyof User, values: T[]): Promise<User[]> {
        return this.findUsers([{ [columnName]: { in: values } }]);
    }

    async findUsersEqualNull(columnName: keyof User): Promise<User[]> {
        return this.findUsers([{ [columnName]: { equalNull: true } }]);
    }

    async findUsersEqualNotNull(columnName: keyof User): Promise<User[]> {
        return this.findUsers([{ [columnName]: { equalNotNull: true } }]);
    }

    async findUsersNotEqual<T extends number | string | boolean | Date>(columnName: keyof User, value: T): Promise<User[]> {
        return this.findUsers([{ [columnName]: { notEqual: value } }]);
    }
}

export default UserService;


//usage
import UserService from './UserService'; // Adjust path

async function main() {
    const userService = new UserService();

    // Example Usage:

    // 1. Between Dates
    const usersBetweenDates = await userService.findUsers([
        { createdAt: { betweenDate: [new Date('2023-10-26'), new Date('2023-10-28')] } }
    ]);
    console.log("Users between dates:", usersBetweenDates);

    // 2. Between Range (IDs)
    const usersBetweenRange = await userService.findUsers([
        { id: { betweenRange: [2, 5] } }
    ]);
    console.log("Users between range (IDs):", usersBetweenRange);

    // 3. Equal
    const usersEqualFirstName = await userService.findUsers([
        { firstName: { equal: 'John' } }
    ]);
    console.log("Users with firstName 'John':", usersEqualFirstName);

    // 4. Greater Than
    const usersGreaterThanId = await userService.findUsers([
        { id: { greaterThan: 3 } }
    ]);
    console.log("Users with ID > 3:", usersGreaterThanId);

    // 5. Less Than
    const usersLessThanId = await userService.findUsers([
        { id: { lessThan: 5 } }
    ]);
    console.log("Users with ID < 5:", usersLessThanId);

    // 6. In
    const usersInIds = await userService.findUsers([
        { id: { in: [1, 3, 7] } }
    ]);
    console.log("Users with IDs in [1, 3, 7]:", usersInIds);

    // 7. Equal Null (e.g., find users with no email - assuming email can be null)
    // const usersEmailIsNull = await userService.findUsers([
    //     { email: { equalNull: true } } // Uncomment if email can be null
    // ]);
    // console.log("Users with null email:", usersEmailIsNull);

    // 8. Equal Not Null (e.g., find users with email)
    // const usersEmailIsNotNull = await userService.findUsers([
    //     { email: { equalNotNull: true } } // Uncomment if email can be null
    // ]);
    // console.log("Users with not null email:", usersEmailIsNotNull);

    // 9. Not Equal
    const usersNotEqualFirstName = await userService.findUsers([
        { firstName: { notEqual: 'Jane' } }
    ]);
    console.log("Users with firstName not 'Jane':", usersNotEqualFirstName);

    // 10. Multiple Filters (AND)
    const usersMultipleFilters = await userService.findUsers([
        { firstName: { equal: 'John' } },
        { lastName: { notEqual: 'Doe' } }
    ]);
    console.log("Users with firstName 'John' AND lastName not 'Doe':", usersMultipleFilters);
}

main().catch(console.error);