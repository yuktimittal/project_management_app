import { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";
import {
  TaskPriorityChoices,
  TaskStatusChoices,
  TaskTypeOptions,
} from "./constants";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type allProjectsOutput = RouterOutputs["project"]["all"];
type allTasksOutput = RouterOutputs["task"]["getTasksByProjectId"];
type allUserOutput = RouterOutputs["user"]["all"];
type allCommentForTaskOutput = RouterOutputs["comment"]["getCommentsByTaskId"];

export type ProjectType = allProjectsOutput[number];

export type TasksType = allTasksOutput;
export type UserType = allUserOutput[number];
export type CommentType = allCommentForTaskOutput[number];

export const projectInput = z.object({
  name: z.string({ required_error: "Give project a name" }).min(1).max(50),
  startDate: z.date({ required_error: "Please provide project start date" }),
  endDate: z.date({ required_error: "Please provide project end date" }),
});

export const taskInput = z.object({
  projectId: z.string().cuid(),
  title: z.string({ required_error: "Give project a name" }).min(1).max(50),
  description: z.string().optional(),
  priority: z.enum(
    Object.values(TaskPriorityChoices) as [string, ...string[]],
    {
      required_error: "Priority is required",
      invalid_type_error: `Priority must be one of: ${Object.values(TaskPriorityChoices)} `,
    },
  ),
  assigneeId: z.string().cuid().optional(),
  type: z.string(),
});

export const updateTaskInput = z.object({
  id: z.string().cuid(),
  data: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      priority: z
        .enum(Object.values(TaskPriorityChoices) as [string, ...string[]], {
          invalid_type_error: `Priority must be one of: ${Object.values(TaskPriorityChoices)} `,
        })
        .optional(),
      assigneeId: z.string().cuid().optional(),
      status: z
        .enum(Object.values(TaskStatusChoices) as [string, ...string[]], {
          invalid_type_error: `Status must be one of: ${Object.values(TaskStatusChoices)}`,
        })
        .optional(),
      type: z
        .enum(TaskTypeOptions as [string, ...string[]], {
          invalid_type_error: `Type must be one of: ${Object.values(TaskPriorityChoices)} `,
        })
        .optional(),
      dueDate: z.date().optional(),
    })
    .partial(),
});

export const TaskFormType = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  assigneeId: z.string().optional(),
  type: z.enum(TaskTypeOptions as [string, ...string[]]),
  dueDate: z.date().optional(),
});

export const CommentInput = z.object({
  taskId: z.string().cuid(),
  body: z.string(),
});
