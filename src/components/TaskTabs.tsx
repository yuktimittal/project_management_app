import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TaskTabOptions } from "~/constants";
import type { TasksType } from "~/types";
import { dateFormatter } from "~/utils/utils";

export const TaskTabs = ({ tasks }: { key: any[]; tasks: any[] }) => {
  const [tasksList, setTasksList] = useState<TasksType>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [filters, setFilters] = useState({
    assigneeId: "",
    reporterId: "",
    status: "",
    type: "",
  });

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => {
      const matchTab =
        activeTab === "All" ||
        (activeTab === "To Do" && task.status === "To Do") ||
        (activeTab === "In Progress" && task.status === "In Progress") ||
        (activeTab === "Done" && task.status === "Done");
      return matchTab;
    });
    setTasksList(filteredTasks);
  }, [activeTab]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-400 text-white";
      case "high":
        return "bg-red-400 text-white";
      case "medium":
        return "bg-yellow-200 text-black";
      case "low":
        return "bg-green-400 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "to do":
        return "bg-gray-500 text-white";
      case "in progress":
        return "bg-yellow-200 text-black";
      case "done":
        return "bg-green-400 text-white";
      case "cancelled":
        return "bg-red-200 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="w-full rounded-2xl bg-zinc-900 p-6 text-white shadow-lg">
      <div className="mb-4 flex space-x-4">
        {TaskTabOptions.map((tab) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-2 ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-zinc-700 text-zinc-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Placeholder for Filters */}
      {/* <div className="mb-4 flex gap-4">
        <input
          placeholder="Filter by Assignee ID"
          className="rounded bg-zinc-800 p-2 text-white placeholder-zinc-500"
          onChange={(e) =>
            setFilters((f) => ({ ...f, assigneeId: e.target.value }))
          }
        />
        <input
          placeholder="Filter by Reporter ID"
          className="rounded bg-zinc-800 p-2 text-white placeholder-zinc-500"
          onChange={(e) =>
            setFilters((f) => ({ ...f, reporterId: e.target.value }))
          }
        />
      </div> */}

      {tasksList.length === 0 ? (
        <div className="text-center text-zinc-400">
          No tasks available in this category.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-800 text-zinc-300">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Assignee</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Reporter</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {tasksList.map((task) => (
                <tr key={task.id} className="border-b border-zinc-700">
                  <td className="max-w-[350px] truncate overflow-hidden p-2 px-4 py-2 whitespace-nowrap text-white hover:underline">
                    <Link href={`/task/${task.id}`}>{task.title}</Link>
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-zinc-300">
                    {task.assignee?.name ? task.assignee?.name : "Not Assigned"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-zinc-300">{task.type}</td>
                  <td className="px-4 py-2 text-zinc-300">
                    {task.reporter.name}
                  </td>
                  <td className="px-4 py-2 text-zinc-400">
                    {dateFormatter.format(task.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
