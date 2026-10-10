import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { ApiResponse, CreateTaskInput, Task } from "@migration/shared";
import TaskForm from "./components/TaskForm";

const API_URL = "/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const payload = (await response.json()) as ApiResponse<Task[]>;
      setTasks(payload.data);
    } catch {
      setError("Could not connect to the API. Make sure the backend is running on port 4000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const summary = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter((task) => task.status === "done").length,
    todo: tasks.filter((task) => task.status === "todo").length
  }), [tasks]);

  async function createTask(input: CreateTaskInput): Promise<void> {
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      const payload = (await response.json()) as ApiResponse<Task>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Could not create task.");
      }
      setTasks((current) => [payload.data, ...current]);
      setNotice("Task added successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create task.");
    }
  }

  async function toggleTask(task: Task): Promise<void> {
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`${API_URL}/${task.id}/toggle`, { method: "PATCH" });
      const payload = (await response.json()) as ApiResponse<Task>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Could not update task.");
      }
      setTasks((current) => current.map((item) => item.id === payload.data.id ? payload.data : item));
      setNotice("Task status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update task.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    if (!title) {
      setError("Please enter a task title.");
      return;
    }
    void createTask({ title, description });
    form.reset();
  }

  return (
    <main className="container">
      <header className="topbar">
        <div>
          <p className="eyebrow">MIGRATION DEMO</p>
          <h1>TypeScript Task Board</h1>
          <p className="subtitle">A React client and Node.js API sharing strict TypeScript contracts.</p>
        </div>
        <span className="strict-badge">STRICT MODE ON</span>
      </header>

      <section className="stats" aria-label="Task summary">
        <div className="stat"><span>Total tasks</span><strong>{summary.total}</strong></div>
        <div className="stat"><span>To do</span><strong>{summary.todo}</strong></div>
        <div className="stat"><span>Completed</span><strong>{summary.done}</strong></div>
      </section>

      <section className="panel">
        <h2>Add a task</h2>
        <TaskForm onSubmit={handleSubmit} />
      </section>

      <section className="task-section">
        <div className="section-heading">
          <div><h2>Tasks</h2><p>Toggle a task to update its status through the API.</p></div>
          <button className="secondary-button" onClick={() => void loadTasks()} type="button">Refresh</button>
        </div>

        {error && <p className="message error" role="alert">{error}</p>}
        {notice && <p className="message success" role="status">{notice}</p>}
        {loading ? <p className="empty">Loading tasks...</p> : tasks.length === 0 ? <p className="empty">No tasks yet. Add your first task above.</p> : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className={`task-card ${task.status === "done" ? "is-done" : ""}`} key={task.id}>
                <div className="task-copy">
                  <div className="task-title-row">
                    <h3>{task.title}</h3>
                    <span className={`status ${task.status}`}>{task.status === "done" ? "Completed" : "To do"}</span>
                  </div>
                  {task.description && <p>{task.description}</p>}
                  <small>Created {new Date(task.createdAt).toLocaleString()}</small>
                </div>
                <button className="secondary-button" onClick={() => void toggleTask(task)} type="button">
                  {task.status === "done" ? "Reopen" : "Complete"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer>React + TypeScript + Express · Shared API types · Strict compiler checks</footer>
    </main>
  );
}
