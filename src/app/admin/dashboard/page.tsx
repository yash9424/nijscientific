export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Overview of your store performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Products", value: "124", change: "+12%", color: "bg-blue-500" },
          { label: "Total Categories", value: "8", change: "+2", color: "bg-purple-500" },
          { label: "Monthly Views", value: "45.2k", change: "+24%", color: "bg-green-500" },
          { label: "Inquiries", value: "38", change: "+5%", color: "bg-orange-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-deep-twilight-200 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</span>
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-deep-twilight-200 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-64 flex items-center justify-center">
          <p className="text-gray-400">Activity Chart Placeholder</p>
        </div>
        <div className="bg-white dark:bg-deep-twilight-200 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-64 flex items-center justify-center">
          <p className="text-gray-400">Recent Inquiries Placeholder</p>
        </div>
      </div>
    </div>
  );
}
