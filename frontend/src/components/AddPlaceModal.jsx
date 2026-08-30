import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import axios from 'axios';

const AddPlaceModal = ({ isOpen, onClose, selectedCoords, onPlaceAdded, onPickOnMap }) => {
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    category: 'public',
    kebele: '',
    lat: '',
    lng: '',
    landmark: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update coords if user picks from map while modal is open (or just before opening)
  useEffect(() => {
    if (selectedCoords) {
      setFormData(prev => ({
        ...prev,
        lat: selectedCoords.lat.toFixed(6),
        lng: selectedCoords.lng.toFixed(6)
      }));
    }
  }, [selectedCoords]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/places`, formData);
      onPlaceAdded();
      onClose();
      // Reset form
      setFormData({
        name: '', name_en: '', category: 'public', kebele: '', 
        lat: '', lng: '', landmark: '', phone: ''
      });
    } catch (error) {
      console.error('Failed to add place', error);
      alert('Failed to add place');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:fade-in-0 duration-300">
        <div className="p-4 bg-emerald-700 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg">Add New Place</h2>
          <button onClick={onClose} className="hover:bg-emerald-600 p-1 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto pb-safe">
          
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm flex flex-col gap-3 border border-emerald-100 shadow-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              <p className="leading-relaxed">Tap the map to automatically fill in the GPS coordinates for this location.</p>
            </div>
            <button
              type="button"
              onClick={onPickOnMap}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Pick on Map
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name (Amharic) *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-slate-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" placeholder="የቦታው ስም"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name (English)</label>
            <input type="text" name="name_en" value={formData.name_en} onChange={handleChange} className="w-full border-slate-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" placeholder="Place Name"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full border-slate-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border">
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="transport">Transport</option>
                <option value="factory">Factory</option>
                <option value="hotel">Hotel</option>
                <option value="church">Church</option>
                <option value="industry">Industry</option>
                <option value="government">Government</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kebele</label>
              <input type="text" name="kebele" value={formData.kebele} onChange={handleChange} className="w-full border-slate-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" placeholder="e.g. 04"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Latitude *</label>
              <input required type="text" name="lat" value={formData.lat} onChange={handleChange} className="w-full border-slate-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border bg-slate-50"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Longitude *</label>
              <input required type="text" name="lng" value={formData.lng} onChange={handleChange} className="w-full border-slate-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border bg-slate-50"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Landmark</label>
            <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full border-slate-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" placeholder="Nearest landmark"/>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Place'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlaceModal;
