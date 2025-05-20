import React, { useState } from "react";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TaskPriorityChoices } from "~/constants";

const TaskFormType = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  assigneeId: z.string().optional(),
  type: z.enum(["Story", "Task", "Bug"]),
  dueDate: z.date().optional(),
});

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: z.infer<typeof TaskFormType>) => void;
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<z.infer<typeof TaskFormType>>({
    title: "",
    description: "",
    priority: "Medium",
    assigneeId: "",
    type: "Task",
    dueDate: undefined,
  });

  const [assigneeName, setAssigneeName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const users = [
    { id: "1", name: "Alice Johnson" },
    { id: "2", name: "Bob Smith" },
    { id: "3", name: "Charlie Young" },
  ];

  const priorities = Object.entries(TaskPriorityChoices);
  const types = ["Story", "Task", "Bug"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, dueDate: date ?? undefined }));
  };
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setAssigneeName(name);
    const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase());
    setFormData((prev) => ({ ...prev, assigneeId: user?.id || "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = TaskFormType.safeParse(formData);

    if (!result.success) {
      if (result?.error?.errors[0]?.message) {
        setError(result?.error?.errors[0]?.message);
      } else {
        setError("Please check all inputs");
      }
    } else {
      setError(null);
      onCreate(result.data);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded border border-gray-600 bg-gray-800 p-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded border border-gray-600 bg-gray-800 p-2"
              rows={3}
              placeholder="Provide task description"
            />
          </div>
          <div>
            <label className="mb-1 block">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white"
            >
              {priorities.map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block">Assignee</label>
            <input
              type="search"
              list="user-options"
              placeholder="Search user..."
              value={assigneeName}
              onChange={handleAssigneeChange}
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white"
            />
            <datalist id="user-options">
              {users.map((user) => (
                <option key={user.id} value={user.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1 block">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block">Due Date</label>
            <DatePicker
              selected={formData.dueDate}
              onChange={handleDateChange}
              dateFormat="MMM d, yyyy"
              placeholderText="Select due date"
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white"
            />
          </div>
          {error && <p className="text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
