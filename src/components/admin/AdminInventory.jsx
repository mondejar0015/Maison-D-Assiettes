import React, { useState } from "react";
import { 
  PlusIcon, 
  TrashIcon, 
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import AdminHeader from "./shared/AdminHeader.jsx";
import PageHeader from "../shared/PageHeader.jsx";
import Img from "../shared/Img.jsx";

export default function AdminInventory({ 
  adminItems,
  formatCurrency,
  addNewItem,
  deleteItem,
  goBack,
  loading,
  changePage
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add form state
  const [name, setName] = useState("");
  const [type, setType] = useState("Dinner Plate");
  const [origin, setOrigin] = useState("French (Limoges)");
  const [material, setMaterial] = useState("Porcelain");
  const [era, setEra] = useState(1900);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const filteredItems = adminItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleAddItem() {
    if (!name.trim()) {
      alert("Please provide a name");
      return;
    }

    const newItem = await addNewItem({
      title: name,
      price,
      img: preview || "/images/placeholder.png",
      type,
      origin,
      material,
      era,
    });

    if (newItem) {
      // Reset form
      setName("");
      setType("Dinner Plate");
      setOrigin("French (Limoges)");
      setMaterial("Porcelain");
      setEra(1900);
      setPrice("");
      setImage(null);
      setPreview(null);
      setShowAddForm(false);
      alert("Item added successfully!");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader 
        title="Inventory Management"
        subtitle="Add, edit, or remove items"
        onLogout={() => changePage("login")}
      />

      <div className="p-6">
        {/* Search and Add */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Search items..."
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Add New Item</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Item Name*"
              />
              
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Price*"
                type="number"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="Dinner Plate">Dinner Plate</option>
                <option value="Salad Plate">Salad Plate</option>
                <option value="Dessert Plate">Dessert Plate</option>
                <option value="Soup Bowl">Soup Bowl</option>
                <option value="Decorative Plate">Decorative Plate</option>
              </select>

              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="French (Limoges)">French (Limoges)</option>
                <option value="English (Staffordshire)">English (Staffordshire)</option>
                <option value="Italian (Majolica)">Italian (Majolica)</option>
                <option value="Japanese (Imari/Kutani)">Japanese (Imari/Kutani)</option>
                <option value="American">American</option>
              </select>

              <select
                value={era}
                onChange={(e) => setEra(Number(e.target.value))}
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value={1700}>1700s</option>
                <option value={1800}>1800s</option>
                <option value={1900}>1900s</option>
                <option value={1950}>1950s</option>
                <option value={2000}>2000s</option>
              </select>

              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="Porcelain">Porcelain</option>
                <option value="Bone China">Bone China</option>
                <option value="Stoneware">Stoneware</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Glass">Glass</option>
              </select>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  onChange={onFile}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {preview && (
                  <div className="mt-3 w-24 h-24 rounded-lg border border-gray-300 overflow-hidden">
                    <Img src={preview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={loading || !name.trim() || !price}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Item"}
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Inventory ({filteredItems.length} items)
              </h3>
              <span className="text-sm text-gray-500">
                {adminItems.length} total
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <Img src={item.img} alt={item.title} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {item.type}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {item.origin}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {item.era}s
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.material}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${item.title}"?`)) {
                          deleteItem(item.id);
                        }
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">📦</div>
                <p className="text-gray-500">
                  {searchTerm ? "No items match your search" : "No items in inventory"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 text-blue-600 font-medium hover:text-blue-700"
                  >
                    Add your first item
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}