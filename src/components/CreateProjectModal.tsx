import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ProjectForm = {
  name: string;
  description?: string;
  startDate: Date | null;
  endDate: Date | null;
};

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
  }) => void;
};

export default function CreateProjectModal({
  isOpen,
  onClose,
  onCreate,
}: CreateProjectModalProps) {
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    onCreate({
      name: form.name,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
    });

    setForm({ name: "", description: "", startDate: null, endDate: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block">
              Project Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              placeholder="Provide project description"
            />
          </div>

          <div>
            <label className="mb-1 block">
              Start Date<span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={form.startDate}
              onChange={(date) => setForm({ ...form, startDate: date })}
              placeholderText="Select start date"
              dateFormat="MMMM d, yyyy"
              className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block">
              End Date<span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={form.endDate}
              onChange={(date) => setForm({ ...form, endDate: date })}
              placeholderText="Select end date"
              dateFormat="MMMM d, yyyy"
              className="w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
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
