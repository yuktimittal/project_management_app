import React from "react";
import { dateFormatter } from "~/utils/utils";

export const ProjectDetailsBox = ({
  project,
  isLoading,
}: {
  project: any;
  isLoading: Boolean;
}) => {
  return (
    <div className="mb-6 w-full rounded-2xl bg-zinc-800 p-6 text-white shadow-lg">
      {isLoading || !project ? (
        "Loading..."
      ) : (
        <>
          <h2 className="mb-2 text-2xl font-bold">{project.name}</h2>
          {project.description && (
            <p className="mb-2 text-zinc-300">{project.description}</p>
          )}
          <div className="flex gap-6 text-sm text-zinc-400">
            <span>
              Start: {dateFormatter.format(new Date(project.startDate))}
            </span>
            <span>End: {dateFormatter.format(new Date(project.endDate))}</span>
            <span>Created by: {project.createdBy.name}</span>
          </div>
        </>
      )}
    </div>
  );
};
