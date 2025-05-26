import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TaskPriorityChoices, TaskTypeOptions } from "~/constants";
import type { UserType } from "~/types";
import { TaskFormType } from "~/types";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: z.infer<typeof TaskFormType>) => void;
  projectMembers: UserType[];
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onCreate,
  projectMembers,
}: CreateTaskModalProps) {
  const initialFormData = {
    title: "",
    description: "",
    priority: TaskPriorityChoices.MEDIUM,
    assigneeId: undefined,
    type: "Task",
    dueDate: undefined,
  };
  const [formData, setFormData] =
    useState<z.infer<typeof TaskFormType>>(initialFormData);

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const priorities = Object.entries(TaskPriorityChoices);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userFilter = projectMembers?.filter((u) =>
      u?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(userFilter || []);
  }, [searchTerm]);

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

  const handleAssigneeChange = (user: UserType) => {
    setSearchTerm(user?.name ?? "");
    setShowAssigneeDropdown(false);
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
    setFormData(initialFormData);
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

          {/* Select Assignee Input */}
          <div className="relative">
            <label className="mb-1 block">Assignee</label>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowAssigneeDropdown(true);
              }}
              onFocus={() => setShowAssigneeDropdown(true)}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring focus:ring-blue-500 focus:outline-none"
            />

            {showAssigneeDropdown && searchTerm && (
              <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border border-gray-700 bg-gray-500">
                {filteredUsers?.length > 0 ? (
                  filteredUsers?.map((user) => (
                    <li
                      key={user.id}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-700"
                      onClick={() => handleAssigneeChange(user)}
                    >
                      {user.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-400">No users found</li>
                )}
              </ul>
            )}
          </div>

          <div>
            <label className="mb-1 block">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white"
            >
              {TaskTypeOptions.map((type) => (
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
              onClick={() => {
                setFormData(initialFormData);
                onClose();
              }}
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
