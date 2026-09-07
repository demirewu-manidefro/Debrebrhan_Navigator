import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Navigation, Star, Image as ImageIcon, Send } from 'lucide-react';

const PlaceDetailsModal = ({ isOpen, onClose, place, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'reviews', 'photos'
  const [reviews, setReviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  
  // Forms state
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', author_name: '' });
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (isOpen && place) {
      fetchReviews();
      fetchPhotos();
      setActiveTab('details');
    }
  }, [isOpen, place]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${apiUrl}/reviews/${place.id}`);
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`${apiUrl}/photos/${place.id}`);
      setPhotos(res.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/reviews`, {
        place_id: place.id,
        ...newReview
      });
      setNewReview({ rating: 5, comment: '', author_name: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const submitPhoto = async (e) => {
    e.preventDefault();
    if (!newPhotoUrl) return;
    try {
      await axios.post(`${apiUrl}/photos`, {
        place_id: place.id,
        image_url: newPhotoUrl
      });
      setNewPhotoUrl('');
      fetchPhotos();
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  if (!isOpen || !place) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{place.name}</h2>
            {place.name_en && <p className="text-slate-500 dark:text-slate-400">{place.name_en}</p>}
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs rounded-full uppercase font-semibold">
                {place.category}
              </span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs rounded-full">
                Kebele {place.kebele}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-6 w-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-2">
          {['details', 'reviews', 'photos'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab} {tab === 'reviews' && `(${reviews.length})`} {tab === 'photos' && `(${photos.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Landmark / Description</h3>
                <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  {place.landmark || 'No details provided.'}
                </p>
              </div>
              
              {place.phone && (
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact</h3>
                  <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg font-mono">
                    {place.phone}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  onClose();
                  onNavigate(place);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex justify-center items-center gap-2 font-semibold transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
              >
                <Navigation className="h-5 w-5" />
                Navigate Here
              </button>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Add Review Form */}
              <form onSubmit={submitReview} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-3 border border-slate-100 dark:border-slate-700">
                <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Add a Review</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={newReview.author_name}
                    onChange={e => setNewReview({...newReview, author_name: e.target.value})}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
                  />
                  <select
                    value={newReview.rating}
                    onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
                  >
                    {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Your comment..."
                    required
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
                  />
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-4">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {review.author_name || 'Anonymous'}
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({length: review.rating}).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                        </div>
                        <div className="text-xs text-slate-400 ml-auto">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-6">
               <form onSubmit={submitPhoto} className="flex gap-2 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <input
                    type="url"
                    placeholder="Paste Image URL here..."
                    required
                    value={newPhotoUrl}
                    onChange={e => setNewPhotoUrl(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
                  />
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                    <ImageIcon className="h-4 w-4" /> Add
                  </button>
               </form>

               {photos.length === 0 ? (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-4">No photos yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.map(photo => (
                      <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <img src={photo.image_url} alt="Place" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsModal;
