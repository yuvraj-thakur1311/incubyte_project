import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchSweets, searchSweets, purchaseSweet } from "../redux/features/sweets/sweetsSlice";
import { Search, ShoppingCart, Heart, Star, Package, TrendingUp } from "lucide-react";

export const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: sweets, loading } = useSelector((state) => state.sweets);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]); // min-max range for filtering
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState({});
  const [localSweets, setLocalSweets] = useState([]);

  // Fetch sweets
  useEffect(() => {
    dispatch(fetchSweets()).then((res) => setLocalSweets(res.payload || []));
  }, [dispatch]);

  // Search handler
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    if (searchTerm.trim()) {
      dispatch(searchSweets({ search: searchTerm }));
    } else {
      dispatch(fetchSweets());
    }
  };

  // Purchase handler with SweetAlert2
  const handlePurchase = async (sweet) => {
    if (sweet.quantity <= 0)
      return Swal.fire("Out of stock!", "This sweet is not available.", "error");

    const { value: quantity } = await Swal.fire({
      title: `Buy ${sweet.name}`,
      input: "number",
      inputLabel: `Enter quantity to buy (max ${sweet.quantity})`,
      inputAttributes: {
        min: 1,
        max: sweet.quantity,
        step: 1,
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Buy",
    });

    if (!quantity) return;

    const buyQty = Math.min(Number(quantity), sweet.quantity);

    const result = await dispatch(purchaseSweet({ id: sweet._id || sweet.id, quantity: buyQty }));

    if (result.meta.requestStatus === "fulfilled") {
      // Only update the purchased sweet
      setLocalSweets((prev) =>
        prev.map((s) =>
          (s._id && sweet._id && s._id === sweet._id) ||
          (s.id && sweet.id && s.id === sweet.id)
            ? { ...s, quantity: s.quantity - buyQty }
            : s
        )
      );

      // Update cart to count unique selected sweets
      setCart((prev) => ({ ...prev, [sweet._id || sweet.id]: 1 }));

      Swal.fire("Purchased!", `You bought ${buyQty} KG of ${sweet.name}.`, "success");
    } else {
      Swal.fire("Error", result.payload || "Purchase failed!", "error");
    }
  };

  // Toggle favorite
  const toggleFavorite = (sweetId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(sweetId)) newFavorites.delete(sweetId);
    else newFavorites.add(sweetId);
    setFavorites(newFavorites);
  };

  const categories = ["all", ...new Set(localSweets.map((s) => s.category))];

  // Filter sweets: name + category + price range
  const filteredSweets = localSweets.filter((sweet) => {
    const matchesSearch = sweet.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || sweet.category === category;
    const matchesPrice = sweet.price >= priceRange[0] && sweet.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const availableSweets = filteredSweets.filter((s) => s.quantity > 0);
  const outOfStockSweets = filteredSweets.filter((s) => s.quantity <= 0);
  const totalCategories = categories.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sweet Paradise 🍭</h1>
            <p className="text-gray-600 text-sm">Welcome back, {user?.name || user?.username}!</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-sm">{user?.name || user?.username || "User"}</span>
            </div>

            <div className="relative">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-sm">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Cart</span>
                <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center">
                  {Object.keys(cart).length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<Package className="w-6 h-6 text-green-600" />} label="Available Sweets" value={availableSweets.length} color="green" />
          <StatCard icon={<TrendingUp className="w-6 h-6 text-purple-600" />} label="Categories" value={totalCategories} color="purple" />
          <StatCard icon={<Package className="w-6 h-6 text-red-600" />} label="Out of Stock" value={outOfStockSweets.length} color="red" />
          <StatCard icon={<Heart className="w-6 h-6 text-yellow-600" />} label="Favorites" value={favorites.size} color="yellow" />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-0"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-0"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={priceRange[0]}
              min={0}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-20 px-2 py-1 border rounded"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              min={0}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-20 px-2 py-1 border rounded"
              placeholder="Max"
            />
          </div>
          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
              setPriceRange([0, 1000]);
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Sections */}
        <SweetSection
          title="Available Sweets"
          sweets={availableSweets}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onPurchase={handlePurchase}
        />

        {outOfStockSweets.length > 0 && (
          <SweetSection
            title="Currently Unavailable"
            sweets={outOfStockSweets}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onPurchase={handlePurchase}
            isUnavailable
          />
        )}
      </div>
    </div>
  );
};

// StatCard
const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 border-${color}-500`}>
    <div className="flex items-center">
      {icon}
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-xl font-bold text-${color}-600`}>{value}</p>
      </div>
    </div>
  </div>
);

// SweetSection
const SweetSection = ({ title, sweets, favorites, toggleFavorite, onPurchase, isUnavailable = false }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <span
        className={`bg-${isUnavailable ? "red" : "green"}-100 text-${isUnavailable ? "red" : "green"}-800 px-3 py-1 rounded-full text-sm font-medium`}
      >
        {sweets.length} items
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sweets.map((sweet, index) => (
        <UserSweetCard
          key={sweet._id || sweet.id || `${sweet.name}-${index}`}
          sweet={sweet}
          isFavorite={favorites.has(sweet._id || sweet.id)}
          onPurchase={onPurchase}
          onToggleFavorite={toggleFavorite}
          isUnavailable={isUnavailable}
        />
      ))}
    </div>
  </div>
);

// UserSweetCard
const UserSweetCard = ({ sweet, isFavorite, onPurchase, onToggleFavorite, isUnavailable = false }) => {
  const isOutOfStock = sweet.quantity <= 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${
        isUnavailable ? "opacity-75" : "hover:-translate-y-1"
      }`}
    >
      <div className="h-32 bg-gradient-to-br from-pink-200 to-purple-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🧁</div>
        <button
          onClick={() => onToggleFavorite(sweet._id || sweet.id)}
          className={`absolute top-2 right-2 p-1.5 rounded-full ${
            isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-400"
          } shadow-sm hover:scale-110 transition-all`}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Sold Out
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{sweet.name}</h3>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{sweet.category}</span>
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
              <span>4.5</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Available: {sweet.quantity} KG</p>
          <p className="text-gray-600 text-sm">Price: ₹{sweet.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-purple-600">₹{sweet.price.toFixed(2)}</div>
          <button
            onClick={() => onPurchase(sweet)}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-sm hover:shadow-md"
            }`}
          >
            {isOutOfStock ? "Sold Out" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};
