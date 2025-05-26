import React, { useState } from "react";
import { dateFormatter } from "~/utils/utils";
import AddProjectMemberModal from "./AddProjectMemberModal";
import { api } from "~/utils/api";
import Loader from "./Loader";
import type { ProjectType, UserType } from "~/types";
import ViewProjectMembersModal from "./ViewProjectMembersModal";
import Image from "next/image";

export const ProjectDetailsBox = ({
  project,
  isLoading,
  projectMembers,
}: {
  project: ProjectType;
  isLoading: boolean;
  projectMembers: UserType[];
}) => {
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openViewProjectMembers, setOpenViewProjectMembers] = useState(false);
  const trpc = api.useUtils();
  const { mutate: addProjectMembersMutation } =
    api.project.addMembers.useMutation({
      onSettled: async () => {
        await trpc.user.getProjectMembers.invalidate();
      },
    });

  const addProjectMembers = (userIds: string[]) => {
    const data = { projectId: project.id, userIds: userIds };
    addProjectMembersMutation(data);
  };

  return (
    <div className="mb-6 w-full rounded-2xl bg-zinc-800 p-6 text-white shadow-lg">
      {isLoading || !project ? (
        <Loader />
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
            <div>
              <button
                onClick={() => setOpenAddUser(true)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-500"
              >
                + Add Project Members
              </button>
              <button
                className="ml-2 align-middle text-sm"
                title="View Project Members"
                onClick={() => setOpenViewProjectMembers(true)}
              >
                <Image
                  className="size-7 rounded-full"
                  src="/images/contacts_icon.svg"
                  width={100}
                  height={100}
                  alt="project_members"
                />
              </button>
            </div>
          </div>

          <AddProjectMemberModal
            isOpen={openAddUser}
            onClose={() => setOpenAddUser(false)}
            onCreate={(userIds) => addProjectMembers(userIds)}
          />
          <ViewProjectMembersModal
            isOpen={openViewProjectMembers}
            onClose={() => setOpenViewProjectMembers(false)}
            projectMembers={projectMembers || []}
          />
        </>
      )}
    </div>
  );
};
