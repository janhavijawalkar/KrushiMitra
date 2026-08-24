export default function StatCard({
  icon,
  title,
  value,
  change,
  positive = true,
}) {
  return (
    <div className="card card-interactive p-5 group cursor-default">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF5EC] text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
          {icon}
        </div>

        <span
          className={`key-cap ${
            positive
              ? "bg-[#E5F7EA] text-[#2E7D32]"
              : "bg-red-50 text-red-500"
          }`}
        >
          {change}
        </span>
      </div>

      <p className="mt-4 text-xs font-medium text-gray-400">
        {title}
      </p>

      <h3 className="mt-1 text-2xl font-extrabold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors">
        {value}
      </h3>
    </div>
  );
}