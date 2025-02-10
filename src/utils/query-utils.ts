import { ObjectLiteral, SelectQueryBuilder } from "typeorm"; // Import ObjectLiteral from typeorm
import { Filter, Filters } from "../types/filter.types"; // Import your filter types

export function applyFilters<T extends ObjectLiteral>( // Add constraint 'extends ObjectLiteral' to T
    queryBuilder: SelectQueryBuilder<T>,
    filters: Filters<T> | undefined,
    entityAlias: string
): SelectQueryBuilder<T> {
    if (filters) {
        for (const columnName in filters) {
            if (filters.hasOwnProperty(columnName)) {
                const filter = filters[columnName] as Filter<any>; // We know column name is keyof T and Filter is the type

                if (filter) {
                    if ((filter as { equal: any }).equal !== undefined) {
                        queryBuilder.andWhere(`${entityAlias}.${columnName} = :${columnName}_equal`, { [`${columnName}_equal`]: (filter as { equal: any }).equal });
                    } else if ((filter as { notEqual: any }).notEqual !== undefined) {
                        queryBuilder.andWhere(`${entityAlias}.${columnName} != :${columnName}_notEqual`, { [`${columnName}_notEqual`]: (filter as { notEqual: any }).notEqual });
                    } else if ((filter as { greaterThan: any }).greaterThan !== undefined) {
                        queryBuilder.andWhere(`${entityAlias}.${columnName} > :${columnName}_greaterThan`, { [`${columnName}_greaterThan`]: (filter as { greaterThan: any }).greaterThan });
                    } else if ((filter as { lessThan: any }).lessThan !== undefined) {
                        queryBuilder.andWhere(`${entityAlias}.${columnName} < :${columnName}_lessThan`, { [`${columnName}_lessThan`]: (filter as { lessThan: any }).lessThan });
                    } else if ((filter as { betweenRange: [number, number] }).betweenRange !== undefined) {
                        const [start, end] = (filter as { betweenRange: [number, number] }).betweenRange.sort((a, b) => a - b); // Ensure ascending order
                        queryBuilder.andWhere(`${entityAlias}.${columnName} BETWEEN :${columnName}_start AND :${columnName}_end`, { [`${columnName}_start`]: start, [`${columnName}_end`]: end });
                    } else if ((filter as { betweenDate: [Date, Date] }).betweenDate !== undefined) {
                        const [startDate, endDate] = (filter as { betweenDate: [Date, Date] }).betweenDate.sort((a, b) => a.getTime() - b.getTime()); // Ensure older to newer
                        queryBuilder.andWhere(`${entityAlias}.${columnName} BETWEEN :${columnName}_startDate AND :${columnName}_endDate`, { [`${columnName}_startDate`]: startDate, [`${columnName}_endDate`]: endDate });
                    } else if ((filter as { in: any[] }).in !== undefined) {
                        queryBuilder.andWhere(`${entityAlias}.${columnName} IN (:...${columnName}_in)`, { [`${columnName}_in`]: (filter as { in: any[] }).in });
                    } else if ((filter as { equalNull: boolean }).equalNull === true) {
                        queryBuilder.andWhere(`${entityAlias}.${columnName} IS NULL`);
                    } else if ((filter as { equalNotNull: boolean }).equalNotNull === true) {
                        queryBuilder.andWhere(`${entityAlias}.${columnName} IS NOT NULL`);
                    }
                }
            }
        }
    }
    return queryBuilder;
}