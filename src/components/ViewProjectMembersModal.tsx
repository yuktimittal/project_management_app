import React from "react";
import type { UserType } from "~/types";

export default function ViewProjectMembersModal({
  isOpen,
  onClose,
  projectMembers,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectMembers: UserType[];
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <div className="flex justify-between">
          <h2 className="mb-4 text-xl font-bold">Project Members</h2>
          <button
            type="button"
            onClick={onClose}
            className="mb-4 rounded px-2 py-1 hover:bg-gray-600"
          >
            X
          </button>
        </div>
        {!projectMembers || projectMembers.length == 0 ? (
          <p>
            Please add project members using{" "}
            <span className="font-bold text-blue-600">
              + Add Project Members
            </span>
          </p>
        ) : (
          <div>
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-800 text-zinc-300">
                <tr>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {projectMembers.map((member, idx) => (
                  <tr key={idx} className="border-b border-zinc-700">
                    <td className="px-4 py-2 text-zinc-300">{idx + 1}</td>
                    <td className="px-4 py-2 text-zinc-300">{member.name}</td>
                    <td className="px-4 py-2 text-zinc-300">{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
