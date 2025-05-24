import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { CommentInput } from "~/types";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CommentInput)
    .mutation(async ({ ctx, input }) => {
      const { taskId, body } = input;
      const userId = ctx.session.user.id;

      return ctx.db.comment.create({
        data: {
          taskId,
          body,
          userId,
        },
      });
    }),

  getCommentsByTaskId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.findMany({
        where: {
          taskId: input,
        },
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return comments;
    }),

  //   update: protectedProcedure
  //     .input(updateTaskInput)
  //     .mutation(async ({ ctx, input }) => {
  //       const { id, data } = input;

  //       const updatedTask = await ctx.db.task.update({
  //         where: { id },
  //         data,
  //       });

  //       return updatedTask;
  //     }),
});
