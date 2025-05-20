import { useParams } from "next/navigation";
import { api } from "~/utils/api";
import { z } from "zod";
import Header from "~/components/Header";
import { useEffect, useState } from "react";
import { ProjectDetailsBox } from "~/components/ProjectDetailsBox";
import { TaskTabs } from "~/components/TaskTabs";
import CreateTaskModal from "~/components/CreateTaskModal";

const TaskFormType = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  assigneeId: z.string().optional(),
  type: z.enum(["Story", "Task", "Bug"]),
  dueDate: z.date().optional(),
});

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

  // const {
  //   data: tasks,
  //   isLoading: loadingTasks,
  //   isError: errorTasks,
  // } = api.task.getTasksByProjectId.useQuery(id!, {
  //   enabled: !!id,
  // });
  const tasks = [
    {
      id: "1",
      title: "Setup Repo",
      status: "To Do",
      priority: "High",
      assignee: { name: "Alice" },
      type: "Bug",
      reporter: { name: "John" },
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Design DB",
      status: "In Progress",
      priority: "Medium",
      assignee: { name: "Bob" },
      type: "Feature",
      reporter: { name: "Jane" },
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Design DB",
      status: "In Progress",
      priority: "Low",
      assignee: { name: "Bob" },
      type: "Feature",
      reporter: { name: "Jane" },
      createdAt: new Date(),
    },
    {
      id: "4",
      title: "Design DB",
      status: "In Progress",
      priority: "Critical",
      assignee: { name: "Bob" },
      type: "Feature",
      reporter: { name: "Jane" },
      createdAt: new Date(),
    },
  ];
  if (errorProjects || !project) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-8">
        Project details not found
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-zinc-950 px-6 py-8">
        <ProjectDetailsBox project={project} isLoading={loadingProjects} />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-bold text-white">Tasks</h2>
          <button
            onClick={() => setShowTaskForm(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Create Task
          </button>
        </div>
        {tasks && <TaskTabs tasks={tasks} />}

        <CreateTaskModal
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onCreate={createTask}
        />
      </div>
    </>
  );
}
