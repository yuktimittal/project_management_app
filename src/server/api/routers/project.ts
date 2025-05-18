import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { projectInput } from "~/types";

export const projectRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        createdBy: {
          select: { name: true },
        },
      },
    });

    return projects.map(({ id, name, startDate, endDate, createdBy }) => ({
      id,
      name,
      startDate,
      endDate,
      createdBy,
    }));
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
});
