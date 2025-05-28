export default function TaskMetaField({
  label,
  value,
  isEditable = false,
  onClick,
}: {
  label: string;
  value: string;
  isEditable: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col text-sm">
      <div className="flex">
        <span className="mb-1 text-gray-400">{label}</span>
      </div>

      <span
        className={`font-medium text-white ${isEditable && "cursor-pointer pt-1 pb-1 transition hover:bg-gray-700"}`}
        onClick={() => {
          isEditable && onClick && onClick();
        }}
      >
        {value}
      </span>
    </div>
  );
}
