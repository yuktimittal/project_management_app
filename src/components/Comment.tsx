import React from "react";
export const Comment = ({ comment }: { comment: string }) => {
  return (
    <div className="rounded-md border border-gray-700 bg-gray-800 p-3 text-sm">
      {comment}
    </div>
  );
};
