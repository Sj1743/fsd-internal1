export type TaskStatus = "todo" | "done";
export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
}
export interface CreateTaskInput {
    title: string;
    description?: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
export declare function isCreateTaskInput(value: unknown): value is CreateTaskInput;
