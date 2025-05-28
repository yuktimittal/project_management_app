import type { ProjectsListType } from "~/types";
import { dateFormatter } from "~/utils/utils";
import Link from "next/link";

type ProjectProps = {
  project: ProjectsListType[number];
};

export default function ProjectCard({ project }: ProjectProps) {
  const { name, startDate, endDate, createdBy } = project;
  const currentDate = new Date();

  const status =
    startDate > currentDate
      ? "upcoming"
      : startDate <= currentDate && endDate >= currentDate
        ? "active"
        : "completed";

  return (
    <div className="flex items-center gap-x-10 overflow-x-auto rounded-xl border border-gray-700 bg-gray-800 p-4 shadow transition hover:bg-gray-700">
      <div className="min-w-[400px]">
        <h2 className="max-w-[300px] truncate text-lg font-semibold text-white">
          {name}
        </h2>
        <p className="text-sm text-gray-400">Created by: {createdBy.name}</p>
      </div>
      <div className="min-w-[350px] text-sm text-gray-300">
        <p>
          {dateFormatter.format(new Date(startDate))} →{" "}
          {dateFormatter.format(new Date(endDate))}
        </p>
      </div>

      <div className="min-w-[200px] text-sm text-gray-300">
        <p>
          Active tasks: <span className="">{project.activeTasks}</span>
        </p>
        {project.overDueTasks && project.overDueTasks > 0 ? (
          <p className="text-red-400">
            {`Overdue tasks: ${project.overDueTasks}`}{" "}
          </p>
        ) : (
          <></>
        )}
      </div>

      <div className="min-w-[120px]">
        <StatusTag status={status} />
      </div>
      <div className="ml-auto">
        <Link
          href={`/projects/${project.id}`}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-500"
        >
          View
        </Link>
      </div>
    </div>
  );
}

function StatusTag({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    active: "bg-green-500 text-white",
    completed: "bg-purple-500 text-white",
    upcoming: "bg-yellow-200 text-black",
    cancelled: "bg-gray-500 text-white",
  };

  const baseClasses = "rounded-full px-2.5 py-1 text-xs font-medium";
  const statusClass =
    statusStyles[status.toLowerCase()] || "bg-gray-600 text-white";

  return (
    <span className={`${baseClasses} ${statusClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
