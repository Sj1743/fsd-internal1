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

export function isCreateTaskInput(value: unknown): value is CreateTaskInput {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.title === "string"
    && candidate.title.trim().length > 0
    && (candidate.description === undefined || typeof candidate.description === "string");
}
