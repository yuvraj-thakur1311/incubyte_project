
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchSweets, 
  searchSweets,
  purchaseSweet,
  addSweet,
  updateSweet,
  deleteSweet,
  restockSweet,
  clearSweetsError 
} from "../redux/features/sweets/sweetsSlice";
import { Search, Plus, Edit, Trash2, ShoppingCart, Package, AlertCircle, User, LogOut, Bell, Settings } from "lucide-react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: sweets, loading, error } = useSelector((state) => state.sweets);
  
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    dispatch(fetchSweets());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearSweetsError()), 5000);
    }
  }, [error, dispatch]);

  const handleDelete = (sweet) => {
     setDeleteConfirm(sweet);

};

const confirmDelete = () => {
  if (deleteConfirm) {
    dispatch(deleteSweet(deleteConfirm._id))
      .unwrap()
      .then(() => {
        toast.success(`${deleteConfirm.name} deleted successfully!`);
        setDeleteConfirm(null);
      })
      .catch(() => {
        toast.error("Failed to delete sweet");
        setDeleteConfirm(null);
      });
  }
};
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    if (searchTerm.trim()) {
      dispatch(searchSweets({ search: searchTerm }));
    } else {
      dispatch(fetchSweets());
    }
  };

  const handlePurchase = (sweetId) => {
  dispatch(purchaseSweet({ id: sweetId, quantity: 1 }))
    .unwrap()
    .then(() => {
      toast.success("Purchase successful!");
    })
    .catch(() => {
      toast.error("Failed to purchase");
    });
};
  const handleRestock = (sweetId, quantity = 5) => {
  dispatch(restockSweet({ id: sweetId, quantity }))
    .unwrap()
    .then((response) => {
      toast.success(`Restocked ${response.sweet?.name || "Sweet"} by ${quantity}! 🎉`);
    })
    .catch(() => {
      toast.error("Failed to restock sweet");
    });
};

const handleAdd = (sweetData) => {
  dispatch(addSweet(sweetData))
    .unwrap()
    .then(() => {
      toast.success("Sweet added!");
      setShowAddForm(false);
    })
    .catch(() => {
      toast.error("Failed to add sweet");
    });
};
  const handleUpdate = (sweetData) => {
  dispatch(updateSweet({
    id: sweetData._id,  // pass the ID
    name: sweetData.name,
    category: sweetData.category,
    price: sweetData.price,
    quantity: sweetData.quantity,
  }))
    .unwrap()
    .then(() => {
      toast.success("Sweet updated!");
      setEditingSweet(null);
    })
    .catch(() => {
      toast.error("Failed to update sweet");
    });
};


 const filteredSweets = sweets.filter(sweet => {
  const nameLower = sweet.name?.toLowerCase() || "";
  const searchLower = search.toLowerCase();
  const matchesSearch = nameLower.includes(searchLower);
  if (filter === "available") return matchesSearch && sweet.quantity > 0;
  if (filter === "outOfStock") return matchesSearch && sweet.quantity === 0;
  return matchesSearch;
});

  // Fixed stats calculation
  const stats = {
    total: sweets.length,
    available: sweets.filter(s => s.quantity > 0).length,
    outOfStock: sweets.filter(s => s.quantity === 0).length,
    totalValue: sweets.reduce((sum, s) => sum + (parseFloat(s.price) * parseInt(s.quantity)), 0),
    lowStock: sweets.filter(s => s.quantity > 0 && s.quantity <= 5).length
  };

  if (loading && sweets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delicious sweets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Enhanced Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200 p-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🍭</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Sweet Paradise
                  </h1>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            </div>

          

            {/* Right side - User menu and actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                {stats.lowStock > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.lowStock}
                  </span>
                )}
              </button>

              {/* Add Sweet Button */}
              {isAdmin && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:block">Add Sweet</span>
                </button>
              )}

              {/* User Profile Menu */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xl font-medium text-gray-900">{user?.name || user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sweets</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <Package className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sweets by name..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors min-w-[150px]"
            >
              <option value="all">All Items</option>
              <option value="available">Available Only</option>
              <option value="outOfStock">Out of Stock</option>
            </select>

            <button
            onClick={() => {
              setSearch("");
              setFilter("all");
              setPriceRange([0, 1000]);
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
          </div>
        </div>

        {/* Sweets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map((sweet, index) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              isAdmin={isAdmin}
              onPurchase={handlePurchase}
              onRestock={handleRestock}
              onEdit={setEditingSweet}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>

        {filteredSweets.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sweets found</h3>
            <p className="text-gray-500">
              {search ? "Try adjusting your search terms" : "No sweets available at the moment"}
            </p>
          </div>
        )}
      </div>

      {/* Add Sweet Modal */}
      {showAddForm && (
        <AddSweetModal 
          onClose={() => setShowAddForm(false)}
          onUpdate={handleAdd}
        />
      )}

      {/* Edit Sweet Modal */}
      {editingSweet && (
        <EditSweetModal
          sweet={editingSweet}
          onClose={() => setEditingSweet(null)}
          onUpdate={handleUpdate}
        />
      )}

    {deleteConfirm && (
      <DeleteConfirmationModal
        sweet={deleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    )}

    </div>
  );
};

// Enhanced Sweet Card Component with fixed quantity handling

const SweetCard = ({ sweet, isAdmin, onPurchase, onRestock, onEdit, onDelete }) => {
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

  const safePrice = isNaN(parseFloat(sweet.price)) ? 0 : parseFloat(sweet.price);
  const safeQuantity = isNaN(parseInt(sweet.quantity, 10)) ? 0 : parseInt(sweet.quantity, 10);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{sweet.name}</h3>
        <div className="flex flex-col gap-1">
          {isOutOfStock && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          )}
          {isLowStock && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
              Low Stock
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Category</span>
          <span className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">{sweet.category}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Price</span>
          <span className="text-sm font-bold text-purple-600">₹{safePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Quantity</span>
          <span className={`text-sm font-bold ${
            isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {safeQuantity}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {isAdmin ? (
          <>
            <button
              onClick={() => onRestock(sweet._id, 5)}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all text-sm font-medium shadow-sm hover:shadow"
            >
              +5 Stock
            </button>
            <button
              onClick={() => onEdit(sweet)}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow"
              title="Edit Sweet"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(sweet)}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm hover:shadow"
              title="Delete Sweet"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onPurchase(sweet._id)}
            disabled={isOutOfStock}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-all shadow-sm ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow transform hover:scale-105"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Purchase"}
          </button>
        )}
      
      </div>
    </div>
  );
};
// Enhanced Add Sweet Modal Component
const AddSweetModal = ({ onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate({
        // id: sweet._id,  // ✅ pass _id
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity, 10) || 0
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Sweet</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter sweet name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Cake, Cookie, Candy"
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
            
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Add Sweet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ sweet, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete <strong>{sweet.name}</strong>?</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


// Enhanced Edit Sweet Modal Component
const EditSweetModal = ({ sweet, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    _id: sweet._id,  
    name: sweet.name,
    category: sweet.category,
    price: sweet.price.toString(),
    quantity: sweet.quantity.toString()
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    onUpdate({
      _id: formData._id,   // make sure to include ID here
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity, 10) || 0,
    });
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Edit Sweet</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
            
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Update Sweet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;