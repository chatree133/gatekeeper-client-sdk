export declare class Tab {
    private window;
    private responseInterval;
    private readonly features;
    private readonly target;
    open(src: string): Promise<{
        token: string;
        result: string;
    }>;
    close(): void;
    initializeInterval(res: any, rej: any): void;
    private checkIsWindowAccessable;
    getChildWindowStringQueries(res: any, rej: any): any;
}
