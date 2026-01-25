"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit, Trash, X, Upload, Loader2, Image as ImageIcon, Video } from "lucide-react";
import Image from "next/image";

interface Hero {
  _id: string;
  tag: string;
  headline: string;
  subheadline: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  order: number;
}

export default function HeroPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    tag: "",
    headline: "",
    subheadline: "",
    order: 0,
  });
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      if (data.success) {
        setHeroes(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch hero slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (hero?: Hero) => {
    if (hero) {
      setEditingHero(hero);
      setFormData({ 
        tag: hero.tag, 
        headline: hero.headline, 
        subheadline: hero.subheadline,
        order: hero.order
      });
      setMediaPreview(hero.mediaUrl);
      setMediaType(hero.mediaType);
      setMediaFile(null);
    } else {
      setEditingHero(null);
      setFormData({ tag: "", headline: "", subheadline: "", order: 0 });
      setMediaPreview(null);
      setMediaType('image');
      setMediaFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHero(null);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 20MB Limit
      if (file.size > 20 * 1024 * 1024) {
        alert("File size exceeds 20MB limit");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("tag", formData.tag);
      data.append("headline", formData.headline);
      data.append("subheadline", formData.subheadline);
      data.append("order", formData.order.toString());
      
      if (mediaFile) {
        data.append("media", mediaFile);
      }

      const url = editingHero 
        ? `/api/hero/${editingHero._id}` 
        : "/api/hero";
      
      const method = editingHero ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        fetchHeroes();
        handleCloseModal();
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const res = await fetch(`/api/hero/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchHeroes();
      } else {
        alert(data.error || "Failed to delete slide");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  const filteredHeroes = heroes.filter(hero => 
    hero.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hero.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hero Section</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your homepage hero slides</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-french-blue text-white rounded-xl hover:bg-french-blue/90 transition-colors shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5" />
          <span>Add Slide</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 bg-white dark:bg-deep-twilight-200 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search slides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border-none rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-french-blue animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeroes.map((hero) => (
            <div key={hero._id} className="bg-white dark:bg-deep-twilight-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all">
              {/* Media Preview */}
              <div className="relative h-48 bg-gray-100 dark:bg-deep-twilight-300">
                {hero.mediaType === 'video' ? (
                  <video 
                    src={hero.mediaUrl} 
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <Image 
                    src={hero.mediaUrl} 
                    alt={hero.headline} 
                    fill 
                    className="object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenModal(hero)}
                    className="p-2 bg-white/90 dark:bg-deep-twilight-200/90 text-gray-700 dark:text-gray-200 rounded-lg hover:text-french-blue dark:hover:text-sky-aqua shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(hero._id)}
                    className="p-2 bg-white/90 dark:bg-deep-twilight-200/90 text-gray-700 dark:text-gray-200 rounded-lg hover:text-red-500 shadow-sm"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                {hero.tag && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-french-blue/90 text-white text-xs font-semibold rounded-lg backdrop-blur-sm">
                    {hero.tag}
                  </span>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white truncate" title={hero.headline}>
                  {hero.headline}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {hero.subheadline}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    {hero.mediaType === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {hero.mediaType === 'video' ? 'Video Slide' : 'Image Slide'}
                  </span>
                  <span>Order: {hero.order}</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredHeroes.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-deep-twilight-200 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No slides found</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingHero ? "Edit Slide" : "Add Slide"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-deep-twilight-300 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {/* Tag & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tag (Optional)</label>
                  <input 
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                    placeholder="e.g. New Arrival"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Order</label>
                  <input 
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Headline</label>
                <input 
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                  placeholder="Slide Title"
                  required
                />
              </div>

              {/* Subheadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subheadline (Small Line)</label>
                <textarea 
                  value={formData.subheadline}
                  onChange={(e) => setFormData({...formData, subheadline: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white min-h-[80px]"
                  placeholder="Short description..."
                />
              </div>

              {/* Media Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Media Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={mediaType === 'image'}
                      onChange={() => {
                        setMediaType('image');
                        setMediaFile(null);
                        setMediaPreview(null);
                      }}
                      className="w-4 h-4 text-french-blue focus:ring-french-blue dark:bg-deep-twilight-300 dark:border-gray-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={mediaType === 'video'}
                      onChange={() => {
                        setMediaType('video');
                        setMediaFile(null);
                        setMediaPreview(null);
                      }}
                      className="w-4 h-4 text-french-blue focus:ring-french-blue dark:bg-deep-twilight-300 dark:border-gray-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Video</span>
                  </label>
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mediaType === 'video' ? 'Background Video' : 'Background Image'}
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-french-blue dark:hover:border-sky-aqua transition-colors bg-gray-50 dark:bg-deep-twilight-300/50 overflow-hidden group"
                >
                  {mediaPreview ? (
                    <>
                      {mediaType === 'video' ? (
                        <video 
                          src={mediaPreview} 
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                        />
                      ) : (
                        <Image 
                          src={mediaPreview} 
                          alt="Preview" 
                          fill 
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium flex items-center gap-2">
                          <Edit className="w-5 h-5" /> Change {mediaType === 'video' ? 'Video' : 'Image'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-french-blue/10 dark:bg-sky-aqua/10 text-french-blue dark:text-sky-aqua rounded-full flex items-center justify-center mx-auto mb-3">
                        {mediaType === 'video' ? <Video className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Click to upload {mediaType}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {mediaType === 'video' ? 'MP4, WebM (Max 20MB)' : 'JPG, PNG, WebP (Max 5MB)'}
                      </p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept={mediaType === 'video' ? "video/*" : "image/*"}
                    onChange={handleMediaChange}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-deep-twilight-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-french-blue hover:bg-french-blue/90 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingHero ? "Save Changes" : "Add Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
