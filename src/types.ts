import { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";
import { TaskPriorityChoices, TaskStatusChoices } from "./constants";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type allProjectsOutput = RouterOutputs["project"]["all"];

export type ProjectType = allProjectsOutput[number];

export const projectInput = z.object({
  name: z.string({ required_error: "Give project a name" }).min(1).max(50),
  startDate: z.date({ required_error: "Please provide project start date" }),
  endDate: z.date({ required_error: "Please provide project end date" }),
});

export const taskInput = z.object({
  projectId: z.string().uuid(),
  title: z.string({ required_error: "Give project a name" }).min(1).max(50),
  description: z.string().optional(),
  priority: z.enum(
    Object.values(TaskPriorityChoices) as [string, ...string[]],
    {
      required_error: "Priority is required",
      invalid_type_error: `Priority must be one of: ${Object.values(TaskPriorityChoices)} `,
    },
  ),
  assigneeId: z.string().uuid().optional(),
  type: z.string(),
});

export const updateTaskInput = z.object({
  id: z.string().uuid(),
  data: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      priority: z
        .enum(Object.values(TaskPriorityChoices) as [string, ...string[]], {
          invalid_type_error: `Priority must be one of: ${Object.values(TaskPriorityChoices)} `,
        })
        .optional(),
      assigneeId: z.string().uuid().optional(),
      status: z
        .enum(Object.values(TaskStatusChoices) as [string, ...string[]], {
          invalid_type_error: `Status must be one of: ${Object.values(TaskStatusChoices)}`,
        })
        .optional(),
    })
    .partial(),
});
