import { useEffect, useState } from "react";

interface DropdownFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

export const EditableDropdownField = ({
  label,
  value,
  onChange,
  options,
}: DropdownFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [draft, setDraft] = useState(value);
  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleBlur = () => {
    if (draft !== value) onChange(draft);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <label className="text-sm text-gray-400 dark:text-gray-500">
        {label}
      </label>
      {isEditing ? (
        <select
          className="mt-1 w-full border-b border-gray-600 bg-transparent text-white focus:border-blue-400 focus:outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        >
          {options.map((opt) => (
            <option
              key={opt}
              value={opt}
              className="bg-black text-white dark:bg-gray-900 dark:text-white"
            >
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <div
          className="mt-1 cursor-pointer rounded py-1 text-white transition hover:bg-gray-700"
          onClick={() => setIsEditing(true)}
        >
          {value || (
            <span className="text-gray-500 italic">Click to select</span>
          )}
        </div>
      )}
    </div>
  );
};
