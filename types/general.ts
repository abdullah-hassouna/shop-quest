import { GetProductDataResponse } from "./get-data-response";

export interface OrderBy {
    order: string,
    sort: 'asc' | 'desc'
}

export interface EnhancedDataTableProps<T> {
    data: T[];
    initialMaxPagesCount: number;
    tableConfig: {
        defaultPageSize: number;
        availablePageSizes: number[];
    };
}