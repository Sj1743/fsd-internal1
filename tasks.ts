import { Router, type Request, type Response } from "express";
import {
  isCreateTaskInput,
  type ApiResponse,
  type CreateTaskInput,
  type Task
} from "@migration/shared";

export const taskRouter = Router();

let nextId = 4;
const tasks: Task[] = [
  { id: 1, title: "Review TypeScript basics", description: "Understand interfaces and unions", status: "done", createdAt: "2026-10-01T09:00:00.000Z" },
  { id: 2, title: "Type the API response", description: "Share contracts between client and server", status: "todo", createdAt: "2026-10-02T09:00:00.000Z" },
  { id: 3, title: "Enable strict mode", description: "Fix implicit any and nullability issues", status: "todo", createdAt: "2026-10-03T09:00:00.000Z" }
];

taskRouter.get("/", (_req: Request, res: Response<ApiResponse<Task[]>>) => {
  res.json({ success: true, data: tasks });
});

taskRouter.post("/", (req: Request<unknown, unknown, unknown>, res: Response) => {
  const body: unknown = req.body;
  if (!isCreateTaskInput(body)) {
    res.status(400).json({
      success: false,
      message: "A non-empty title is required; description must be a string if provided."
    });
    return;
  }

  const input: CreateTaskInput = body;
  const task: Task = {
    id: nextId++,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    status: "todo",
    createdAt: new Date().toISOString()
  };
  tasks.unshift(task);
  const response: ApiResponse<Task> = { success: true, data: task, message: "Task created." };
  res.status(201).json(response);
});

taskRouter.patch("/:id/toggle", (req: Request<{ id: string }>, res: Response) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    res.status(404).json({ success: false, message: "Task not found." });
    return;
  }
  task.status = task.status === "done" ? "todo" : "done";
  const response: ApiResponse<Task> = { success: true, data: task, message: "Task updated." };
  res.json(response);
});
