import type { FormEventHandler } from "react";

type TaskFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export default function TaskForm({ onSubmit }: TaskFormProps) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <label>
        Task title
        <input name="title" placeholder="e.g. Type the API response" required maxLength={100} />
      </label>
      <label>
        Description
        <input name="description" placeholder="Optional details" maxLength={240} />
      </label>
      <button className="primary-button" type="submit">Add task</button>
    </form>
  );
}
