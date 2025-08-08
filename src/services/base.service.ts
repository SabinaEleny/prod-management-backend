import { UserDocument } from "../models/user.model";

export type BaseServiceType<T> = {
    getAll(params?: any | UserDocument): Promise<any>;
    getById(id: string): Promise<T | undefined>;
    create(data: any, user?: UserDocument): Promise<Partial<T> | T | { error: string }>;
    update(...args: any[]): Promise<T | undefined>;
    delete(id: string): Promise<T | undefined>;
};