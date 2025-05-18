import ProjectCard from "~/components/ProjectCard";
import { api } from "~/utils/api";
export default function Projects() {
  const { data: projects, isLoading, isError } = api.project.all.useQuery();
  if (isLoading) {
    return <>Loading Projects...</>;
  }
  if (isError) {
    return <>Something went wrong</>;
  }
  return (
    <>
      <div className="mt-6 flex flex-col gap-4">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>No Projects found</p>
        )}
      </div>
    </>
  );
}
