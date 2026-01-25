import { Plus, Search, MoreVertical, Edit, Trash } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your product categories.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-french-blue hover:bg-french-blue/90 text-white rounded-xl transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border-none rounded-lg text-sm focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-deep-twilight-300 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Products</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                { name: "Glassware", products: 42, status: "Active" },
                { name: "Lab Equipment", products: 28, status: "Active" },
                { name: "Chemicals", products: 156, status: "Active" },
                { name: "Plasticware", products: 89, status: "Active" },
                { name: "Instruments", products: 12, status: "Draft" },
              ].map((cat, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-deep-twilight-300/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{cat.products} items</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cat.status === "Active" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-french-blue dark:hover:text-sky-aqua transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
