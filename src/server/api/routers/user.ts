import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
});
