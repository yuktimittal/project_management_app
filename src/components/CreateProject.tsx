import { useState } from "react";
import { api } from "~/utils/api";
import CreateProjectModal from "./CreateProjectModal";

export default function CreateProject() {
  const [modalOpen, setModalOpen] = useState(false);
  const trpc = api.useUtils();
  const { mutate: createProjectMutation } = api.project.create.useMutation({
    onSettled: async () => {
      await trpc.project.all.invalidate();
    },
  });
  const createProject = (project: {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
  }) => {
    createProjectMutation(project);
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-500"
      >
        Create Project
      </button>
      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createProject}
      />
    </>
  );
}
