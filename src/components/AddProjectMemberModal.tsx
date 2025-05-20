import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "~/utils/api";
import type { UserType } from "~/types";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (users: string[]) => void;
};

export default function AddProjectMemberModal({
  isOpen,
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: users,
    isLoading: loadingUsers,
    isError: errorUsers,
  } = api.user.all.useQuery();

  const handleSelectUser = (user: UserType) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveUser = (id: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    const userIds = selectedUsers.map((u) => u.id);
    onCreate(userIds);
    setSelectedUsers([]);
    setSearchTerm("");
    onClose();
  };

  useEffect(() => {
    const userFilter = users?.filter(
      (u) =>
        u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedUsers.find((sel) => sel.id === u.id),
    );
    setFilteredUsers(userFilter || []);
  }, [searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedUsers([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Add Project Members</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <span
                key={user.id}
                className="flex items-center gap-2 rounded-full bg-blue-700 px-3 py-1 text-sm text-white"
              >
                {user.name}
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="ml-2 text-xs hover:text-red-300"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring focus:ring-blue-500 focus:outline-none"
            />

            {showDropdown && searchTerm && (
              <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border border-gray-700 bg-gray-800">
                {filteredUsers?.length > 0 ? (
                  filteredUsers?.map((user) => (
                    <li
                      key={user.id}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-700"
                      onClick={() => handleSelectUser(user)}
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
          {/* {error && <p className="text-red-400">{error}</p>} */}

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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
