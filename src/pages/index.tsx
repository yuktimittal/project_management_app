import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Projects from "../components/Projects";
import CreateProject from "~/components/CreateProject";
import { useEffect } from "react";
import Header from "~/components/Header";

export default function Home() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/login");
    }
  }, [sessionData]);
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 p-8 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <CreateProject />
        </div>
        <Projects />
      </div>
    </>
  );
}
