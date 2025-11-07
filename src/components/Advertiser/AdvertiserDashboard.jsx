import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PlusCircle, LogOut, TrendingUp, DollarSign, Eye, Trash2, Edit, Users } from 'lucide-react';
import CreateAdModal from './CreateAdModal';

const AdvertiserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [ads, setAds] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAds: 0,
    totalSpent: 0,
    totalViews: 0
  });
  const [viewerStats, setViewerStats] = useState([]);

  useEffect(() => {
    fetchAds();
    fetchViewerStats();
  }, [currentUser]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'ads'), where('advertiserId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const adsData = [];
      let totalSpent = 0;
      let totalViews = 0;
      
      querySnapshot.forEach((doc) => {
        const adData = { id: doc.id, ...doc.data() };
        adsData.push(adData);
        totalSpent += (adData.totalBudget - adData.remainingBudget);
        totalViews += adData.viewCount || 0;
      });
      
      setAds(adsData);
      setStats({
        totalAds: adsData.length,
        totalSpent,
        totalViews
      });
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchViewerStats = async () => {
    try {
      // Get all ads by this advertiser
      const adsQuery = query(collection(db, 'ads'), where('advertiserId', '==', currentUser.uid));
      const adsSnapshot = await getDocs(adsQuery);
      const adIds = adsSnapshot.docs.map(doc => doc.id);

      if (adIds.length === 0) return;

      // Get all views for these ads
      const viewsQuery = query(collection(db, 'views'));
      const viewsSnapshot = await getDocs(viewsQuery);

      // Group views by viewer (sharedBy)
      const viewerMap = {};
      
      for (const viewDoc of viewsSnapshot.docs) {
        const viewData = viewDoc.data();
        
        // Only count views for this advertiser's ads
        if (adIds.includes(viewData.adId)) {
          const viewerId = viewData.sharedBy;
          
          if (!viewerMap[viewerId]) {
            viewerMap[viewerId] = {
              viewerId,
              viewCount: 0,
              email: 'Loading...'
            };
          }
          
          viewerMap[viewerId].viewCount++;
        }
      }

      // Fetch viewer emails
      const viewerStatsArray = await Promise.all(
        Object.values(viewerMap).map(async (viewer) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', viewer.viewerId));
            if (userDoc.exists()) {
              viewer.email = userDoc.data().email;
            }
          } catch (error) {
            console.error('Error fetching viewer email:', error);
          }
          return viewer;
        })
      );

      // Sort by view count
      viewerStatsArray.sort((a, b) => b.viewCount - a.viewCount);
      setViewerStats(viewerStatsArray);
    } catch (error) {
      console.error('Error fetching viewer stats:', error);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await deleteDoc(doc(db, 'ads', adId));
        fetchAds();
        fetchViewerStats();
      } catch (error) {
        console.error('Error deleting ad:', error);
        alert('Failed to delete ad');
      }
    }
  };

  const getAdViewerStats = async (adId) => {
    try {
      const viewsQuery = query(collection(db, 'views'), where('adId', '==', adId));
      const viewsSnapshot = await getDocs(viewsQuery);
      
      const viewerMap = {};
      for (const viewDoc of viewsSnapshot.docs) {
        const viewData = viewDoc.data();
        const viewerId = viewData.sharedBy;
        
        if (!viewerMap[viewerId]) {
          viewerMap[viewerId] = 0;
        }
        viewerMap[viewerId]++;
      }
      
      return viewerMap;
    } catch (error) {
      console.error('Error fetching ad viewer stats:', error);
      return {};
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advertiser Dashboard</h1>
              <p className="text-sm text-gray-600">{currentUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Ads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAds}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Ad Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Ad
          </button>
        </div>

        {/* Viewer Stats */}
        {viewerStats.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Top Viewers</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Viewers who generated the most views for your ads</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viewer Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views Generated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {viewerStats.map((viewer, index) => (
                    <tr key={viewer.viewerId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-lg font-bold ${
                            index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400' : 
                            index === 2 ? 'text-orange-600' : 
                            'text-gray-600'
                          }`}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{viewer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-600">{viewer.viewCount} views</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ads List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Ads</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading ads...</div>
          ) : ads.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No ads yet. Create your first ad to get started!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {ads.map((ad) => (
                <div key={ad.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-4">
                    {ad.imageUrl && (
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{ad.title}</h3>
                      <p className="text-gray-600 mb-3">{ad.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600">
                          <strong>Bid:</strong> ₹{ad.bidPerView}
                        </span>
                        <span className="text-gray-600">
                          <strong>Budget:</strong> ₹{ad.remainingBudget} / ₹{ad.totalBudget}
                        </span>
                        <span className="text-gray-600">
                          <strong>Views:</strong> {ad.viewCount || 0}
                        </span>
                        <span className={`font-semibold ${ad.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <a
                        href={ad.targetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm mt-2 inline-block"
                      >
                        {ad.targetLink}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete ad"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Ad Modal */}
      {showCreateModal && (
        <CreateAdModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchAds();
          }}
        />
      )}
    </div>
  );
};

export default AdvertiserDashboard;
