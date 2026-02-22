"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit, Trash, X, Upload, Loader2, Image as ImageIcon, Eye, MinusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  category: Category; // Populated
  description: string;
  mainImage: string;
  images: string[];
  isActive: boolean;
  hasTable?: boolean;
  tableColumns?: string[];
  tableRows?: string[][];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    isActive: true,
  });
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState<string[]>([]);
  
  // For tracking deleted images in Edit mode
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Only fetch active categories for the dropdown as per requirements
      const res = await fetch("/api/categories?active=true");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      // Safely handle category whether populated or not
      const categoryId = product.category && typeof product.category === 'object' && '_id' in product.category 
        ? product.category._id 
        : (product.category as unknown as string);

      setFormData({ 
        name: product.name, 
        category: categoryId || "", 
        description: product.description,
        isActive: product.isActive 
      });
      setMainImagePreview(product.mainImage);
      setMainImage(null);
      setAdditionalImages([]);
      setAdditionalImagesPreviews([]);
      setDeletedImages([]);
      
      // Initialize Table Data
      setHasTable(product.hasTable || false);
      setTableColumns(product.tableColumns || []);
      setTableRows(product.tableRows || []);
    } else {
      setEditingProduct(null);
      setFormData({ name: "", category: "", description: "", isActive: true });
      setMainImagePreview(null);
      setMainImage(null);
      setAdditionalImages([]);
      setAdditionalImagesPreviews([]);
      setDeletedImages([]);
      
      // Reset Table Data
      setHasTable(false);
      setTableColumns([]);
      setTableRows([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  
  const handleOpenViewModal = (product: Product) => {
      setViewingProduct(product);
      setIsViewModalOpen(true);
  };
  
  const handleCloseViewModal = () => {
      setIsViewModalOpen(false);
      setViewingProduct(null);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size exceeds 20MB limit");
        if (mainFileInputRef.current) mainFileInputRef.current.value = "";
        return;
      }
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        if (file.size > 20 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 20MB limit and will be skipped`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        if (additionalFileInputRef.current) additionalFileInputRef.current.value = "";
        return;
      }

      setAdditionalImages(prev => [...prev, ...validFiles]);
      
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagesPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewAdditionalImage = (index: number) => {
      setAdditionalImages(prev => prev.filter((_, i) => i !== index));
      setAdditionalImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const markImageForDeletion = (imgUrl: string) => {
      setDeletedImages(prev => [...prev, imgUrl]);
  };

  const undoDeletion = (imgUrl: string) => {
      setDeletedImages(prev => prev.filter(url => url !== imgUrl));
  };

  const [hasTable, setHasTable] = useState(false);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [tableRows, setTableRows] = useState<string[][]>([]);

  // Table Management Functions
  const handleAddColumn = () => {
    setTableColumns([...tableColumns, ""]);
    // Add empty cell to all rows
    setTableRows(tableRows.map(row => [...row, ""]));
  };

  const handleRemoveColumn = (index: number) => {
    const newColumns = tableColumns.filter((_, i) => i !== index);
    setTableColumns(newColumns);
    // Remove cell from all rows
    setTableRows(tableRows.map(row => row.filter((_, i) => i !== index)));
  };

  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...tableColumns];
    newColumns[index] = value;
    setTableColumns(newColumns);
  };

  const handleAddRow = () => {
    setTableRows([...tableRows, new Array(tableColumns.length).fill("")]);
  };

  const handleRemoveRow = (index: number) => {
    setTableRows(tableRows.filter((_, i) => i !== index));
  };

  const handleRowChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableRows];
    newRows[rowIndex][colIndex] = value;
    setTableRows(newRows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("isActive", String(formData.isActive));
      
      // Table Data
      data.append("hasTable", hasTable.toString());
      if (hasTable) {
        data.append("tableColumns", JSON.stringify(tableColumns));
        data.append("tableRows", JSON.stringify(tableRows));
      }

      if (mainImage) {
        data.append("mainImage", mainImage);
      }
      
      additionalImages.forEach(file => {
        data.append("images", file);
      });
      
      deletedImages.forEach(url => {
          data.append("deletedImages", url);
      });

      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : "/api/products";
      
      const method = editingProduct ? "PUT" : "POST";

      const promise = fetch(url, {
        method,
        body: data,
      }).then(async (res) => {
        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Operation failed");
        return result;
      });

      toast.promise(promise, {
        loading: editingProduct ? 'Updating product...' : 'Creating product...',
        success: () => {
          fetchProducts();
          handleCloseModal();
          return editingProduct ? 'Product updated successfully' : 'Product created successfully';
        },
        error: (err) => err.message || 'An error occurred',
      });

      await promise;
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const promise = fetch(`/api/products/${id}`, {
      method: "DELETE",
    }).then(async (res) => {
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to delete");
      return result;
    });

    toast.promise(promise, {
      loading: 'Deleting product...',
      success: () => {
        setProducts(products.filter(p => p._id !== id));
        return 'Product deleted successfully';
      },
      error: (err) => err.message || 'Failed to delete product',
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;

    const promise = fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    }).then(async (res) => {
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Failed to delete products');
      return result;
    });

    toast.promise(promise, {
      loading: 'Deleting products...',
      success: () => {
        setProducts(products.filter(p => !selectedIds.includes(p._id)));
        setSelectedIds([]);
        return 'Products deleted successfully';
      },
      error: (err) => err.message || 'Failed to delete products',
    });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setProducts(products.map(p => 
      p._id === id ? { ...p, isActive: newStatus } : p
    ));

    const promise = fetch(`/api/products/${id}`, {
      method: "PUT",
      body: (() => {
        const formData = new FormData();
        formData.append("isActive", String(newStatus));
        return formData;
      })(),
    }).then(async (res) => {
      const result = await res.json();
      if (!result.success) {
        // Revert on failure
        setProducts(products.map(p => 
          p._id === id ? { ...p, isActive: currentStatus } : p
        ));
        throw new Error(result.error || "Failed to update status");
      }
      return result;
    });

    toast.promise(promise, {
      loading: 'Updating status...',
      success: `Product ${newStatus ? 'activated' : 'deactivated'} successfully`,
      error: (err) => {
        // Revert on error
        setProducts(products.map(p => 
          p._id === id ? { ...p, isActive: currentStatus } : p
        ));
        return err.message || 'Failed to update status';
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your product catalog.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-french-blue hover:bg-french-blue/90 text-white rounded-xl transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border-none rounded-lg text-sm focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
            />
          </div>
          {selectedIds.length > 0 && (
            <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm text-sm font-medium"
            >
                <Trash className="w-4 h-4" />
                <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-deep-twilight-300 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-3 w-10">
                    <input 
                        type="checkbox"
                        checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-french-blue focus:ring-french-blue"
                    />
                </th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-deep-twilight-300/50 transition-colors">
                    <td className="px-6 py-4">
                        <input 
                            type="checkbox"
                            checked={selectedIds.includes(product._id)}
                            onChange={(e) => handleSelectOne(product._id, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-french-blue focus:ring-french-blue"
                        />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                        <Image 
                          src={product.mainImage} 
                          alt={product.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{product.category?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(product._id, product.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-french-blue focus:ring-offset-2 ${
                          product.isActive ? 'bg-french-blue' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`${
                            product.isActive ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenViewModal(product)}
                          className="p-2 text-gray-400 hover:text-french-blue dark:hover:text-sky-aqua transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-gray-400 hover:text-french-blue dark:hover:text-sky-aqua transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-deep-twilight-300 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                    <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                    placeholder="Product Name"
                    required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                    required
                    >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                    </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-french-blue focus:ring-offset-2 ${
                        formData.isActive ? 'bg-french-blue' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`${
                          formData.isActive ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white min-h-[100px]"
                  placeholder="Product Description"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasTable"
                    checked={hasTable}
                    onChange={(e) => setHasTable(e.target.checked)}
                    className="w-4 h-4 text-french-blue rounded border-gray-300 focus:ring-french-blue dark:bg-deep-twilight-300 dark:border-gray-600"
                  />
                  <label htmlFor="hasTable" className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                    Include Specifications Table
                  </label>
                </div>
              </div>

              {hasTable && (
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50/50 dark:bg-deep-twilight-300/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Table Configuration</h3>
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="text-xs px-3 py-1.5 bg-french-blue text-white rounded-lg hover:bg-french-blue/90 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Column
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          {tableColumns.map((col, colIndex) => (
                            <th key={colIndex} className="p-1 min-w-[150px]">
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={col}
                                  onChange={(e) => handleColumnChange(colIndex, e.target.value)}
                                  placeholder={`Column ${colIndex + 1}`}
                                  className="w-full px-2 py-1 bg-white dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded text-xs focus:ring-1 focus:ring-french-blue outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColumn(colIndex)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                  title="Remove Column"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {tableRows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <td key={colIndex} className="p-1">
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => handleRowChange(rowIndex, colIndex, e.target.value)}
                                  className="w-full px-2 py-1 bg-white dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded text-xs focus:ring-1 focus:ring-french-blue outline-none"
                                />
                              </td>
                            ))}
                            <td className="p-1 w-8 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(rowIndex)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                title="Remove Row"
                              >
                                <MinusCircle className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-french-blue hover:border-french-blue transition-colors text-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Main Image</label>
                <div 
                  onClick={() => mainFileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-french-blue dark:hover:border-sky-aqua transition-colors bg-gray-50 dark:bg-deep-twilight-300"
                >
                  {mainImagePreview ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image src={mainImagePreview} alt="Preview" fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload main image</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">(Max 20MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={mainFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    required={!editingProduct}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {/* Existing Images (Edit Mode) */}
                   {editingProduct && editingProduct.images.map((img, idx) => (
                       <div key={idx} className={`relative aspect-square rounded-lg overflow-hidden border ${deletedImages.includes(img) ? 'opacity-50 grayscale border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
                           <Image src={img} alt={`Extra ${idx}`} fill className="object-cover" />
                           <button
                             type="button"
                             onClick={() => deletedImages.includes(img) ? undoDeletion(img) : markImageForDeletion(img)}
                             className={`absolute top-1 right-1 p-1 rounded-full ${deletedImages.includes(img) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                             title={deletedImages.includes(img) ? "Undo Delete" : "Delete Image"}
                           >
                               {deletedImages.includes(img) ? <Plus className="w-3 h-3" /> : <X className="w-3 h-3" />}
                           </button>
                       </div>
                   ))}
                   
                   {/* New Uploaded Images Previews */}
                   {additionalImagesPreviews.map((preview, idx) => (
                       <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                           <Image src={preview} alt={`New ${idx}`} fill className="object-cover" />
                           <button
                             type="button"
                             onClick={() => removeNewAdditionalImage(idx)}
                             className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                           >
                               <X className="w-3 h-3" />
                           </button>
                       </div>
                   ))}

                   {/* Upload Button */}
                   <div 
                     onClick={() => additionalFileInputRef.current?.click()}
                     className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-french-blue dark:hover:border-sky-aqua transition-colors bg-gray-50 dark:bg-deep-twilight-300"
                   >
                       <Plus className="w-6 h-6 text-gray-400 mb-1" />
                       <span className="text-xs text-gray-500 text-center">Add More<br/>(Max 20MB)</span>
                       <input 
                        type="file" 
                        ref={additionalFileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesChange}
                      />
                   </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-deep-twilight-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-french-blue hover:bg-french-blue/90 text-white rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Modal */}
      {isViewModalOpen && viewingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                 <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Product Preview
                  </h2>
                  <button 
                    onClick={handleCloseViewModal}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-deep-twilight-300 text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Images Section */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-deep-twilight-300">
                                <Image 
                                    src={viewingProduct.mainImage} 
                                    alt={viewingProduct.name} 
                                    fill 
                                    className="object-contain"
                                />
                            </div>
                            {viewingProduct.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {viewingProduct.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50">
                                            <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Info Section */}
                        <div className="space-y-6">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-french-blue/10 text-french-blue dark:bg-sky-aqua/10 dark:text-sky-aqua text-sm font-medium mb-2">
                                    {viewingProduct.category?.name || 'Uncategorized'}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    {viewingProduct.name}
                                </h1>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {viewingProduct.description}
                                </p>
                            </div>

                            {/* Specifications Table */}
                            {viewingProduct.hasTable && viewingProduct.tableColumns && viewingProduct.tableColumns.length > 0 && viewingProduct.tableRows && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Specifications</h3>
                                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-deep-twilight-300 text-gray-500 dark:text-gray-400 font-medium">
                                                <tr>
                                                    {viewingProduct.tableColumns.map((col, idx) => (
                                                        <th key={idx} className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {viewingProduct.tableRows.map((row, rowIdx) => (
                                                    <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-deep-twilight-300/50">
                                                        {row.map((cell, colIdx) => (
                                                            <td key={colIdx} className="px-4 py-2 text-gray-700 dark:text-gray-300">{cell}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
