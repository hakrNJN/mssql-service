
import { ObjectLiteral, SelectQueryBuilder } from "typeorm"; // Import ObjectLiteral from typeorm
import { Filter, Filters, LikeFilter, NotLikeFilter } from "../types/filter.types"; // Import your filter types

export function generateWhereClauseAndParams<T extends ObjectLiteral>(
    filters: Filters<T>,
    entityAlias: string,
    existingParams: Record<string, any> = {}
): { whereClause: string; params: Record<string, any> } {
    let whereClauses: string[] = [];
    let params = { ...existingParams };

    for (const columnName in filters) {
        if (filters.hasOwnProperty(columnName)) {
            if (columnName === 'or') continue; // Skip 'or' here, it's handled separately at a higher level
            const filter = filters[columnName] as Filter<any>; // We know column name is keyof T and Filter is the type

            if (filter) {
                if ((filter as { equal: any }).equal !== undefined) {
                    const paramName = `${columnName}_equal`;
                    whereClauses.push(`${entityAlias}.${columnName} = :${paramName}`);
                    params[paramName] = (filter as { equal: any }).equal;
                } else if ((filter as { notEqual: any }).notEqual !== undefined) {
                    const paramName = `${columnName}_notEqual`;
                    whereClauses.push(`${entityAlias}.${columnName} != :${paramName}`);
                    params[paramName] = (filter as { notEqual: any }).notEqual;
                } else if ((filter as { greaterThan: any }).greaterThan !== undefined) {
                    const paramName = `${columnName}_greaterThan`;
                    whereClauses.push(`${entityAlias}.${columnName} > :${paramName}`);
                    params[paramName] = (filter as { greaterThan: any }).greaterThan;
                } else if ((filter as { lessThan: any }).lessThan !== undefined) {
                    const paramName = `${columnName}_lessThan`;
                    whereClauses.push(`${entityAlias}.${columnName} < :${paramName}`);
                    params[paramName] = (filter as { lessThan: any }).lessThan;
                } else if ((filter as { betweenRange: [number, number] }).betweenRange !== undefined) {
                    const [start, end] = (filter as { betweenRange: [number, number] }).betweenRange.sort((a, b) => a - b); // Ensure ascending order
                    const startParamName = `${columnName}_start`;
                    const endParamName = `${columnName}_end`;
                    whereClauses.push(`${entityAlias}.${columnName} BETWEEN :${startParamName} AND :${endParamName}`);
                    params[startParamName] = start;
                    params[endParamName] = end;
                } else if ((filter as { betweenDate: [Date, Date] }).betweenDate !== undefined) {
                    const [startDate, endDate] = (filter as { betweenDate: [Date, Date] }).betweenDate.sort((a, b) => a.getTime() - b.getTime()); // Ensure older to newer
                    const startDateParamName = `${columnName}_startDate`;
                    const endDateParamName = `${columnName}_endDate`;
                    whereClauses.push(`${entityAlias}.${columnName} BETWEEN :${startDateParamName} AND :${endDateParamName}`);
                    params[startDateParamName] = startDate;
                    params[endDateParamName] = endDate;
                } else if ((filter as { in: any[] }).in !== undefined) {
                    const paramName = `${columnName}_in`;
                    whereClauses.push(`${entityAlias}.${columnName} IN (:...${paramName})`);
                    // whereClauses.push(`${entityAlias}.${columnName} IN (:${paramName})`);
                    params[paramName] = (filter as { in: any[] }).in;
                } else if ((filter as { equalNull: boolean }).equalNull === true) {
                    whereClauses.push(`${entityAlias}.${columnName} IS NULL`);
                } else if ((filter as { equalNotNull: boolean }).equalNotNull === true) {
                    whereClauses.push(`${entityAlias}.${columnName} IS NOT NULL`);
                } else if ((filter as LikeFilter<any>).like !== undefined) {
                    const paramName = `${columnName}_like`;
                    whereClauses.push(`${entityAlias}.${columnName} LIKE :${paramName}`);
                    params[paramName] = (filter as LikeFilter<any>).like;
                } else if ((filter as NotLikeFilter<any>).notLike !== undefined) {
                    const paramName = `${columnName}_notLike`;
                    whereClauses.push(`${entityAlias}.${columnName} NOT LIKE :${paramName}`);
                    params[paramName] = (filter as NotLikeFilter<any>).notLike;
                }
            }
        }
    }

    return {
        whereClause: whereClauses.join(' AND '),
        params: params,
    };
}


export function applyFilters<T extends ObjectLiteral>( // Add constraint 'extends ObjectLiteral' to T
    queryBuilder: SelectQueryBuilder<T>,
    filters: Filters<T> | undefined,
    entityAlias: string
): SelectQueryBuilder<T> {
    if (filters) {
        let combinedOrWhereClause = '';
        let combinedOrParams: Record<string, any> = {};
        if (filters.or && filters.or.length > 0) {
            const orConditions: string[] = [];
            filters.or.forEach((orFilter, index) => {
                const { whereClause, params } = generateWhereClauseAndParams(orFilter, entityAlias, combinedOrParams);
                if (whereClause) {
                    orConditions.push(`(${whereClause})`);
                }
                combinedOrParams = { ...combinedOrParams, ...params };
            });
            if (orConditions.length > 0) {
                combinedOrWhereClause = orConditions.join(' OR ');
                queryBuilder.andWhere(`(${combinedOrWhereClause})`, combinedOrParams); // Wrap OR conditions in parentheses and use andWhere to combine with other AND conditions
            }
        }


        const { whereClause: andWhereClause, params: andParams } = generateWhereClauseAndParams(filters, entityAlias);

        if (andWhereClause) {
            queryBuilder.andWhere(andWhereClause, andParams);
        }


    }
    return queryBuilder;
}
// import { ObjectLiteral, SelectQueryBuilder } from "typeorm"; // Import ObjectLiteral from typeorm
// import { Filter, Filters } from "../types/filter.types"; // Import your filter types

// export function applyFilters<T extends ObjectLiteral>( // Add constraint 'extends ObjectLiteral' to T
//     queryBuilder: SelectQueryBuilder<T>,
//     filters: Filters<T> | undefined,
//     entityAlias: string
// ): SelectQueryBuilder<T> {
//     if (filters) {
//         for (const columnName in filters) {
//             if (filters.hasOwnProperty(columnName)) {
//                 const filter = filters[columnName] as Filter<any>; // We know column name is keyof T and Filter is the type

//                 if (filter) {
//                     if ((filter as { equal: any }).equal !== undefined) {
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} = :${columnName}_equal`, { [`${columnName}_equal`]: (filter as { equal: any }).equal });
//                     } else if ((filter as { notEqual: any }).notEqual !== undefined) {
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} != :${columnName}_notEqual`, { [`${columnName}_notEqual`]: (filter as { notEqual: any }).notEqual });
//                     } else if ((filter as { greaterThan: any }).greaterThan !== undefined) {
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} > :${columnName}_greaterThan`, { [`${columnName}_greaterThan`]: (filter as { greaterThan: any }).greaterThan });
//                     } else if ((filter as { lessThan: any }).lessThan !== undefined) {
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} < :${columnName}_lessThan`, { [`${columnName}_lessThan`]: (filter as { lessThan: any }).lessThan });
//                     } else if ((filter as { betweenRange: [number, number] }).betweenRange !== undefined) {
//                         const [start, end] = (filter as { betweenRange: [number, number] }).betweenRange.sort((a, b) => a - b); // Ensure ascending order
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} BETWEEN :${columnName}_start AND :${columnName}_end`, { [`${columnName}_start`]: start, [`${columnName}_end`]: end });
//                     } else if ((filter as { betweenDate: [Date, Date] }).betweenDate !== undefined) {
//                         const [startDate, endDate] = (filter as { betweenDate: [Date, Date] }).betweenDate.sort((a, b) => a.getTime() - b.getTime()); // Ensure older to newer
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} BETWEEN :${columnName}_startDate AND :${columnName}_endDate`, { [`${columnName}_startDate`]: startDate, [`${columnName}_endDate`]: endDate });
//                     } else if ((filter as { in: any[] }).in !== undefined) {
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} IN (:...${columnName}_in)`, { [`${columnName}_in`]: (filter as { in: any[] }).in });
//                     } else if ((filter as { equalNull: boolean }).equalNull === true) {
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} IS NULL`);
//                     } else if ((filter as { equalNotNull: boolean }).equalNotNull === true) {
//                         queryBuilder.andWhere(`${entityAlias}.${columnName} IS NOT NULL`);
//                     } 
//                 }
//             }
//         }
//     }
//     return queryBuilder;
// }