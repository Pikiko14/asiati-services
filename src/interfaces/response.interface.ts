export interface ResponseRequestInterface {
    success?: boolean;
    data?: any;
    message?: string;
    error?: boolean;
}

export interface PaginationInterface {
    data: any[];
    totalItems: number;
}
