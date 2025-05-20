import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return users.map(({ id, name, email }) => ({
      id,
      name,
      email,
    }));
  }),

  getProjectMembers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const members = await ctx.db.projectMembers.findMany({
        where: {
          projectId: input,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const users = members.map((member) => member.user);
      return users;
    }),
});
