import { useEffect, useRef, useState } from "react";
import type { UserType } from "~/types";

interface DropdownFieldProps {
  label: string;
  users: UserType[] | undefined;
  onBlur: (val: string) => void;
}

export const UserSelectionDropdown = ({
  label,
  users,
  onBlur,
}: DropdownFieldProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [userId, setUserId] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userFilter = users?.filter((u) =>
      u?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(userFilter || []);
  }, [users, searchTerm]);

  return (
    <div className="relative">
      <label className="mb-1 block">{label}</label>
      <input
        ref={inputRef}
        type="search"
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:ring focus:ring-blue-500 focus:outline-none"
      />

      {showDropdown && searchTerm && (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border border-gray-700 bg-gray-500">
          {filteredUsers?.length > 0 ? (
            filteredUsers?.map((user) => (
              <li
                key={user.id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-700"
                onClick={() => {
                  setUserId(user.id);
                  onBlur(user.id);
                }}
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
  );
};
