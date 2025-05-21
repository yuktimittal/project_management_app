import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "~/components/Layout";
import Loader from "~/components/Loader";
import TaskMetaField from "~/components/TaskMetaField";
import { api } from "~/utils/api";
import { dateFormatter } from "~/utils/utils";
import { Comment } from "~/components/Comment";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enableSaveDescription, setEnableSaveDescription] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    "Looks good, just add tests",
    "Pending review from QA",
  ]);
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [type, setType] = useState("");
  const [project, setProject] = useState("");
  const [reporter, setReporter] = useState("");
  const [dueDate, setDueDate] = useState<Date>();

  const {
    data: task,
    isLoading: loadingTasks,
    isError: errorTasks,
  } = api.task.getTaskById.useQuery(id!, {
    enabled: !!id,
  });
  //   const trpc = api.useUtils();
  const { mutate: updateTask } = api.task.update.useMutation();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");

      setAssignee(task.assignee?.name || "");
      setPriority(task.priority);
      setType(task.type);
      setStatus(task.status);
      setLabels(task.labels);
      setReporter(task.reporter.name || "");
      setDueDate(task.dueDate || undefined);
      setProject(task.project.name);
    }
  }, [task]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, newComment.trim()]);
    setNewComment("");
  };
  const updateTaskField = (fieldName: string, value: string) => {
    console.log("change", fieldName, value);
    updateTask({ id: id, data: { [fieldName]: value } });
    if (fieldName === "description") {
      setEnableSaveDescription(false);
    }
  };

  return (
    <Layout>
      {loadingTasks ? (
        <Loader />
      ) : (
        <>
          <div className="flex min-h-screen gap-6 bg-gray-950 p-6 text-white">
            <div className="flex flex-1 flex-col gap-6 rounded-2xl bg-gray-900 p-6 shadow-xl">
              {/* Title */}
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

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">
                  Description
                </label>
                <textarea
                  className="h-48 w-full resize-none overflow-y-auto rounded-md border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                  {comments.map((comment, idx) => (
                    <Comment comment={comment} key={idx} />
                  ))}
                </div>
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
              </div>
            </div>

            <div className="w-80 space-y-5 rounded-2xl bg-gray-900 p-6 shadow-xl">
              <TaskMetaField
                label="Assignee"
                value={assignee}
                isEditable={true}
              />
              <TaskMetaField
                label="Priority"
                value={priority}
                isEditable={true}
              />
              <TaskMetaField label="Status" value={status} isEditable={true} />

              <TaskMetaField
                label="Labels"
                value={labels.join() || "None"}
                isEditable={true}
              />
              <TaskMetaField label="Type" value={type} isEditable={false} />
              <TaskMetaField
                label="Project"
                value={project}
                isEditable={false}
              />
              <TaskMetaField
                label="Reporter"
                value={reporter}
                isEditable={false}
              />
              <TaskMetaField
                label="Due Date"
                value={dueDate ? dateFormatter.format(dueDate) : "undefined"}
                isEditable={true}
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
