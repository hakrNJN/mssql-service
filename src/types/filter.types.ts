// Define types for filter objects to ensure type safety
export type EqualFilter<T> = { equal: T };
export type NotEqualFilter<T> = { notEqual: T };
export type GreaterThanFilter<T> = { greaterThan: T };
export type LessThanFilter<T> = { lessThan: T };
export type BetweenRangeFilter = { betweenRange: [Number,Number] };
export type BetweenDateFilter = { betweenDate: [Date, Date] };
export type InFilter<T> = { in: T[] };
export type EqualNullFilter = { equalNull: boolean }; // boolean to indicate null or not null
export type EqualNotNullFilter = { equalNotNull: boolean };

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
    | EqualNotNullFilter;


// Type for a single filter object in the 'where' array
export type Filters<T> = {
    [K in keyof T]?: Filter<T[K]>; // Column name as key, ColumnFilter as value
};