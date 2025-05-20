import React, { useState } from "react";
import { dateFormatter } from "~/utils/utils";
import AddProjectMemberModal from "./AddProjectMemberModal";
import { api } from "~/utils/api";

export const ProjectDetailsBox = ({
  project,
  isLoading,
}: {
  project: any;
  isLoading: Boolean;
}) => {
  const [openAddUser, setOpenAddUser] = useState(false);

  const { mutate: addProjectMembersMutation } =
    api.project.addMembers.useMutation();

  const addProjectMembers = (userIds: string[]) => {
    const data = { projectId: project.id, userIds: userIds };
    addProjectMembersMutation(data);
  };

  return (
    <div className="mb-6 w-full rounded-2xl bg-zinc-800 p-6 text-white shadow-lg">
      {isLoading || !project ? (
        "Loading..."
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">{project.name}</h2>
              {project.description && (
                <p className="mb-2 text-zinc-300">{project.description}</p>
              )}
              <div className="flex gap-6 text-sm text-zinc-400">
                <span>
                  Start: {dateFormatter.format(new Date(project.startDate))}
                </span>
                <span>
                  End: {dateFormatter.format(new Date(project.endDate))}
                </span>
                <span>Created by: {project.createdBy.name}</span>
              </div>
            </div>

            <button
              onClick={() => setOpenAddUser(true)}
              className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-500"
            >
              + Add Project Members
            </button>
          </div>

          <AddProjectMemberModal
            isOpen={openAddUser}
            onClose={() => setOpenAddUser(false)}
            onCreate={(userIds) => addProjectMembers(userIds)}
          />
        </>
      )}
    </div>
  );
};
