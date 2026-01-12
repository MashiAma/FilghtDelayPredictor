export default function DashboardCard({ title, value }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-700 dark:text-white rounded-xl shadow-md text-center">
      <p className="text-gray-500 dark:text-gray-300 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}