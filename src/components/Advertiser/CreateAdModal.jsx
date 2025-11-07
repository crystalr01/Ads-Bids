import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, Upload, AlertCircle } from 'lucide-react';

const CreateAdModal = ({ onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetLink: '',
    bidPerView: '',
    totalBudget: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const bidPerView = parseFloat(formData.bidPerView);
    const totalBudget = parseFloat(formData.totalBudget);

    if (bidPerView <= 0 || totalBudget <= 0) {
      setError('Bid per view and total budget must be greater than 0');
      return;
    }

    if (totalBudget < bidPerView) {
      setError('Total budget must be at least equal to bid per view');
      return;
    }

    if (!imageFile) {
      setError('Please select an image for the ad');
      return;
    }

    try {
      setLoading(true);

      // Upload image to Firebase Storage
      const imageRef = ref(storage, `ads/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Create ad document in Firestore
      await addDoc(collection(db, 'ads'), {
        advertiserId: currentUser.uid,
        title: formData.title,
        description: formData.description,
        imageUrl,
        targetLink: formData.targetLink,
        bidPerView,
        totalBudget,
        remainingBudget: totalBudget,
        viewCount: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      });

      onSuccess();
    } catch (err) {
      console.error('Error creating ad:', err);
      setError('Failed to create ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Ad</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter ad title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              placeholder="Describe your ad"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Link *
            </label>
            <input
              type="url"
              name="targetLink"
              value={formData.targetLink}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bid Per View (₹) *
              </label>
              <input
                type="number"
                name="bidPerView"
                value={formData.bidPerView}
                onChange={handleInputChange}
                step="0.01"
                min="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="0.20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Budget (₹) *
              </label>
              <input
                type="number"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleInputChange}
                step="0.01"
                min="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="100.00"
                required
              />
            </div>
          </div>

          {formData.bidPerView && formData.totalBudget && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Estimated Views:</strong>{' '}
                {Math.floor(parseFloat(formData.totalBudget) / parseFloat(formData.bidPerView))} views
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-indigo-600 hover:text-indigo-700 font-semibold">
                      Upload an image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Ad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdModal;
