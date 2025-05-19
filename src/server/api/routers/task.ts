import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { taskInput, updateTaskInput } from "~/types";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskInput)
    .mutation(async ({ ctx, input }) => {
      const { title, description, type, priority, projectId, assigneeId } =
        input;
      const reporterId = ctx.session.user.id;
      return ctx.db.task.create({
        data: {
          title,
          projectId,
          reporterId,
          type,
          priority,
          ...(description && { description }),
          ...(assigneeId && { assigneeId }),
        },
      });
    }),

  getTasksByProjectId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.db.task.findMany({
        where: {
          projectId: input,
        },
        include: {
          reporter: {
            select: { name: true },
          },
          assignee: {
            select: { name: true },
          },
        },
      });

      return tasks;
    }),

  update: protectedProcedure
    .input(updateTaskInput)
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const updatedTask = await ctx.db.task.update({
        where: { id },
        data,
      });

      return updatedTask;
    }),
});
