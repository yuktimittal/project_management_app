export default function TaskMetaField({
  label,
  value,
  isEditable = false,
}: {
  label: string;
  value: string;
  isEditable: boolean;
}) {
  return (
    <div className="flex flex-col text-sm">
      <div className="flex">
        <span className="mb-1 text-gray-400">{label}</span>
        {isEditable && (
          <button
            onClick={() => {}}
            title="Edit"
            className="mb-0.5 ml-1 cursor-pointer"
          >
            <img src="/images/edit_icon.svg" alt="edit" className="size-3" />
          </button>
        )}
      </div>

      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
