// Define types for filter objects to ensure type safety
export type EqualFilter<T> = { equal: T };
export type NotEqualFilter<T> = { notEqual: T };
export type GreaterThanFilter<T> = { greaterThan: T };
export type LessThanFilter<T> = { lessThan: T };
export type BetweenRangeFilter = { betweenRange: [number, number] }; // Corrected to number
export type BetweenDateFilter = { betweenDate: [Date, Date] };
export type InFilter<T> = { in: T[] };
export type EqualNullFilter = { equalNull: boolean }; // boolean to indicate null or not null
export type EqualNotNullFilter = { equalNotNull: boolean };
export type LikeFilter<T> = { like: string };
export type NotLikeFilter<T> = { notLike: string };
export type OrFilter<T> = { or: Filters<T>[] }; // Define OrFilter

// Union type to represent all possible filter types for a column
export type Filter<T> =
    | EqualFilter<T>
    | NotEqualFilter<T>
    | GreaterThanFilter<T>
    | LessThanFilter<T>
    | BetweenRangeFilter
    | BetweenDateFilter
    | InFilter<T>
    | EqualNullFilter
    | EqualNotNullFilter
    | LikeFilter<T> // Added LikeFilter
    | NotLikeFilter<T>; // Added NotLikeFilter


// Type for a single filter object in the 'where' array
export type Filters<T> = {
    [K in keyof T]?: Filter<T[K]>; // Column name as key, ColumnFilter as value - Corrected to T[K]
} & {
    or?: Filters<T>[]; // Or filter at the top level
};

// interface User {
//     name: string;
//     age: number;
//     city: string | null;
// }

// const complexFilters: Filters<User> = {
//     name: { like: 'J%' }, // Filter for names starting with 'J' (AND condition)
//     or: [                 // OR condition starts
//         { age: { greaterThan: 30 } }, // First OR condition: age > 30
//         { city: { equalNull: true } }  // Second OR condition: city is null
//     ]
// };
