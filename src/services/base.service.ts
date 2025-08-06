export type BaseServiceType<T> = {
    getAll(query?: any): Promise<any>;
    getById(id: string): Promise<T | undefined>;
    create(data: any): Promise<Partial<T> | T | { error: string }>;
    update(id: string, data: any): Promise<T | undefined>;
    delete(id: string): Promise<T | undefined>;
};