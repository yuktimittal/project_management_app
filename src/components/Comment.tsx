import React from "react";
import type { CommentType } from "~/types";
import { datetimeformater } from "~/utils/utils";
export const Comment = ({ comment }: { comment: CommentType }) => {
  return (
    <div className="rounded-md border border-gray-700 bg-gray-800 p-3 text-sm">
      <div className="mb-1 flex justify-between text-gray-500">
        <span>{comment.user.name}</span>
        <span>{datetimeformater.format(comment.createdAt)}</span>
      </div>
      <div>{comment.body}</div>
    </div>
  );
};
