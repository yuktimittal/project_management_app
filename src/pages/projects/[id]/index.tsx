import { useParams } from "next/navigation";
import { api } from "~/utils/api";
import { z } from "zod";
import { useState } from "react";
import { ProjectDetailsBox } from "~/components/ProjectDetailsBox";
import { TaskTabs } from "~/components/TaskTabs";
import CreateTaskModal from "~/components/CreateTaskModal";
import type { TaskFormType } from "~/types";
import Layout from "~/components/Layout";

export default function ProjectDetails() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [showTaskForm, setShowTaskForm] = useState(false);
  const trpc = api.useUtils();
  const { mutate: createTaskMutation } = api.task.create.useMutation({
    onSettled: async () => {
      await trpc.task.getTasksByProjectId.invalidate();
    },
  });

  const createTask = (task: z.infer<typeof TaskFormType>) => {
    console.log("task", task);
    createTaskMutation({ ...task, projectId: id });
  };

  const {
    data: project,
    isLoading: loadingProjects,
    isError: errorProjects,
  } = api.project.getProjectById.useQuery(id!, {
    enabled: !!id,
  });

  const { data: projectMembers } = api.user.getProjectMembers.useQuery(id!, {
    enabled: !!id,
  });

  const {
    data: tasks,
    isLoading: loadingTasks,
    isError: errorTasks,
  } = api.task.getTasksByProjectId.useQuery(id!, {
    enabled: !!id,
  });

  if (errorProjects || !project) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-8">
        Project details not found
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-950 px-6 py-8">
        <ProjectDetailsBox
          project={project}
          isLoading={loadingProjects}
          projectMembers={projectMembers || []}
        />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-bold text-white">Tasks</h2>
          <button
            onClick={() => setShowTaskForm(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Create Task
          </button>
        </div>
        {tasks && <TaskTabs key={tasks} tasks={tasks} />}

        <CreateTaskModal
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onCreate={createTask}
          projectMembers={projectMembers || []}
        />
      </div>
    </Layout>
  );
}
