import React, { useState } from "react";
import { ITEM_TYPES, ITEM_ORIGINS, ITEM_ERAS, ITEM_MATERIALS } from "../../App.jsx";
import PageHeader from "../shared/PageHeader.jsx";
import Img from "../shared/Img.jsx";

export default function AddItemPage({ 
  addNewItem, 
  goBack, 
  loading,
  changePage
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState(ITEM_TYPES[0]);
  const [origin, setOrigin] = useState(ITEM_ORIGINS[0]);
  const [material, setMaterial] = useState(ITEM_MATERIALS[0]);
  const [era, setEra] = useState(ITEM_ERAS[0]);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function onConfirm() {
    if (!name.trim()) {
      alert("Please provide a name");
      return;
    }
    
    if (!price || Number(price) <= 0) {
      alert("Please provide a valid price");
      return;
    }
    
    const success = await addNewItem({
      title: name,
      price,
      img: preview || "/images/placeholder.png",
      type,
      origin,
      material,
      era: era,
    });
    
    if (success) {
      setName("");
      setType(ITEM_TYPES[0]);
      setOrigin(ITEM_ORIGINS[0]);
      setMaterial(ITEM_MATERIALS[0]);
      setEra(ITEM_ERAS[0]);
      setPrice("");
      setImage(null);
      setPreview(null);
      goBack();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Add New Item" showBack={true} onBack={goBack} />
      
      <div className="p-4">
        <div className="border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-sm">
          <div className="text-center font-bold text-sm text-gray-800 mb-2">Add New Item</div>
          
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Item Name"
          />
          
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:border-blue-400 text-sm bg-white"
            >
              {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:border-blue-400 text-sm bg-white"
            >
              {ITEM_ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          
          <div className="flex gap-2">
            <select
              value={era}
              onChange={(e) => setEra(Number(e.target.value))}
              className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:border-blue-400 text-sm bg-white"
            >
              {ITEM_ERAS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:border-blue-400 text-sm bg-white"
            >
              {ITEM_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
          />
          
          <label className="block text-sm font-medium text-gray-700 mt-3">
            Image:
          </label>
          
          <input
            type="file"
            onChange={onFile}
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          {preview && (
            <div className="mt-3 w-20 h-20 rounded-lg border border-gray-300 overflow-hidden mx-auto">
              <Img src={preview} alt="Preview" />
            </div>
          )}
          
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={goBack}
              className="flex-1 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading || !name.trim() || !price}
              className="flex-1 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}