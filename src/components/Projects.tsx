import ProjectCard from "~/components/ProjectCard";
import { api } from "~/utils/api";
export default function Projects() {
  const { data: projects, isLoading, isError } = api.project.all.useQuery();
  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center text-gray-300">
        <h2 className="mb-2 text-2xl font-semibold">Loading Projects...</h2>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center text-gray-300">
        <p className="mb-2 text-2xl font-semibold">
          Something went wrong, please check your network connection and try
          again!
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="mt-6 flex flex-col gap-4">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center text-gray-300">
            <h2 className="mb-2 text-2xl font-semibold">No projects yet</h2>
            <p className="mb-4">Start by creating your first project.</p>
          </div>
        )}
      </div>
    </>
  );
}
