import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "~/components/Layout";
import Loader from "~/components/Loader";
import TaskMetaField from "~/components/TaskMetaField";
import { api } from "~/utils/api";
import { dateFormatter } from "~/utils/utils";
import { Comment } from "~/components/Comment";
import { EditableDropdownField } from "~/components/EditableDropdownField";
import {
  TaskPriorityChoices,
  TaskStatusChoices,
  TaskTypeOptions,
} from "~/constants";
import { UserSelectionDropdown } from "~/components/UserSelectionDropdown";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enableSaveDescription, setEnableSaveDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isAssigneeEditable, setIsAssigneeEditable] = useState(false);
  const [isDueDateEditable, setDueDateEditable] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [taskFields, setTaskFields] = useState({
    assignee: "",
    priority: "",
    status: "",
    labels: [],
    type: "",
    project: "",
    reporter: "",
  });

  const {
    data: task,
    isLoading: loadingTasks,
    isError: errorTasks,
  } = api.task.getTaskById.useQuery(id!, {
    enabled: !!id,
  });

  const { data: comments } = api.comment.getCommentsByTaskId.useQuery(id!, {
    enabled: !!id,
  });

  const { data: projectMembers } = api.user.getProjectMembers.useQuery(
    task?.project.id!,
    {
      enabled: !!task?.project.id,
    },
  );

  const { mutate: updateTask } = api.task.update.useMutation({
    onSettled: async () => {
      await trpc.task.getTaskById.invalidate();
    },
  });
  const trpc = api.useUtils();
  const { mutate: createComment } = api.comment.create.useMutation({
    onSettled: async () => {
      await trpc.comment.getCommentsByTaskId.invalidate();
    },
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      if (task.dueDate) {
        const formattedDate = new Date(task.dueDate).toISOString().slice(0, 10);
        setDueDate(formattedDate);
      }
      setTaskFields({
        assignee: task.assignee?.name || "",
        priority: task.priority,
        status: task.status,
        labels: [],
        type: task.type,
        project: task.project.name,
        reporter: task.reporter.name || "",
      });
    }
  }, [task]);
  console.log("fields", taskFields);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    createComment({ taskId: id, body: newComment });
    setNewComment("");
  };
  const updateTaskField = (fieldName: string, value: string | Date) => {
    console.log("change", fieldName, value);
    if (value) updateTask({ id: id, data: { [fieldName]: value } });
    if (fieldName === "description") {
      setEnableSaveDescription(false);
    }
  };
  const handleAssigneeUpdate = (userId: string) => {
    console.log("assignee", userId);
    if (userId) updateTask({ id: id, data: { assigneeId: userId } });
    setIsAssigneeEditable(false);
  };

  return (
    <Layout>
      {loadingTasks ? (
        <Loader />
      ) : (
        <>
          <div className="flex min-h-screen gap-6 bg-gray-950 p-6 text-white">
            <div className="flex flex-1 flex-col gap-6 rounded-2xl bg-gray-900 p-6 shadow-xl">
              <input
                className="border-b border-gray-700 bg-transparent p-2 text-2xl font-semibold outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTaskField("title", title);
                  }
                }}
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Description
                </label>
                <textarea
                  className="h-80 w-full resize-none overflow-y-auto rounded-md border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Add description..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setEnableSaveDescription(true);
                  }}
                />
                {enableSaveDescription && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setDescription(task?.description || "");
                        setEnableSaveDescription(false);
                      }}
                      className="mr-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-400"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() =>
                        updateTaskField("description", description)
                      }
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="mt-auto">
                <h3 className="mb-2 text-sm font-semibold text-gray-400">
                  Comments
                </h3>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddComment();
                    }}
                  />
                  <button
                    onClick={handleAddComment}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                  >
                    Post
                  </button>
                </div>
                {comments && (
                  <div className="mt-2 space-y-2 overflow-y-auto pr-1">
                    {comments.map((comment, idx) => (
                      <Comment comment={comment} key={idx} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-80 space-y-5 rounded-2xl bg-gray-900 p-6 shadow-xl">
              {!isAssigneeEditable ? (
                <TaskMetaField
                  label="Assignee"
                  value={
                    taskFields.assignee ? taskFields.assignee : "Unassigned"
                  }
                  isEditable={true}
                  onClick={() => setIsAssigneeEditable(true)}
                />
              ) : (
                <UserSelectionDropdown
                  label="Assignee"
                  users={projectMembers}
                  onBlur={handleAssigneeUpdate}
                />
              )}
              <EditableDropdownField
                label="Priority"
                value={taskFields?.priority}
                onChange={(val) => updateTaskField("priority", val)}
                options={Object.values(TaskPriorityChoices)}
              />
              <EditableDropdownField
                label="Status"
                value={taskFields?.status}
                onChange={(val) => updateTaskField("status", val)}
                options={Object.values(TaskStatusChoices)}
              />
              {/* <EditableTextField
                label="Labels"
                value={labels.join()}
                onChange={setLabels}
              /> */}
              <EditableDropdownField
                label="Type"
                value={taskFields.type}
                onChange={(val) => updateTaskField("type", val)}
                options={TaskTypeOptions}
              />

              <TaskMetaField
                label="Project"
                value={taskFields.project}
                isEditable={false}
              />
              <TaskMetaField
                label="Reporter"
                value={taskFields.reporter}
                isEditable={false}
              />
              {!isDueDateEditable ? (
                <TaskMetaField
                  label="Due Date"
                  value={
                    task?.dueDate
                      ? dateFormatter.format(task?.dueDate)
                      : "undefined"
                  }
                  isEditable={true}
                  onClick={() => setDueDateEditable(true)}
                />
              ) : (
                <div className="flex flex-col text-sm">
                  <label className="mb-1 text-gray-400">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                    }}
                    onBlur={(e) => {
                      updateTaskField("dueDate", new Date(e.target.value));
                      setDueDateEditable(false);
                    }}
                    className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
