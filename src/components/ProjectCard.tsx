import type { ProjectType } from "~/types";
import { dateFormatter } from "~/utils/utils";

type ProjectProps = {
  project: ProjectType;
};

export default function ProjectCard({ project }: ProjectProps) {
  const { name, startDate, endDate } = project;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-700 bg-gray-800 p-4 shadow transition hover:bg-gray-700">
      <div>
        <h2 className="text-lg font-semibold text-white">{name}</h2>
        <p className="text-sm text-gray-400">Created by: {"Yukti"}</p>
      </div>
      <div className="text-right text-sm text-gray-300">
        <p>
          {dateFormatter.format(new Date(startDate))} →{" "}
          {dateFormatter.format(new Date(endDate))}
        </p>
      </div>
      <button
        onClick={() => console.log("view")}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-500"
      >
        View
      </button>
    </div>
  );
}
