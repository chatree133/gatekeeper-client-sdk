export declare class BaseError extends Error {
    code: any;
    queryString: any;
    constructor(message: string, code: string);
}
