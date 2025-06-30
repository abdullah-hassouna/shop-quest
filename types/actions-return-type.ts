export interface ActionReturnType<T> {
    data: T | null; 
    error: string | null;
    success: boolean;
}