export type EqualFilter<T> = {
    equal: T;
};
export type NotEqualFilter<T> = {
    notEqual: T;
};
export type GreaterThanFilter<T> = {
    greaterThan: T;
};
export type LessThanFilter<T> = {
    lessThan: T;
};
export type BetweenRangeFilter = {
    betweenRange: [number, number];
};
export type BetweenDateFilter = {
    betweenDate: [Date, Date];
};
export type InFilter<T> = {
    in: T[];
};
export type EqualNullFilter = {
    equalNull: boolean;
};
export type EqualNotNullFilter = {
    equalNotNull: boolean;
};
export type LikeFilter<T> = {
    like: string;
};
export type NotLikeFilter<T> = {
    notLike: string;
};
export type OrFilter<T> = {
    or: Filters<T>[];
};
export type Filter<T> = EqualFilter<T> | NotEqualFilter<T> | GreaterThanFilter<T> | LessThanFilter<T> | BetweenRangeFilter | BetweenDateFilter | InFilter<T> | EqualNullFilter | EqualNotNullFilter | LikeFilter<T> | NotLikeFilter<T>;
export type Filters<T> = {
    [K in keyof T]?: Filter<T[K]>;
} & {
    or?: Filters<T>[];
};
