import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type TaskForm = {
  title: string;
  description?: string;
};

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: { title: string; description?: string }) => void;
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Please fill in all required fields");
      return;
    }

    onCreate({
      title: form.title,
      description: form.description,
    });

    setForm({ title: "", description: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded border border-gray-600 bg-gray-800 p-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded border border-gray-600 bg-gray-800 p-2"
              rows={3}
              placeholder="Provide task description"
            />
          </div>

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
