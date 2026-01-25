import { Save, Upload } from "lucide-react";

export default function HeroPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hero Section</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage the main homepage banner.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-french-blue hover:bg-french-blue/90 text-white rounded-xl transition-colors font-medium">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-deep-twilight-200 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Heading</label>
              <input 
                type="text" 
                defaultValue="Precision Lab Equipment" 
                className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subheading</label>
              <textarea 
                rows={3}
                defaultValue="Your trusted partner for high-quality scientific instruments and laboratory supplies." 
                className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Button Text</label>
                <input 
                  type="text" 
                  defaultValue="Explore Products" 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Button Link</label>
                <input 
                  type="text" 
                  defaultValue="/products" 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview/Image */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-deep-twilight-200 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Background Image</h3>
            
            <div className="aspect-video w-full bg-gray-100 dark:bg-deep-twilight-300 rounded-lg overflow-hidden relative group cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-french-blue dark:hover:border-sky-aqua transition-colors flex items-center justify-center">
              <div className="text-center p-4">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag & drop</p>
              </div>
              {/* Mock Preview Image */}
              <img 
                src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600" 
                alt="Preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
              />
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended size: 1920x1080px. Max 2MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
