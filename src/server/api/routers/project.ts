import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { projectInput } from "~/types";

export const projectRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        createdBy: {
          select: {
            name: true,
          },
        },
        Task: {
          select: {
            id: true,
            dueDate: true,
            status: true,
          },
        },
      },
    });
    const now = new Date();
    const projectsList = projects.map(
      ({ id, name, description, startDate, endDate, createdBy, Task }) => {
        const activeTasks = Task.filter(
          (task) => task.status !== "Done" && task.status != "Cancelled",
        );
        const overdueTasks = Task.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) < now &&
            task.status !== "done",
        );
        return {
          id: id,
          name: name,
          description: description,
          startDate: startDate,
          endDate: endDate,
          createdBy: createdBy,
          activeTasks: activeTasks.length,
          overDueTasks: overdueTasks.length,
        };
      },
    );
    return projectsList;
  }),

  create: protectedProcedure
    .input(projectInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  getProjectById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: {
          id: input,
        },
        include: {
          createdBy: {
            select: { name: true },
          },
        },
      });
      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  addMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userIds: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { projectId, userIds } = input;

      // Fetch existing member userIds
      const existingMembers = await ctx.db.projectMembers.findMany({
        where: {
          projectId,
          userId: { in: userIds },
        },
        select: { userId: true },
      });

      const existingIds = new Set(existingMembers.map((m) => m.userId));

      // Filter out users who are already members
      const newUserIds = userIds.filter((id) => !existingIds.has(id));

      if (newUserIds.length === 0) {
        throw new Error(
          "All selected users are already members of this project.",
        );
      }

      const result = await ctx.db.projectMembers.createMany({
        data: userIds.map((userId) => ({
          userId,
          projectId,
        })),
        skipDuplicates: true,
      });

      return result;
    }),
});
