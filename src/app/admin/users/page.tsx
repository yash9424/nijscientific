"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, X, Loader2, User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";

interface UserType {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({ 
        name: user.name, 
        mobile: user.mobile, 
        email: user.email,
        password: "", // Don't show password on edit
      });
    } else {
      setEditingUser(null);
      setFormData({ name: "", mobile: "", email: "", password: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", mobile: "", email: "", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingUser 
        ? `/api/users/${editingUser._id}`
        : "/api/users";
      
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        fetchUsers();
        handleCloseModal();
      } else {
        alert(result.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        alert(result.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map(u => u._id));
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
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) return;

    const promise = fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    }).then(async (res) => {
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Failed to delete users');
      return result;
    });

    toast.promise(promise, {
      loading: 'Deleting users...',
      success: () => {
        setUsers(users.filter(u => !selectedIds.includes(u._id)));
        setSelectedIds([]);
        return 'Users deleted successfully';
      },
      error: (err) => err.message || 'Failed to delete users',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage admin users and permissions.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-french-blue hover:bg-french-blue/90 text-white rounded-xl transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
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
                        checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-french-blue focus:ring-french-blue"
                    />
                </th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Mobile</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-deep-twilight-300/50 transition-colors">
                    <td className="px-6 py-4">
                        <input 
                            type="checkbox"
                            checked={selectedIds.includes(user._id)}
                            onChange={(e) => handleSelectOne(user._id, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-french-blue focus:ring-french-blue"
                        />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-french-blue/10 dark:bg-sky-aqua/10 flex items-center justify-center text-french-blue dark:text-sky-aqua">
                            <User className="w-4 h-4" />
                        </div>
                        {user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.mobile}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-gray-400 hover:text-french-blue dark:hover:text-sky-aqua transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-deep-twilight-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingUser ? "Edit User" : "Add User"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-deep-twilight-300 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                    placeholder="Full Name"
                    required
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                    type="tel" 
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                    placeholder="Mobile Number"
                    required
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                    placeholder="Email Address"
                    required
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {editingUser ? "Password (Leave blank to keep current)" : "Password"}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-deep-twilight-300 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-french-blue dark:focus:ring-sky-aqua outline-none dark:text-white"
                    placeholder="Password"
                    required={!editingUser}
                    minLength={6}
                    />
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
                  {editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
