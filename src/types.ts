import { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type allProjectsOutput = RouterOutputs["project"]["all"];

export type ProjectType = allProjectsOutput[number];

export const projectInput = z.object({
  name: z.string({ required_error: "Give project a name" }).min(1).max(50),
  startDate: z.date({ required_error: "Please provide project start date" }),
  endDate: z.date({ required_error: "Please provide project end date" }),
});
